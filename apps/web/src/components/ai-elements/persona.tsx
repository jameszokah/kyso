"use client";

import {
  type RiveParameters,
  useRive,
  useStateMachineInput,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
} from "@rive-app/react-webgl2";
import type { FC, ReactNode } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type PersonaState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "asleep";

interface PersonaProps {
  state: PersonaState;
  onLoad?: RiveParameters["onLoad"];
  onLoadError?: RiveParameters["onLoadError"];
  onReady?: () => void;
  onPause?: RiveParameters["onPause"];
  onPlay?: RiveParameters["onPlay"];
  onStop?: RiveParameters["onStop"];
  className?: string;
  variant?: keyof typeof sources;
  /**
   * Show a loading skeleton while Rive file loads
   * @default true
   */
  showLoadingState?: boolean;
}

// The state machine name is always 'default' for Elements AI visuals
const stateMachine = "default";

const sources = {
  obsidian: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/obsidian-2.0.riv",
    dynamicColor: true,
    hasModel: true,
  },
  mana: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/mana-2.0.riv",
    dynamicColor: false,
    hasModel: true,
  },
  opal: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/orb-1.2.riv",
    dynamicColor: false,
    hasModel: false,
  },
  halo: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/halo-2.0.riv",
    dynamicColor: true,
    hasModel: true,
  },
  glint: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/glint-2.0.riv",
    dynamicColor: true,
    hasModel: true,
  },
  command: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/command-2.0.riv",
    dynamicColor: true,
    hasModel: true,
  },
};

// Cache for preloaded Rive files
const preloadedFiles = new Set<string>();

/**
 * Preload a Rive file for faster initial rendering
 */
export function preloadPersona(variant: keyof typeof sources): void {
  const source = sources[variant];
  if (!source || preloadedFiles.has(source.source)) {
    return;
  }

  // Use fetch to cache the file
  fetch(source.source, { mode: "cors" })
    .then(() => {
      preloadedFiles.add(source.source);
    })
    .catch(() => {
      // Ignore preload errors
    });
}

/**
 * Preload all Rive persona files
 */
export function preloadAllPersonas(): void {
  for (const variant of Object.keys(sources) as (keyof typeof sources)[]) {
    preloadPersona(variant);
  }
}

const getCurrentTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
};

const useTheme = (enabled: boolean) => {
  const [theme, setTheme] = useState<"light" | "dark">(getCurrentTheme);

  useEffect(() => {
    // Skip if not enabled (avoids unnecessary observers for non-dynamic-color variants)
    if (!enabled) {
      return;
    }

    // Watch for classList changes
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Watch for OS-level theme changes
    let mql: MediaQueryList | null = null;
    const handleMediaChange = () => {
      setTheme(getCurrentTheme());
    };

    if (window.matchMedia) {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", handleMediaChange);
    }

    return () => {
      observer.disconnect();
      if (mql) {
        mql.removeEventListener("change", handleMediaChange);
      }
    };
  }, [enabled]);

  return theme;
};

interface PersonaWithModelProps {
  rive: ReturnType<typeof useRive>["rive"];
  source: (typeof sources)[keyof typeof sources];
  children: React.ReactNode;
}

const PersonaWithModel = memo(
  ({ rive, source, children }: PersonaWithModelProps) => {
    const theme = useTheme(source.dynamicColor);
    const viewModel = useViewModel(rive, { useDefault: true });
    const viewModelInstance = useViewModelInstance(viewModel, {
      rive,
      useDefault: true,
    });
    const viewModelInstanceColor = useViewModelInstanceColor(
      "color",
      viewModelInstance
    );

    useEffect(() => {
      if (!(viewModelInstanceColor && source.dynamicColor)) {
        return;
      }

      const [r, g, b] = theme === "dark" ? [255, 255, 255] : [0, 0, 0];
      viewModelInstanceColor.setRgb(r, g, b);
    }, [viewModelInstanceColor, theme, source.dynamicColor]);

    return children;
  }
);

interface PersonaWithoutModelProps {
  children: ReactNode;
}

const PersonaWithoutModel = memo(
  ({ children }: PersonaWithoutModelProps) => children
);

