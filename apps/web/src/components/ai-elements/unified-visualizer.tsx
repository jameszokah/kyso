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
  agentStateToPersonaState,
  isAudioVisualizer,
  type PersonaVariant,
  RIVE_PERSONA_MAP,
  type VisualizerSize,
} from "@/lib/voice-agent-settings";

export interface UnifiedVisualizerProps extends ComponentProps<"div"> {
  /**
   * The persona variant to render (zodiac name)
   * Automatically detects if it's an audio visualizer or Rive persona
   */
  variant: PersonaVariant;

  /**
   * Current agent state from LiveKit
   */
  state: AgentState;

  /**
   * Audio track for visualizer (optional, only used for audio variants)
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
 * Unified Visualizer component that renders either an audio visualizer or Rive persona
 * based on the variant prop. Uses zodiac naming scheme for all 11 variants.
 *
 * Audio Visualizers (aries - leo):
 * - aries: Aura (shader-based circular)
 * - taurus: Bar (bar chart)
 * - gemini: Radial (circular bars)
 * - cancer: Wave (oscilloscope)
 * - leo: Grid (dot matrix)
 *
 * Rive Personas (virgo - aquarius):
 * - virgo: Obsidian
 * - libra: Mana
 * - scorpio: Opal
 * - sagittarius: Halo
 * - capricorn: Glint
 * - aquarius: Command
 *
 * @example
 * ```tsx
 * // Audio visualizer (Aries = Aura)
 * <UnifiedVisualizer
 *   variant="aries"
 *   state={agentState}
 *   audioTrack={audioTrack}
 * />
 *
 * // Rive Persona (Virgo = Obsidian)
 * <UnifiedVisualizer
 *   variant="virgo"
 *   state={agentState}
 * />
 * ```
 */
export function UnifiedVisualizer({
  variant,
  state,
  audioTrack,
  size = "lg",
  color = "#1FD5F9",
  themeMode,
  className,
  ...props
}: UnifiedVisualizerProps) {
  // Auto-detect if this is an audio visualizer or Rive persona
  if (isAudioVisualizer(variant)) {
    return (
      <AudioVisualizerRenderer
        audioTrack={audioTrack}
        className={className}
        color={color}
        size={size}
        state={state}
        themeMode={themeMode}
        variant={variant as keyof typeof AUDIO_VISUALIZER_MAP}
        {...props}
      />
    );
  }

  // Rive persona
  const riveVariant =
    RIVE_PERSONA_MAP[variant as keyof typeof RIVE_PERSONA_MAP];
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

/**
 * Internal component for rendering audio visualizers
 */
function AudioVisualizerRenderer({
  variant,
  state,
  audioTrack,
  size,
  color,
  themeMode,
  className,
  ...props
}: {
  variant: keyof typeof AUDIO_VISUALIZER_MAP;
  state: AgentState;
  audioTrack?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder;
  size: VisualizerSize;
  color: string;
  themeMode?: "dark" | "light";
  className?: string;
} & ComponentProps<"div">) {
  const visualizerType = AUDIO_VISUALIZER_MAP[variant];

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
