"use client";

import {
  ArrowsLeftRightIcon,
  PlusCircle,
  Robot,
  WrenchIcon,
  X,
} from "@phosphor-icons/react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import useStore from "@/store/store";
import { createControlRenderer } from "../../utils/rendering";

interface AgentToolConfig {
  name: string;
  description?: string;
  type: "http_request" | "function" | "webhook";
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
function ToolNodeSelectorControl({
  path,
  handleChange,
  data = [],
}: ToolNodeSelectorControlProps) {
  const nodes = useStore((state) => state.nodes);
  const selectedNodesIds = useStore((state) => state.selectedNodesIds);

  // Get all tool nodes from the graph
  const toolNodes = nodes.filter(
    (n) => (n.data?.type as string) === "tool-node"
  );

  // Get all voice agent nodes (for transitions) - exclude currently selected node
  const voiceAgentNodes = nodes.filter(
    (n) =>
      (n.data?.type as string) === "voice-agent" &&
      !selectedNodesIds.includes(n.id)
  );

  // Build available HTTP tools list from ToolNodes
  const availableHttpTools = useMemo(() => {
    const tools: {
      nodeId: string;
      name: string;
      description?: string;
      type?: string;
      config?: Record<string, unknown>;
    }[] = [];

    for (const node of toolNodes) {
      const props = node.data?.properties as
        | Record<string, unknown>
        | undefined;
      const tool = props?.tool as Record<string, unknown> | undefined;

      const toolName = tool?.name;
      if (toolName && typeof toolName === "string") {
        tools.push({
          nodeId: node.id,
          name: toolName,
          description: (tool?.description as string) || "",
          type: (tool?.type as string) || "http_request",
          config: (tool?.config as Record<string, unknown>) || {},
        });
      }
    }

    return tools;
  }, [toolNodes]);

  // Build available Voice Agent transitions (exclude self)
  const availableTransitions = useMemo(() => {
    return voiceAgentNodes.map((node) => {
      const props = node.data?.properties as
        | Record<string, unknown>
        | undefined;
      const label = (props?.label as string) || "Voice Agent";
      const key = label.toLowerCase().replace(/\s+/g, "_");

      return {
        nodeId: node.id,
        name: `transfer_to_${key}`,
        label,
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
    handleChange(
      path,
      data.filter((t) => t.name !== name)
    );
  };

  // Add HTTP tool from Tool Node
  const addHttpTool = (tool: {
    nodeId: string;
    name: string;
    description?: string;
    type?: string;
    config?: Record<string, unknown>;
  }) => {
    addTool({
      name: tool.name,
      description: tool.description || "",
      type:
        (tool.type as "http_request" | "function" | "webhook") ||
        "http_request",
      config: tool.config || {},
    });
  };

  // Add transition to another Voice Agent
  const addTransition = (transition: {
    nodeId: string;
    name: string;
    label: string;
    description: string;
  }) => {
    addTool({
      name: transition.name,
      description: transition.description,
      type: "function",
      config: {},
      transitionTo: transition.label,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Currently Selected Tools */}
      {data.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Selected Tools
          </h4>
          {data.map((tool) => (
            <div
              className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 p-2"
              key={tool.name}
            >
              {tool.transitionTo ? (
                <ArrowsLeftRightIcon className="h-4 w-4 text-blue-600" />
              ) : (
                <WrenchIcon className="h-4 w-4 text-primary" />
              )}
              <div className="flex-1">
                <span className="wrap-break-word whitespace-normal font-medium text-sm">
                  {tool.name}
                </span>
                {tool.description && (
                  <p className="w-32 truncate text-muted-foreground text-xs">
                    {tool.description}
                  </p>
                )}
              </div>
              <Button
                className="h-6 w-6"
                onClick={() => removeTool(tool.name)}
                size="icon"
                variant="ghost"
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
          <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Available HTTP Tools
          </h4>
          {availableHttpTools.map((tool) => (
            <div
              className={`flex items-center gap-2 rounded-md border p-2 transition-colors ${
                isToolSelected(tool.name)
                  ? "bg-muted/30 opacity-50"
                  : "bg-muted/50 hover:bg-muted"
              }`}
              key={tool.nodeId}
            >
              <WrenchIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-sm">{tool.name}</span>
              </div>
              <Button
                className="h-6 w-6"
                disabled={isToolSelected(tool.name)}
                onClick={() => addHttpTool(tool)}
                size="icon"
                variant="ghost"
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
          <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Agent Transitions
          </h4>
          {availableTransitions.map((transition) => (
            <div
              className={`flex items-center gap-2 rounded-md border p-2 transition-colors ${
                isToolSelected(transition.name)
                  ? "bg-blue-50/30 opacity-50 dark:bg-blue-950/30"
                  : "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50"
              }`}
              key={transition.nodeId}
            >
              <ArrowsLeftRightIcon className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <span className="w-32 truncate font-medium text-blue-800 text-sm dark:text-blue-300">
                  {transition.label}
                </span>
                <p className="w-32 truncate text-blue-600 text-xs dark:text-blue-400">
                  {transition.name}
                </p>
              </div>
              <Button
                className="h-6 w-6"
                disabled={isToolSelected(transition.name)}
                onClick={() => addTransition(transition)}
                size="icon"
                variant="ghost"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {availableHttpTools.length === 0 && availableTransitions.length === 0 && (
        <div className="rounded-md bg-muted/30 p-4 text-center text-muted-foreground text-sm">
          <Robot className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p>No tools or agents available.</p>
          <p className="mt-1 text-xs">
            Add Tool Nodes or Voice Agent nodes to the canvas.
          </p>
        </div>
      )}
    </div>
  );
}

export const toolNodeSelectorControlRenderer = createControlRenderer(
  "ToolNodeSelector",
  ToolNodeSelectorControl
);
