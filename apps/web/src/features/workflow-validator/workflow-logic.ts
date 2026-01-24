import type { Edge, Node } from '@xyflow/react';
import type { WorkflowConfig, AgentState, AgentToolConfig } from '@/utils/state-machine-types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validEdges: string[]; // IDs of edges that are part of a valid path
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: string[] = [];
  const validEdges: Set<string> = new Set();

  // Log for debugging
  console.log('[Validate] Nodes:', nodes.map(n => ({ id: n.id, type: n.type })));
  console.log('[Validate] Edges:', edges.length);

  // Check for start node (try multiple type variations)
  const startNode = nodes.find((n) => 
    n.type === 'start-node' || n.type === 'startNode' || n.type === 'start'
  );
  const endNodes = nodes.filter((n) => 
    n.type === 'end-node' || n.type === 'endNode' || n.type === 'end'
  );

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
  tenantId: string = 'default-tenant'
): WorkflowConfig | null {
  const startNode = nodes.find((n) => n.type === 'start-node');
  if (!startNode) return null;

  // Find initial state (first voice agent connected to start node)
  const startEdge = edges.find((e) => e.source === startNode.id);
  const initialNode = startEdge ? nodes.find((n) => n.id === startEdge.target) : null;
  
  // Helper to normalize keys
  const getKey = (node: Node) => 
    node.data?.label 
      ? String(node.data.label).toLowerCase().replace(/\s+/g, '_') 
      : node.id;

  const initialStateId = initialNode ? getKey(initialNode) : 'initial';

  const config: WorkflowConfig = {
    id: crypto.randomUUID(), // Or from metadata
    tenantId,
    name: 'Extracted Workflow',
    initialState: initialStateId,
    states: {},
    global: {
        language: 'en', // Default
        model: { provider: 'openai', modelName: 'gpt-4o-mini' }, // Defaults
    }
  };

  const traverseQueue = initialNode ? [initialNode] : [];
  const visitedNodes = new Set<string>();
  
  // Collect all voice agents first
  const voiceAgentNodes = nodes.filter(n => n.type === 'voice-agent');

  for (const node of voiceAgentNodes) {
      const stateKey = getKey(node);
      
      // Map basic props
      const agentState: AgentState = {
          name: (node.data?.label as string) || stateKey,
          systemPrompt: (node.data?.systemPrompt as string) || '',
          tools: [],
          // Map overrides if present
          model: node.data?.model as any,
          voice: node.data?.voice as any,
          stt: node.data?.stt as any,
      };

      // Process Tools & Transitions
      const tools: AgentToolConfig[] = [];
      const outgoingEdges = edges.filter(e => e.source === node.id);

      for (const edge of outgoingEdges) {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!targetNode) continue;

          if (targetNode.type === 'voice-agent') {
              // Create transition tool
              const targetKey = getKey(targetNode);
              const toolName = `transfer_to_${targetKey}`;
              tools.push({
                  name: toolName,
                  description: `Transfer to ${targetNode.data?.label || targetKey}`,
                  type: 'function',
                  config: {},
                  transitionTo: targetKey
              });
          } else if (targetNode.type === 'tool-node') {
              // Specialized Tool Node (HTTP)
              const toolData = targetNode.data?.tool as any; // From our new schema
              if (toolData) {
                  tools.push({
                      name: toolData.name || 'http_tool',
                      description: toolData.description || '',
                      type: toolData.type || 'http_request', // Should be http_request
                      config: toolData.config || {},
                      // No transitionTo unless tool node has output edge back to an agent (complex loop)
                      // For now, simple flow
                  });
              }
          }
      }

      // Merge internal tools (from the list inside the node)
      if (Array.isArray(node.data?.tools)) {
          const internalTools = node.data.tools as AgentToolConfig[];
          tools.push(...internalTools);
      }

      agentState.tools = tools;
      config.states[stateKey] = agentState;
  }

  return config;
}
