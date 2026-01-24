'use client';

import { createControlRenderer } from '../../utils/rendering';
import useStore from '@/store/store';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import { Button } from '@/components/ui-test/button';
import { PlusCircle, Trash } from '@phosphor-icons/react';
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

interface ToolNodeSelectorControlProps {
  data: ToolReference[];
  path: string;
  handleChange: (path: string, value: ToolReference[]) => void;
}

function ToolNodeSelectorControl({ path, handleChange, data }: ToolNodeSelectorControlProps) {
  const nodes = useStore((state) => state.nodes);
  
  // Debug: Log all nodes and their data types
  console.log('[ToolNodeSelector] All nodes:', nodes.map(n => ({
    id: n.id,
    type: n.type,
    dataType: n.data?.type,
    data: n.data
  })));
  
  // Get all tool nodes from the graph using data.type (where palette type is stored)
  const toolNodes = nodes.filter((n) => (n.data?.type as string) === 'tool-node');
  
  console.log('[ToolNodeSelector] Tool nodes found:', toolNodes.length, toolNodes.map(n => ({
    id: n.id,
    data: n.data
  })));
  
  // Build options from tool nodes - check multiple possible data structures
  const availableTools = toolNodes
    .filter((n) => {
      // Check both possible paths: data.properties.tool.name OR data.tool.name
      const propsPath = (n.data?.properties as any)?.tool?.name;
      const directPath = (n.data as any)?.tool?.name;
      console.log('[ToolNodeSelector] Checking node:', n.id, { propsPath, directPath });
      return propsPath || directPath;
    })
    .map((n) => {
      // Get tool from either path
      const propsPath = (n.data?.properties as any);
      const directData = n.data as any;
      const tool = propsPath?.tool || directData?.tool || {};
      const label = propsPath?.label || directData?.label || 'Tool';
      
      return {
        nodeId: n.id,
        toolName: tool?.name as string,
        label: `${label} - ${tool?.name || 'Unnamed'}`,
      };
    });



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
      {selectedTools.length > 0 && (
        <div className="flex flex-col gap-2">
          {selectedTools.map((tool) => {
            const toolInfo = availableTools.find((t) => t.nodeId === tool.nodeId);
            return (
              <div key={tool.nodeId} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
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

      {availableTools.length > 0 ? (
        <FormControlWithLabel label="Add Tool from Node">
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
          No configured Tool Nodes found. Add Tool Nodes to the canvas and configure them first.
        </div>
      )}
    </div>
  );
}

export const toolNodeSelectorControlRenderer = createControlRenderer('ToolNodeSelector', ToolNodeSelectorControl);