/**
 * Loading skeleton for Persona component
 */
const PersonaLoadingSkeleton = memo(({ className }: { className?: string }) => (
  <div
    className={cn(
      "size-16 shrink-0 animate-pulse rounded-full bg-muted/50",
      className
    )}
  >
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-1/2 animate-ping rounded-full bg-muted-foreground/20" />
    </div>
  </div>
));

/**
 * Error fallback for Persona component
 */
const PersonaErrorFallback = memo(({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex size-16 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive",
      className
    )}
  >
    <span className="text-xs">!</span>
  </div>
));

export const Persona: FC<PersonaProps> = memo(
  ({
    variant = "obsidian",
    state = "idle",
    onLoad,
    onLoadError,
    onReady,
    onPause,
    onPlay,
    onStop,
    className,
    showLoadingState = true,
  }) => {
    const source = sources[variant];
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    if (!source) {
      throw new Error(`Invalid variant: ${variant}`);
    }

    // Stabilize callbacks to prevent useRive from reinitializing
    const callbacksRef = useRef({
      onLoad,
      onLoadError,
      onReady,
      onPause,
      onPlay,
      onStop,
    });
    callbacksRef.current = {
      onLoad,
      onLoadError,
      onReady,
      onPause,
      onPlay,
      onStop,
    };

    const stableCallbacks = useMemo(
      () => ({
        onLoad: ((loadedRive) => {
          setIsLoaded(true);
          setHasError(false);
          callbacksRef.current.onLoad?.(loadedRive);
        }) as RiveParameters["onLoad"],
        onLoadError: ((err) => {
          setHasError(true);
          callbacksRef.current.onLoadError?.(err);
        }) as RiveParameters["onLoadError"],
        onReady: () => callbacksRef.current.onReady?.(),
        onPause: ((event) =>
          callbacksRef.current.onPause?.(event)) as RiveParameters["onPause"],
        onPlay: ((event) =>
          callbacksRef.current.onPlay?.(event)) as RiveParameters["onPlay"],
        onStop: ((event) =>
          callbacksRef.current.onStop?.(event)) as RiveParameters["onStop"],
      }),
      []
    );

    // Reset state when variant changes
    useEffect(() => {
      setIsLoaded(false);
      setHasError(false);
    }, [variant]);

    const { rive, RiveComponent } = useRive({
      src: source.source,
      stateMachines: stateMachine,
      autoplay: true,
      onLoad: stableCallbacks.onLoad,
      onLoadError: stableCallbacks.onLoadError,
      onRiveReady: stableCallbacks.onReady,
      onPause: stableCallbacks.onPause,
      onPlay: stableCallbacks.onPlay,
      onStop: stableCallbacks.onStop,
    });

    const listeningInput = useStateMachineInput(
      rive,
      stateMachine,
      "listening"
    );
    const thinkingInput = useStateMachineInput(rive, stateMachine, "thinking");
    const speakingInput = useStateMachineInput(rive, stateMachine, "speaking");
    const asleepInput = useStateMachineInput(rive, stateMachine, "asleep");

    useEffect(() => {
      if (listeningInput) {
        listeningInput.value = state === "listening";
      }
      if (thinkingInput) {
        thinkingInput.value = state === "thinking";
      }
      if (speakingInput) {
        speakingInput.value = state === "speaking";
      }
      if (asleepInput) {
        asleepInput.value = state === "asleep";
      }
    }, [state, listeningInput, thinkingInput, speakingInput, asleepInput]);

    const Component = source.hasModel ? PersonaWithModel : PersonaWithoutModel;

    // Show error fallback if failed to load
    if (hasError) {
      return <PersonaErrorFallback className={className} />;
    }

    return (
      <Component rive={rive} source={source}>
        {/* Show loading skeleton while loading */}
        {showLoadingState && !isLoaded && (
          <PersonaLoadingSkeleton className={className} />
        )}
        <RiveComponent
          className={cn(
            "size-16 shrink-0",
            // Hide until loaded if showing loading state
            showLoadingState && !isLoaded && "hidden",
            className
          )}
        />
      </Component>
    );
  }
);

// Export sources for external use (e.g., preloading)
export { sources as personaSources };
