'use client';

import { createControlRenderer } from '../../utils/rendering';
import useStore from '@/store/store';
import { Wrench, Robot } from '@phosphor-icons/react';

interface ToolReference {
  nodeId: string;
  toolName: string;
}

interface ToolNodeSelectorControlProps {
  data: ToolReference[];
  path: string;
  handleChange: (path: string, value: ToolReference[]) => void;
}

/**
 * ToolNodeSelector displays all HTTP tools configured in Tool Nodes on the canvas.
 * Voice Agents are isolated and don't create automatic transitions.
 * Tools from Tool Nodes can be shared/reused across multiple Voice Agents.
 */
function ToolNodeSelectorControl({ path, handleChange, data }: ToolNodeSelectorControlProps) {
  const nodes = useStore((state) => state.nodes);
  
  // Get all tool nodes from the graph using data.type
  const toolNodes = nodes.filter((n) => (n.data?.type as string) === 'tool-node');
  
  // Build available HTTP tools list from ToolNodes
  const availableHttpTools: ToolReference[] = [];
  
  for (const node of toolNodes) {
    const props = node.data?.properties as Record<string, unknown> | undefined;
    const tool = props?.tool as Record<string, unknown> | undefined;
    
    const toolName = tool?.name;
    if (toolName && typeof toolName === 'string') {
      availableHttpTools.push({
        nodeId: node.id,
        toolName: toolName,
      });
    }
  }

  // Debug log - will be removed once confirmed working
  console.log('[ToolNodeSelector] Available tools:', availableHttpTools.length, availableHttpTools);

  return (
    <div className="flex flex-col gap-3">
      {/* Available HTTP Tools from Tool Nodes */}
      {availableHttpTools.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground mb-1">
            Available tools from Tool Nodes on canvas:
          </p>
          {availableHttpTools.map((tool) => (
            <div 
              key={tool.nodeId} 
              className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 hover:bg-muted transition-colors"
            >
              <Wrench className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <span className="text-sm font-medium">{tool.toolName}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-md">
          <Robot className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No HTTP Tools available.</p>
          <p className="text-xs mt-1">
            Add Tool Nodes to the canvas and configure them with tools.
          </p>
        </div>
      )}
    </div>
  );
}

export const toolNodeSelectorControlRenderer = createControlRenderer('ToolNodeSelector', ToolNodeSelectorControl);
