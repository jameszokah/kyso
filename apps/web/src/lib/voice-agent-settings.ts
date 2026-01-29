"use client";

import type { AgentState } from "@livekit/components-react";
import { useCallback, useSyncExternalStore } from "react";
import type { PersonaState } from "@/components/ai-elements/persona";

// ============================================================================
// Unified Persona Types (combining audio visualizers and Rive personas)
// ============================================================================

/**
 * Unified persona variant combining all visualizers under zodiac names
 * - aries through leo: Audio visualizers (shader/canvas-based)
 * - virgo through aquarius: Rive personas (animated vector graphics)
 */
export type PersonaVariant =
  | "aries" // Audio: Aura (shader-based circular)
  | "taurus" // Audio: Bar (bar chart style)
  | "gemini" // Audio: Radial (circular bars)
  | "cancer" // Audio: Wave (oscilloscope line)
  | "leo" // Audio: Grid (dot matrix)
  | "virgo" // Rive: Obsidian
  | "libra" // Rive: Mana
  | "scorpio" // Rive: Opal
  | "sagittarius" // Rive: Halo
  | "capricorn" // Rive: Glint
  | "aquarius"; // Rive: Command

export type VisualizerSize = "icon" | "sm" | "md" | "lg" | "xl";
export type PositionPreset =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type TranscriptionPosition = "top" | "bottom" | "overlay";
export type ThemeMode = "dark" | "light" | "system";
export type ChatInputStyle = "minimal" | "standard" | "expanded";
export type ControlBarLayout = "compact" | "standard" | "expanded";

// ============================================================================
// Persona Mappings
// ============================================================================

/**
 * Check if a persona variant is an audio visualizer (shader/canvas)
 */
export function isAudioVisualizer(variant: PersonaVariant): boolean {
  return ["aries", "taurus", "gemini", "cancer", "leo"].includes(variant);
}

/**
 * Check if a persona variant is a Rive persona
 */
export function isRivePersona(variant: PersonaVariant): boolean {
  return [
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
  ].includes(variant);
}

/**
 * Maps zodiac audio visualizer names to their component types
 */
export const AUDIO_VISUALIZER_MAP = {
  aries: "aura",
  taurus: "bar",
  gemini: "radial",
  cancer: "wave",
  leo: "grid",
} as const;

/**
 * Maps zodiac persona names to Rive file variants
 */
export const RIVE_PERSONA_MAP = {
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

// ============================================================================
// Settings Interface
// ============================================================================

export interface VoiceAgentSettings {
  // General Features
  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  // Unified Persona Settings
  personaVariant: PersonaVariant;
  personaSize: VisualizerSize;
  personaColor: string;

  // Chat Flow Customization
  chatInputStyle: ChatInputStyle;
  controlBarLayout: ControlBarLayout;

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

  // Unified Persona Settings
  personaVariant: "aries",
  personaSize: "lg",
  personaColor: "#1FD5F9",

  // Chat Flow Customization
  chatInputStyle: "standard",
  controlBarLayout: "standard",

  // UI Preferences
  showTranscription: true,
  transcriptionPosition: "bottom",
  showVoiceSelector: true,
  videoPosition: "bottom-right",

  // Theme
  themeMode: "system",
};

// ============================================================================
// Reactive Store with useSyncExternalStore
// ============================================================================

const STORAGE_KEY = "kyso-voice-agent-settings";
const SETTINGS_CHANGE_EVENT = "kyso-voice-agent-settings-change";

// In-memory cache for SSR and snapshot stability
let cachedSettings: VoiceAgentSettings = { ...DEFAULT_SETTINGS };
let isInitialized = false;

/**
 * Initialize the cache from localStorage (called once)
 */
function initializeCache(): void {
  if (isInitialized || typeof window === "undefined") {
    return;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<VoiceAgentSettings>;
      cachedSettings = { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // Ignore parse errors, use default
  }

  isInitialized = true;
}

/**
 * Get settings snapshot - returns cached reference for stability
 * This MUST return the same reference if the settings haven't changed
 * to prevent useSyncExternalStore infinite loops
 */
function getSettingsSnapshot(): VoiceAgentSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  // Initialize on first call
  initializeCache();

  // Always return the cached reference
  return cachedSettings;
}

/**
 * Get server snapshot (for SSR hydration)
 */
function getServerSnapshot(): VoiceAgentSettings {
  return DEFAULT_SETTINGS;
}

/**
 * Update the cache from localStorage and return whether it changed
 */
function refreshCache(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<VoiceAgentSettings>;
      const newSettings = { ...DEFAULT_SETTINGS, ...parsed };

      // Check if actually changed (shallow compare)
      const hasChanged =
        JSON.stringify(newSettings) !== JSON.stringify(cachedSettings);
      if (hasChanged) {
        cachedSettings = newSettings;
        return true;
      }
    }
  } catch {
    // Ignore parse errors
  }

  return false;
}

