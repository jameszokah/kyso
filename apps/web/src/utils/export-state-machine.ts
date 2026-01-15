import type { Edge, Node } from '@xyflow/react';
import type { StateMachineConfig, AgentToolConfig, AgentConfig } from './state-machine-types';

export function extractStateMachineConfig(nodes: Node[], edges: Edge[]): StateMachineConfig | null {
  const startNode = nodes.find((node) => node.type === 'start-node');
  if (!startNode) return null;

  const connectedEdge = edges.find((edge) => edge.source === startNode.id);
  const initialNode = connectedEdge ? nodes.find((node) => node.id === connectedEdge.target) : null;
  const initialStateId = initialNode?.data?.label
    ? String(initialNode.data.label).toLowerCase().replaceAll(/\s+/g, '_')
    : 'initial';

  // Extract Call Config from Start Node
  const callConfig = {
    allowCall: (startNode.data?.allowCall as boolean) || false,
    agentName: (startNode.data?.agentName as string) || 'default-agent',
  };

  const config: StateMachineConfig = {
    id: 'generated-workflow', // TODO: Get from metadata
    name: 'Generated Workflow',
    callConfig,
    initialState: initialStateId,
    states: {},
  };

  // Helper to get node by ID
  function getNode(id: string) {
    return nodes.find((n) => n.id === id);
  }

  // Traverse and build states (focusing on voice-agent nodes)
  for (const node of nodes
    .filter((n) => n.type === 'voice-agent')) {
      // Generate state key from label or ID
      const stateKey = node.data?.label ? String(node.data.label).toLowerCase().replaceAll(/\s+/g, '_') : node.id;

      const agentConfig: AgentConfig = {
        id: `${stateKey}_agent`,
        systemPrompt: (node.data?.systemPrompt as string) || '',
        model: (node.data?.model as AgentConfig['model']) || { provider: 'openai', modelName: 'gpt-4o' },
        voice: (node.data?.voice as AgentConfig['voice']) || { provider: 'elevenlabs', voiceId: 'default' },
        stt: (node.data?.stt as AgentConfig['stt']) || { provider: 'deepgram' },
        tools: [], // Populated below
      };

      const transitions: Record<string, string> = {};
      const tools: AgentToolConfig[] = [];

      // Find outgoing edges
      const outgoingEdges = edges.filter((event) => event.source === node.id);

      for (const edge of outgoingEdges) {
        const targetNode = getNode(edge.target);
        if (!targetNode) continue;

        if (targetNode.type === 'voice-agent') {
          // Transition to another agent
          const targetStateKey = targetNode.data?.label
            ? String(targetNode.data.label).toLowerCase().replaceAll(/\s+/g, '_')
            : targetNode.id;

          // Define a transition tool
          const toolName = `transfer_to_${targetStateKey}`;
          tools.push({
            name: toolName,
            description: `Transfer to ${targetNode.data?.label}`,
            type: 'function',
            config: {
              target_state: targetStateKey,
              internal_type: 'transition',
            },
          });
          transitions[toolName] = targetStateKey;
        } else if (targetNode.type === 'tool-node') {
          // Connected to a specialized Tool Node
          const toolName = (targetNode.data?.toolName as string) || (targetNode.data?.label as string) || 'tool';
          tools.push({
            name: toolName,
            description: 'Custom Tool', // Could be added to tool node schema
            type: (targetNode.data?.toolType as 'function' | 'http_request') || 'function',
            config: {
              apiEndpoint: targetNode.data?.apiEndpoint,
              // ... other tool config
            },
          });
        }
      }

      // Merge internal tools if defined in node data (from the Tools accordion)
      if (Array.isArray(node.data?.tools)) {
        // logic to merge existing tools properties if any
      }

      agentConfig.tools = tools;

      config.states[stateKey] = {
        name: (node.data?.label as string) || stateKey,
        agent: agentConfig,
        transitions,
      };
    }

  return config;
}
