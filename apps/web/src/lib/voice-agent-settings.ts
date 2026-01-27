"use client";

import type { AgentState } from "@livekit/components-react";
import type { PersonaState } from "@/components/ai-elements/persona";

// Zodiac-named visualizer types
export type AudioVisualizerVariant =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo";
export type PersonaVariant =
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius";
export type VisualizerSize = "icon" | "sm" | "md" | "lg" | "xl";
export type PositionPreset =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type TranscriptionPosition = "top" | "bottom" | "overlay";
export type ThemeMode = "dark" | "light" | "system";

/**
 * Maps zodiac audio visualizer names to their component types
 */
export const AUDIO_VISUALIZER_MAP = {
  aries: "aura", // Shader-based circular aura
  taurus: "bar", // Bar chart style
  gemini: "radial", // Circular bars
  cancer: "wave", // Oscilloscope line
  leo: "grid", // Dot matrix grid
} as const;

/**
 * Maps zodiac persona names to Rive file variants
 */
export const PERSONA_VARIANT_MAP = {
  virgo: "obsidian",
  libra: "mana",
  scorpio: "opal",
  sagittarius: "halo",
  capricorn: "glint",
  aquarius: "command",
} as const;

/**
 * Maps LiveKit AgentState to PersonaState for Rive animations
 */
export function agentStateToPersonaState(agentState: AgentState): PersonaState {
  switch (agentState) {
    case "listening":
      return "listening";
    case "thinking":
      return "thinking";
    case "speaking":
      return "speaking";
    case "connecting":
    case "initializing":
      return "idle";
    case "disconnected":
      return "asleep";
    default:
      return "idle";
  }
}

export interface VoiceAgentSettings {
  // General Features
  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  // Visualizer Settings
  visualizerType: "audio" | "persona";
  audioVisualizerVariant: AudioVisualizerVariant;
  personaVariant: PersonaVariant;
  visualizerSize: VisualizerSize;
  visualizerColor: string;

  // UI Preferences
  showTranscription: boolean;
  transcriptionPosition: TranscriptionPosition;
  showVoiceSelector: boolean;
  videoPosition: PositionPreset;

  // Theme
  themeMode: ThemeMode;
}

export const DEFAULT_SETTINGS: VoiceAgentSettings = {
  // General Features
  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  // Visualizer Settings
  visualizerType: "audio",
  audioVisualizerVariant: "aries",
  personaVariant: "virgo",
  visualizerSize: "lg",
  visualizerColor: "#1FD5F9",

  // UI Preferences
  showTranscription: true,
  transcriptionPosition: "bottom",
  showVoiceSelector: true,
  videoPosition: "bottom-right",

  // Theme
  themeMode: "system",
};

const STORAGE_KEY = "kyso-voice-agent-settings";

/**
 * Load voice agent settings from localStorage
 * Returns default settings if none are stored or on error
 */
export function loadSettings(): VoiceAgentSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<VoiceAgentSettings>;

    // Merge with defaults to handle missing fields from older versions
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (error) {
    console.warn("Failed to load voice agent settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save voice agent settings to localStorage
 */
export function saveSettings(settings: VoiceAgentSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save voice agent settings:", error);
  }
}

/**
 * Update a single setting and save to localStorage
 */
export function updateSetting<K extends keyof VoiceAgentSettings>(
  key: K,
  value: VoiceAgentSettings[K]
): VoiceAgentSettings {
  const current = loadSettings();
  const updated = { ...current, [key]: value };
  saveSettings(updated);
  return updated;
}

/**
 * Reset all settings to defaults
 */
export function resetSettings(): VoiceAgentSettings {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

/**
 * Get display label for visualizer variant
 */
export function getVisualizerLabel(
  variant: AudioVisualizerVariant | PersonaVariant
): string {
  const labels: Record<AudioVisualizerVariant | PersonaVariant, string> = {
    aries: "Aries (Aura)",
    taurus: "Taurus (Bar)",
    gemini: "Gemini (Radial)",
    cancer: "Cancer (Wave)",
    leo: "Leo (Grid)",
    virgo: "Virgo (Obsidian)",
    libra: "Libra (Mana)",
    scorpio: "Scorpio (Opal)",
    sagittarius: "Sagittarius (Halo)",
    capricorn: "Capricorn (Glint)",
    aquarius: "Aquarius (Command)",
  };
  return labels[variant];
}
