'use client';

import { useMemo } from 'react';
import { createControlRenderer } from '../../utils/rendering';
import useStore from '@/store/store';
import { Button } from '@/components/ui/button';
import { Wrench, Robot, ArrowsLeftRight, PlusCircle, X } from '@phosphor-icons/react';

interface AgentToolConfig {
  name: string;
  description?: string;
  type: 'http_request' | 'function' | 'webhook';
  config?: Record<string, unknown>;
  transitionTo?: string; // For voice agent transitions
}

interface ToolNodeSelectorControlProps {
  data: AgentToolConfig[];
  path: string;
  handleChange: (path: string, value: AgentToolConfig[]) => void;
}

/**
 * ToolNodeSelector allows:
 * 1. Selecting HTTP tools from Tool Nodes on the canvas
 * 2. Selecting other Voice Agents as transition targets
 * 3. Adding/removing selected tools
 */
function ToolNodeSelectorControl({ path, handleChange, data = [] }: ToolNodeSelectorControlProps) {
  const nodes = useStore((state) => state.nodes);
  
  // Get all tool nodes from the graph
  const toolNodes = nodes.filter((n) => (n.data?.type as string) === 'tool-node');
  
  // Get all voice agent nodes (for transitions)
  const voiceAgentNodes = nodes.filter((n) => (n.data?.type as string) === 'voice-agent');
  
  // Build available HTTP tools list from ToolNodes
  const availableHttpTools = useMemo(() => {
    const tools: { nodeId: string; name: string; description?: string }[] = [];
    
    for (const node of toolNodes) {
      const props = node.data?.properties as Record<string, unknown> | undefined;
      const tool = props?.tool as Record<string, unknown> | undefined;
      
      const toolName = tool?.name;
      if (toolName && typeof toolName === 'string') {
        tools.push({
          nodeId: node.id,
          name: toolName,
          description: (tool?.description as string) || '',
        });
      }
    }
    
    return tools;
  }, [toolNodes]);
  
  // Build available Voice Agent transitions (exclude self)
  const availableTransitions = useMemo(() => {
    return voiceAgentNodes.map((node) => {
      const props = node.data?.properties as Record<string, unknown> | undefined;
      const label = (props?.label as string) || 'Voice Agent';
      const key = label.toLowerCase().replace(/\s+/g, '_');
      
      return {
        nodeId: node.id,
        name: `transfer_to_${key}`,
        label: label,
        description: `Transfer to ${label}`,
      };
    });
  }, [voiceAgentNodes]);
  
  // Check if a tool is already selected
  const isToolSelected = (name: string) => {
    return data.some((t) => t.name === name);
  };
  
  // Add a tool
  const addTool = (tool: AgentToolConfig) => {
    if (!isToolSelected(tool.name)) {
      handleChange(path, [...data, tool]);
    }
  };
  
  // Remove a tool
  const removeTool = (name: string) => {
    handleChange(path, data.filter((t) => t.name !== name));
  };
  
  // Add HTTP tool from Tool Node
  const addHttpTool = (tool: { nodeId: string; name: string; description?: string }) => {
    addTool({
      name: tool.name,
      description: tool.description || '',
      type: 'http_request',
      config: {},
    });
  };
  
  // Add transition to another Voice Agent
  const addTransition = (transition: { nodeId: string; name: string; label: string; description: string }) => {
    addTool({
      name: transition.name,
      description: transition.description,
      type: 'function',
      config: {},
      transitionTo: transition.label,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Currently Selected Tools */}
      {data.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selected Tools</h4>
          {data.map((tool) => (
            <div 
              key={tool.name} 
              className="flex items-center gap-2 p-2 border rounded-md bg-primary/10 border-primary/30"
            >
              {tool.transitionTo ? (
                <ArrowsLeftRight className="h-4 w-4 text-blue-600" />
              ) : (
                <Wrench className="h-4 w-4 text-primary" />
              )}
              <div className="flex-1">
                <span className="text-sm w-32 truncate font-medium">{tool.name}</span>
                {tool.description && (
                  <p className="text-xs w-32 truncate text-muted-foreground">{tool.description}</p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => removeTool(tool.name)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Available HTTP Tools */}
      {availableHttpTools.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Available HTTP Tools
          </h4>
          {availableHttpTools.map((tool) => (
            <div 
              key={tool.nodeId} 
              className={`flex items-center gap-2 p-2 border rounded-md transition-colors ${
                isToolSelected(tool.name) 
                  ? 'bg-muted/30 opacity-50' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                disabled={isToolSelected(tool.name)}
                onClick={() => addHttpTool(tool)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Available Voice Agent Transitions */}
      {availableTransitions.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Agent Transitions
          </h4>
          {availableTransitions.map((transition) => (
            <div 
              key={transition.nodeId} 
              className={`flex items-center gap-2 p-2 border rounded-md transition-colors ${
                isToolSelected(transition.name) 
                  ? 'bg-blue-50/30 dark:bg-blue-950/30 opacity-50' 
                  : 'bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50'
              }`}
            >
              <ArrowsLeftRight className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <span className="text-sm w-32 truncate font-medium text-blue-800 dark:text-blue-300">
                  {transition.label}
                </span>
                <p className="text-xs text-blue-600 dark:text-blue-400 w-32 truncate">{transition.name}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                disabled={isToolSelected(transition.name)}
                onClick={() => addTransition(transition)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {availableHttpTools.length === 0 && availableTransitions.length === 0 && (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-md">
          <Robot className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No tools or agents available.</p>
          <p className="text-xs mt-1">
            Add Tool Nodes or Voice Agent nodes to the canvas.
          </p>
        </div>
      )}
    </div>
  );
}

export const toolNodeSelectorControlRenderer = createControlRenderer('ToolNodeSelector', ToolNodeSelectorControl);