/**
 * Subscribe to settings changes (for useSyncExternalStore)
 */
function subscribeToSettings(callback: () => void): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && refreshCache()) {
      callback();
    }
  };

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<{ cacheUpdated?: boolean }>;

    // If cache was already updated by saveSettings, just call callback
    if (customEvent.detail?.cacheUpdated) {
      callback();
      return;
    }

    // Otherwise refresh from localStorage
    if (refreshCache()) {
      callback();
    }
  };

  // Listen for storage events (cross-tab sync)
  window.addEventListener("storage", handleStorageChange);

  // Listen for custom events (same-tab sync)
  window.addEventListener(SETTINGS_CHANGE_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(SETTINGS_CHANGE_EVENT, handleCustomEvent);
  };
}

/**
 * Reactive hook to get all voice agent settings
 * Uses useSyncExternalStore for proper React 18 concurrent rendering support
 */
export function useVoiceAgentSettings(): VoiceAgentSettings {
  return useSyncExternalStore(
    subscribeToSettings,
    getSettingsSnapshot,
    getServerSnapshot
  );
}

/**
 * Reactive hook to get a single setting
 */
export function useVoiceAgentSetting<K extends keyof VoiceAgentSettings>(
  key: K
): VoiceAgentSettings[K] {
  const settings = useVoiceAgentSettings();
  return settings[key];
}

/**
 * Hook to get settings and a setter function
 */
export function useVoiceAgentSettingsState(): [
  VoiceAgentSettings,
  (settings: VoiceAgentSettings) => void,
] {
  const settings = useVoiceAgentSettings();

  const setSettings = useCallback((newSettings: VoiceAgentSettings) => {
    saveSettings(newSettings);
  }, []);

  return [settings, setSettings];
}

// ============================================================================
// Non-reactive helpers (for one-time reads or saving)
// ============================================================================

/**
 * Load settings from localStorage (non-reactive)
 */
export function loadSettings(): VoiceAgentSettings {
  return getSettingsSnapshot();
}

/**
 * Save settings to localStorage and notify all subscribers
 */
export function saveSettings(settings: VoiceAgentSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Update cache directly (this is already the new value)
    cachedSettings = settings;

    // Dispatch custom event for same-tab reactivity
    // Pass cacheUpdated: true so subscriber doesn't re-read localStorage
    window.dispatchEvent(
      new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: { cacheUpdated: true } })
    );
  } catch (error) {
    console.warn("Failed to save voice agent settings:", error);
  }
}

/**
 * Update a single setting
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

// ============================================================================
// Display Labels
// ============================================================================

/**
 * Get display label for persona variant
 */
export function getPersonaLabel(variant: PersonaVariant): string {
  const labels: Record<PersonaVariant, string> = {
    // Audio visualizers
    aries: "Aries (Aura)",
    taurus: "Taurus (Bar)",
    gemini: "Gemini (Radial)",
    cancer: "Cancer (Wave)",
    leo: "Leo (Grid)",
    // Rive personas
    virgo: "Virgo (Obsidian)",
    libra: "Libra (Mana)",
    scorpio: "Scorpio (Opal)",
    sagittarius: "Sagittarius (Halo)",
    capricorn: "Capricorn (Glint)",
    aquarius: "Aquarius (Command)",
  };
  return labels[variant];
}

/**
 * Get category for persona variant
 */
export function getPersonaCategory(variant: PersonaVariant): "audio" | "rive" {
  return isAudioVisualizer(variant) ? "audio" : "rive";
}

/**
 * All persona variants grouped by category
 */
export const PERSONA_VARIANTS = {
  audio: ["aries", "taurus", "gemini", "cancer", "leo"] as PersonaVariant[],
  rive: [
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
  ] as PersonaVariant[],
  all: [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
  ] as PersonaVariant[],
};
