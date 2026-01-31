"use client";

import type { DiagramModel, LayoutDirection } from '@kyso/types/common';
import type { ReactFlowJsonObject } from '@xyflow/react';
import type { WorkflowBuilderEdge, WorkflowBuilderNode } from "@kyso/types/node-data";
import { DiagramWrapper } from "@/features/diagram/diagram-wrapper";
import { DiagramContainer as Diagram } from "@/features/diagram/diagram";
import VoiceFlow from "@/flows/voice";

interface WorkflowEditorProps {
  workflow: {
    id: string;
    name: string;
    description: string | null;
    canvasData: unknown;
  };
}

export function WorkflowEditor({ workflow }: WorkflowEditorProps) {
  // Construct the DiagramModel structure expected by the store
  const initialData: DiagramModel = {
    name: workflow.name,
    layoutDirection: 'RIGHT' as LayoutDirection,
    diagram: (workflow.canvasData || {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    }) as ReactFlowJsonObject<WorkflowBuilderNode, WorkflowBuilderEdge>,
  };

  return (
    <div className="relative h-screen w-full">
      {/* Diagram - render first so it's behind UI elements */}
      <div className="absolute inset-0 z-0">
        <DiagramWrapper initialData={initialData}>
          <Diagram />
        </DiagramWrapper>
      </div>

      {/* VoiceFlow contains header and sidebar UI */}
      <VoiceFlow workflowId={workflow.id} />
    </div>
  );
}