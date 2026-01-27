"use client";

import type { AgentState, TrackReference } from "@livekit/components-react";
import { UnifiedVisualizer } from "@/components/ai-elements/unified-visualizer";
import { loadSettings } from "@/lib/voice-agent-settings";

interface AudioVisualizerProps {
  agentState: AgentState;
  audioTrack?: TrackReference;
}

/**
 * AudioVisualizer component that uses the UnifiedVisualizer with settings from localStorage.
 * Supports both audio visualizers (zodiac: aries-leo) and persona (zodiac: virgo-aquarius).
 */
export function AudioVisualizer({
  agentState,
  audioTrack,
}: AudioVisualizerProps) {
  const settings = loadSettings();

  const variant =
    settings.visualizerType === "persona"
      ? settings.personaVariant
      : settings.audioVisualizerVariant;

  return (
    <UnifiedVisualizer
      audioTrack={audioTrack}
      className="h-full w-full"
      color={settings.visualizerColor}
      size={settings.visualizerSize}
      state={agentState}
      type={settings.visualizerType}
      variant={variant}
    />
  );
}
