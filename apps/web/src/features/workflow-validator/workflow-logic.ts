import type { Edge, Node } from '@xyflow/react';
import type { WorkflowConfig, AgentState, AgentToolConfig } from '@/utils/state-machine-types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validEdges: string[]; // IDs of edges that are part of a valid path
}

// Helper to get the actual node type from data.type (where palette type is stored)
function getNodeType(node: Node): string {
  return (node.data?.type as string) || node.type || 'unknown';
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: string[] = [];
  const validEdges: Set<string> = new Set();

  // Check for start node using data.type
  const startNode = nodes.find((n) => getNodeType(n) === 'start-node');
  const endNodes = nodes.filter((n) => getNodeType(n) === 'end-node');


  if (!startNode) {
    errors.push('Workflow must have a Start Node.');
  }
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End Node.');
  }

  // Reachability check (BFS)
  if (startNode) {
    const queue = [startNode.id];
    const visited = new Set<string>([startNode.id]);
    const reachableNodes = new Set<string>([startNode.id]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      const outgoingEdges = edges.filter((e) => e.source === currentId);
      for (const edge of outgoingEdges) {
        validEdges.add(edge.id); // Mark edge as visited/reachable
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          reachableNodes.add(edge.target);
          queue.push(edge.target);
        }
      }
    }

    const unreachedEndNodes = endNodes.filter((n) => !reachableNodes.has(n.id));
    if (unreachedEndNodes.length > 0) {
      errors.push('Some End Nodes are not reachable from the Start Node.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    validEdges: Array.from(validEdges),
  };
}

export function extractWorkflowConfig(
  nodes: Node[],
  edges: Edge[],
  tenantId: string = 'default-tenant',
  workflowName: string = 'Extracted Workflow'
): WorkflowConfig | null {
  const startNode = nodes.find((n) => getNodeType(n) === 'start-node');
  if (!startNode) return null;

  // Find initial state (first voice agent connected to start node)
  const startEdge = edges.find((e) => e.source === startNode.id);
  const initialNode = startEdge ? nodes.find((n) => n.id === startEdge.target) : null;
  
  // Helper to normalize keys - use properties.label or data.label
  const getKey = (node: Node) => {
    const props = node.data?.properties as any;
    const label = props?.label || node.data?.label;
    return label 
      ? String(label).toLowerCase().replace(/\s+/g, '_') 
      : node.id;
  };

  const initialStateId = initialNode ? getKey(initialNode) : 'initial';

  const config: WorkflowConfig = {
    id: crypto.randomUUID(),
    tenantId,
    name: workflowName,
    initialState: initialStateId,
    states: {},
    global: {
      language: 'en',
      model: { provider: 'openai', modelName: 'gpt-4o-mini' },
    }
  };

  // Collect all voice agents using data.type
  const voiceAgentNodes = nodes.filter(n => 
    getNodeType(n) === 'voice-agent' || getNodeType(n) === 'voice-node'
  );

  for (const node of voiceAgentNodes) {
    const stateKey = getKey(node);
    const props = node.data?.properties as any || node.data;
    
    // Map basic props
    const agentState: AgentState = {
      name: props?.label || stateKey,
      systemPrompt: props?.systemPrompt || '',
      tools: [],
      model: props?.model,
      voice: props?.voice,
      stt: props?.stt,
    };

    // Process Tools & Transitions
    const tools: AgentToolConfig[] = [];
    const outgoingEdges = edges.filter(e => e.source === node.id);

    for (const edge of outgoingEdges) {
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!targetNode) continue;

      const targetType = getNodeType(targetNode);

      if (targetType === 'voice-agent' || targetType === 'voice-node') {
        // Create transition tool
        const targetKey = getKey(targetNode);
        const targetProps = targetNode.data?.properties as any || targetNode.data;
        const toolName = `transfer_to_${targetKey}`;
        tools.push({
          name: toolName,
          description: `Transfer to ${targetProps?.label || targetKey}`,
          type: 'function',
          config: {},
          transitionTo: targetKey
        });
      } else if (targetType === 'tool-node') {
        // Specialized Tool Node (HTTP)
        const targetProps = targetNode.data?.properties as any || targetNode.data;
        const toolData = targetProps?.tool;
        // if (toolData) {
        //   tools.push({
        //     name: toolData.name || 'http_tool',
        //     description: toolData.description || '',
        //     type: toolData.type || 'http_request',
        //     config: toolData.config || {},
        //   });
        // }
      }
    }

    // Merge internal tools (from the list inside the node)
    if (Array.isArray(props?.tools)) {
      tools.push(...props.tools);
    }

    agentState.tools = tools;
    config.states[stateKey] = agentState;
  }

  return config;
}
