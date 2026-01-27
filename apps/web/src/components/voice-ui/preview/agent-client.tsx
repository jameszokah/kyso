"use client";

import {
  RoomAudioRenderer,
  RoomContext,
  StartAudio,
} from "@livekit/components-react";
import { Room, RoomEvent } from "livekit-client";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ErrorMessage } from "@/components/voice-ui/embed-popup/error-message";
import { PopupView } from "@/components/voice-ui/embed-popup/popup-view";
import { VoiceAgentSettingsPanel } from "@/components/voice-ui/settings-panel/voice-agent-settings-panel";
import useConnectionDetails from "@/hooks/voice-ui/use-connection-details";
import type { AppConfig, EmbedErrorDetails } from "@/lib/types";
import {
  loadSettings,
  saveSettings,
  type VoiceAgentSettings,
} from "@/lib/voice-agent-settings";

const PopupViewMotion = motion.create(PopupView);

export type EmbedFixedAgentClientProps = {
  appConfig: AppConfig;
};

function PreviewAgentClient({ appConfig }: EmbedFixedAgentClientProps) {
  const isAnimating = useRef(false);
  const room = useMemo(() => new Room(), []);
  const [error, setError] = useState<EmbedErrorDetails | null>(null);
  const [settings, setSettings] = useState<VoiceAgentSettings>(() =>
    loadSettings()
  );

  // Merge settings with appConfig to create the effective config
  const effectiveAppConfig = useMemo<AppConfig>(
    () => ({
      ...appConfig,
      supportsChatInput: settings.supportsChatInput,
      supportsVideoInput: settings.supportsVideoInput,
      supportsScreenShare: settings.supportsScreenShare,
      isPreConnectBufferEnabled: settings.isPreConnectBufferEnabled,
    }),
    [appConfig, settings]
  );

  const {
    connectionDetails,
    refreshConnectionDetails,
    existingOrRefreshConnectionDetails,
  } = useConnectionDetails(effectiveAppConfig);

  const handleSettingsChange = useCallback(
    (newSettings: VoiceAgentSettings) => {
      setSettings(newSettings);
      saveSettings(newSettings);
    },
    []
  );

  const handlePanelAnimationStart = () => {
    isAnimating.current = true;
  };

  const handlePanelAnimationComplete = () => {
    isAnimating.current = false;
    if (room.state !== "disconnected") {
      room.disconnect();
    }
  };

  useEffect(() => {
    const onDisconnected = () => {
      refreshConnectionDetails();
    };
    const onMediaDevicesError = (error: Error) => {
      setError({
        title: "Encountered an error with your media devices",
        description: `${error.name}: ${error.message}`,
      });
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    // if (!connectionDetails) {
    //   setError({
    //     title: "Error fetching connection details",
    //     description: "Please try again later",
    //   });
    //   return;
    // }
    // if (room.state !== "disconnected") {
    //   return;
    // }

    const connect = async () => {
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: effectiveAppConfig.isPreConnectBufferEnabled,
        }),
        existingOrRefreshConnectionDetails().then((connectionDetails) =>
          room.connect(
            connectionDetails.serverUrl,
            connectionDetails.participantToken
          )
        ),
      ]).catch((error) => {
        if (error instanceof Error) {
          console.error("Error connecting to agent:", error);
          setError({
            title: "There was an error connecting to the agent",
            description: `${error.name}: ${error.message}`,
          });
        }
      });
    };

    connect();
  }, [
    room,
    connectionDetails,
    existingOrRefreshConnectionDetails,
    effectiveAppConfig.isPreConnectBufferEnabled,
  ]);

  return (
    <RoomContext.Provider value={room}>
      <RoomAudioRenderer />
      <StartAudio label="Start Audio" />

      <motion.div
        animate={{
          opacity: 1,
          translateY: 0,
        }}
        className="z-50 flex w-full items-center justify-between gap-4"
        initial={{
          opacity: 0,
          translateY: 8,
        }}
        onAnimationComplete={handlePanelAnimationComplete}
        onAnimationStart={handlePanelAnimationStart}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 1,
        }}
      >
        <div className="mx-auto h-84 w-full rounded-[28px] border border-solid bg-background drop-shadow-md md:max-w-3xl">
          <div className="relative h-full w-full">
            <ErrorMessage error={error} />
            {!error && (
              <PopupViewMotion
                animate={{ opacity: error === null ? 1 : 0 }}
                appConfig={effectiveAppConfig}
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                onEmbedError={setError}
                sessionStarted={true}
                transition={{
                  type: "spring",
                  duration: 0.2,
                }}
              />
            )}
          </div>
        </div>
        <VoiceAgentSettingsPanel
          className="h-80"
          onChange={handleSettingsChange}
          settings={settings}
        />
      </motion.div>
    </RoomContext.Provider>
  );
}

export default PreviewAgentClient;
