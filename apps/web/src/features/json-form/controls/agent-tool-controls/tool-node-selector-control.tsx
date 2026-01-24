'use client';

import { createControlRenderer } from '../../utils/rendering';
import useStore from '@/store/store';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import { Button } from '@/components/ui-test/button';
import { Trash, Wrench } from '@phosphor-icons/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ToolReference {
  nodeId: string;
  toolName: string;
}

interface AvailableTool {
  nodeId: string;
  toolName: string;
  label: string;
}

interface ToolNodeSelectorControlProps {
  data: ToolReference[];
  path: string;
  handleChange: (path: string, value: ToolReference[]) => void;
}

function ToolNodeSelectorControl({ path, handleChange, data }: ToolNodeSelectorControlProps) {
  const nodes = useStore((state) => state.nodes);
  
  // Get all tool nodes from the graph using data.type
  const toolNodes = nodes.filter((n) => (n.data?.type as string) === 'tool-node');
  
  // Build available tools list
  const availableTools: AvailableTool[] = [];
  
  for (const node of toolNodes) {
    const props = node.data?.properties as Record<string, unknown> | undefined;
    const tool = props?.tool as Record<string, unknown> | undefined;
    
    // Check if tool has a name configured
    const toolName = tool?.name;
    if (toolName && typeof toolName === 'string') {
      const nodeLabel = (props?.label as string) || 'Tool';
      availableTools.push({
        nodeId: node.id,
        toolName: toolName,
        label: `${nodeLabel} - ${toolName}`,
      });
    }
  }

  const selectedTools = data || [];

  const handleAddTool = (nodeId: string) => {
    const tool = availableTools.find((t) => t.nodeId === nodeId);
    if (tool && !selectedTools.some((s) => s.nodeId === nodeId)) {
      handleChange(path, [...selectedTools, { nodeId, toolName: tool.toolName }]);
    }
  };

  const handleRemoveTool = (nodeId: string) => {
    handleChange(path, selectedTools.filter((t) => t.nodeId !== nodeId));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Selected tools list */}
      {selectedTools.length > 0 && (
        <div className="flex flex-col gap-2">
          {selectedTools.map((tool) => {
            const toolInfo = availableTools.find((t) => t.nodeId === tool.nodeId);
            return (
              <div key={tool.nodeId} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">
                  {toolInfo?.label || tool.toolName || 'Unknown Tool'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTool(tool.nodeId)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tool selector dropdown */}
      {availableTools.length > 0 ? (
        <FormControlWithLabel label="Add Tool from Canvas">
          <Select onValueChange={handleAddTool}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tool..." />
            </SelectTrigger>
            <SelectContent>
              {availableTools
                .filter((t) => !selectedTools.some((s) => s.nodeId === t.nodeId))
                .map((tool) => (
                  <SelectItem key={tool.nodeId} value={tool.nodeId}>
                    {tool.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormControlWithLabel>
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-md">
          <p>No configured Tool Nodes found.</p>
          <p className="text-xs mt-1">Add Tool Nodes to the canvas and configure them first.</p>
        </div>
      )}
    </div>
  );
}

export const toolNodeSelectorControlRenderer = createControlRenderer('ToolNodeSelector', ToolNodeSelectorControl);
