"use client";

import type { AgentState, TrackReference } from "@livekit/components-react";
import { UnifiedVisualizer } from "@/components/ai-elements/unified-visualizer";
import { useVoiceAgentSettings } from "@/lib/voice-agent-settings";

interface AudioVisualizerProps {
  agentState: AgentState;
  audioTrack?: TrackReference;
}

/**
 * AudioVisualizer component that uses the UnifiedVisualizer with reactive settings.
 * Automatically updates when settings change in real-time.
 */
export function AudioVisualizer({
  agentState,
  audioTrack,
}: AudioVisualizerProps) {
  // Use reactive settings hook - changes propagate immediately
  const settings = useVoiceAgentSettings();

  return (
    <UnifiedVisualizer
      audioTrack={audioTrack}
      className="h-full w-full"
      color={settings.personaColor}
      size={settings.personaSize}
      state={agentState}
      variant={settings.personaVariant}
    />
  );
}
