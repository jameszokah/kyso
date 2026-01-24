'use client';

import { createControlRenderer } from '../../utils/rendering';
import useStore from '@/store/store';
import { Button } from '@/components/ui-test/button';
import { Wrench, ArrowsLeftRight, Robot } from '@phosphor-icons/react';
import { useSingleSelectedElement } from '@/features/properties-bar/use-single-selected-element';

interface ToolReference {
  nodeId: string;
  toolName: string;
  type: 'http_tool' | 'transition';
  targetAgentName?: string;
}

interface ToolNodeSelectorControlProps {
  data: ToolReference[];
  path: string;
  handleChange: (path: string, value: ToolReference[]) => void;
}

function ToolNodeSelectorControl({ path, handleChange, data }: ToolNodeSelectorControlProps) {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const selectedElement = useSingleSelectedElement();
  
  const currentNodeId = selectedElement?.node?.id;
  
  // Get all tool nodes from the graph using data.type
  const toolNodes = nodes.filter((n) => (n.data?.type as string) === 'tool-node');
  
  // Debug logging - keep until tool display is fixed
  console.log('[ToolNodeSelector] All nodes count:', nodes.length);
  console.log('[ToolNodeSelector] All nodes types:', nodes.map(n => ({ id: n.id, type: n.type, dataType: n.data?.type })));
  console.log('[ToolNodeSelector] Tool nodes found:', toolNodes.length);
  console.log('[ToolNodeSelector] Tool nodes details:', toolNodes.map(n => ({
    id: n.id,
    type: n.type,
    dataType: n.data?.type,
    properties: n.data?.properties,
  })));
  
  // Build available HTTP tools list from ToolNodes
  const availableHttpTools: ToolReference[] = [];
  
  for (const node of toolNodes) {
    const props = node.data?.properties as Record<string, unknown> | undefined;
    const tool = props?.tool as Record<string, unknown> | undefined;
    
    console.log('[ToolNodeSelector] Checking tool node:', node.id, { 
      props, 
      tool,
      toolName: tool?.name,
    });
    
    const toolName = tool?.name;
    if (toolName && typeof toolName === 'string') {
      console.log('[ToolNodeSelector] ✓ Tool has name:', toolName);
      availableHttpTools.push({
        nodeId: node.id,
        toolName: toolName,
        type: 'http_tool',
      });
    } else {
      console.log('[ToolNodeSelector] ✗ Tool missing name, skipping');
    }
  }
  
  console.log('[ToolNodeSelector] Final availableHttpTools:', availableHttpTools);

  // Get transition tools from edges to other VoiceAgents
  const transitionTools: ToolReference[] = [];
  
  if (currentNodeId) {
    const outgoingEdges = edges.filter((e) => e.source === currentNodeId);
    
    for (const edge of outgoingEdges) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!targetNode) continue;
      
      const targetType = (targetNode.data?.type as string) || '';
      
      // If target is another voice agent, it's a transition
      if (targetType === 'voice-agent' || targetType === 'voice-node') {
        const targetProps = targetNode.data?.properties as Record<string, unknown> | undefined;
        const targetLabel = (targetProps?.label as string) || 'Agent';
        const targetKey = targetLabel.toLowerCase().replace(/\s+/g, '_');
        
        transitionTools.push({
          nodeId: targetNode.id,
          toolName: `transfer_to_${targetKey}`,
          type: 'transition',
          targetAgentName: targetLabel,
        });
      }
    }
  }

  // Combine for display
  const allDisplayTools = [...availableHttpTools, ...transitionTools];

  return (
    <div className="flex flex-col gap-4">
      {/* Transition Tools Section */}
      {transitionTools.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent Transitions</h4>
          {transitionTools.map((tool) => (
            <div key={tool.nodeId} className="flex items-center gap-2 p-2 border rounded-md bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <ArrowsLeftRight className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Transfer to {tool.targetAgentName}
                </span>
                <p className="text-xs text-blue-600 dark:text-blue-400">{tool.toolName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HTTP Tools Section */}
      {availableHttpTools.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HTTP Tools</h4>
          {availableHttpTools.map((tool) => (
            <div key={tool.nodeId} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">
                {tool.toolName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {allDisplayTools.length === 0 && (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-md">
          <Robot className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No tools available.</p>
          <p className="text-xs mt-1">
            Connect to other Voice Agents for transitions, or add Tool Nodes to the canvas.
          </p>
        </div>
      )}
    </div>
  );
}

export const toolNodeSelectorControlRenderer = createControlRenderer('ToolNodeSelector', ToolNodeSelectorControl);
