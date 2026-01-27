"use client";

import type {
  AgentState,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import type { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import type { ComponentProps } from "react";
// Import all audio visualizers
import { AgentAudioVisualizerAura } from "@/components/agents-ui/agent-audio-visualizer-aura";
import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { AgentAudioVisualizerGrid } from "@/components/agents-ui/agent-audio-visualizer-grid";
import { AgentAudioVisualizerRadial } from "@/components/agents-ui/agent-audio-visualizer-radial";
import { AgentAudioVisualizerWave } from "@/components/agents-ui/agent-audio-visualizer-wave";
// Import persona
import { Persona } from "@/components/ai-elements/persona";
import { cn } from "@/lib/utils";
import {
  AUDIO_VISUALIZER_MAP,
  type AudioVisualizerVariant,
  agentStateToPersonaState,
  PERSONA_VARIANT_MAP,
  type PersonaVariant,
  type VisualizerSize,
} from "@/lib/voice-agent-settings";

export interface UnifiedVisualizerProps extends ComponentProps<"div"> {
  /**
   * Whether to use audio visualizer or persona (Rive)
   */
  type: "audio" | "persona";

  /**
   * The variant to use - zodiac name
   * For audio: aries, taurus, gemini, cancer, leo
   * For persona: virgo, libra, scorpio, sagittarius, capricorn, aquarius
   */
  variant: AudioVisualizerVariant | PersonaVariant;

  /**
   * Current agent state from LiveKit
   */
  state: AgentState;

  /**
   * Audio track for visualizer (optional)
   */
  audioTrack?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder;

  /**
   * Size of the visualizer
   */
  size?: VisualizerSize;

  /**
   * Accent color for audio visualizers (hex)
   */
  color?: string;

  /**
   * Theme mode for shader-based visualizers
   */
  themeMode?: "dark" | "light";
}

/**
 * Unified Visualizer component that wraps all audio visualizers and personas
 * with a consistent zodiac-named interface.
 *
 * @example
 * ```tsx
 * // Audio visualizer (Aries = Aura)
 * <UnifiedVisualizer
 *   type="audio"
 *   variant="aries"
 *   state={agentState}
 *   audioTrack={audioTrack}
 * />
 *
 * // Persona (Virgo = Obsidian)
 * <UnifiedVisualizer
 *   type="persona"
 *   variant="virgo"
 *   state={agentState}
 * />
 * ```
 */
export function UnifiedVisualizer({
  type,
  variant,
  state,
  audioTrack,
  size = "lg",
  color = "#1FD5F9",
  themeMode,
  className,
  ...props
}: UnifiedVisualizerProps) {
  // Handle persona type
  if (type === "persona") {
    const personaVariant = variant as PersonaVariant;
    const riveVariant = PERSONA_VARIANT_MAP[personaVariant];
    const personaState = agentStateToPersonaState(state);

    return (
      <div
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <Persona
          className={cn({
            "size-6": size === "icon",
            "size-14": size === "sm",
            "size-28": size === "md",
            "size-56": size === "lg",
            "size-112": size === "xl",
          })}
          state={personaState}
          variant={riveVariant}
        />
      </div>
    );
  }

  // Handle audio visualizer type
  const audioVariant = variant as AudioVisualizerVariant;
  const visualizerType = AUDIO_VISUALIZER_MAP[audioVariant];

  const sharedProps = {
    state,
    size,
    audioTrack,
    className,
  };

  switch (visualizerType) {
    case "aura":
      return (
        <AgentAudioVisualizerAura
          {...sharedProps}
          color={color}
          themeMode={themeMode}
          {...props}
        />
      );

    case "bar":
      return <AgentAudioVisualizerBar {...sharedProps} {...props} />;

    case "radial":
      return <AgentAudioVisualizerRadial {...sharedProps} {...props} />;

    case "wave":
      return (
        <AgentAudioVisualizerWave {...sharedProps} color={color} {...props} />
      );

    case "grid":
      return <AgentAudioVisualizerGrid {...sharedProps} {...props} />;

    default:
      // Fallback to aura
      return (
        <AgentAudioVisualizerAura
          {...sharedProps}
          color={color}
          themeMode={themeMode}
          {...props}
        />
      );
  }
}

/**
 * Check if a variant is an audio visualizer variant
 */
export function isAudioVisualizerVariant(
  variant: string
): variant is AudioVisualizerVariant {
  return variant in AUDIO_VISUALIZER_MAP;
}

/**
 * Check if a variant is a persona variant
 */
export function isPersonaVariant(variant: string): variant is PersonaVariant {
  return variant in PERSONA_VARIANT_MAP;
}
