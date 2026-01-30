"use client";

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
  return (
    <div className="relative h-screen w-full">
      {/* Diagram - render first so it's behind UI elements */}
      <div className="absolute inset-0 z-0">
        <DiagramWrapper initialData={workflow.canvasData as any}>
          <Diagram />
        </DiagramWrapper>
      </div>

      {/* VoiceFlow contains header and sidebar UI */}
      <VoiceFlow />
    </div>
  );
}