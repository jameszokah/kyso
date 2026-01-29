"use client";

import { Layout, Monitor, Palette, RotateCcw, Settings2 } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DEFAULT_SETTINGS,
  getPersonaLabel,
  PERSONA_VARIANTS,
  type PersonaVariant,
  useVoiceAgentSettingsState,
  type VoiceAgentSettings,
} from "@/lib/voice-agent-settings";

const ACCENT_COLORS = [
  { value: "#1FD5F9", label: "Cyan" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#F97316", label: "Orange" },
  { value: "#10B981", label: "Emerald" },
  { value: "#EC4899", label: "Pink" },
  { value: "#EAB308", label: "Yellow" },
];

interface VoiceAgentSettingsPanelProps {
  className?: string;
}

export function VoiceAgentSettingsPanel({
  className,
}: VoiceAgentSettingsPanelProps) {
  const [settings, setSettings] = useVoiceAgentSettingsState();

  const updateSetting = useCallback(
    <K extends keyof VoiceAgentSettings>(
      key: K,
      value: VoiceAgentSettings[K]
    ) => {
      setSettings({ ...settings, [key]: value });
    },
    [settings, setSettings]
  );

  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return (
    <div className={cn("flex flex-col gap-2 p-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            size="icon"
            variant="outline"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-84 p-0"
          side="left"
          sideOffset={12}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h4 className="font-semibold text-sm">Agent Settings</h4>
            <Button
              className="h-7 gap-1 text-muted-foreground text-xs hover:text-foreground"
              onClick={handleReset}
              size="sm"
              variant="ghost"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          <Tabs className="w-full" defaultValue="general">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                className="rounded-none border-transparent border-b-2 px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                value="general"
              >
                <Monitor className="mr-1.5 h-3.5 w-3.5" />
                General
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none border-transparent border-b-2 px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                value="persona"
              >
                <Palette className="mr-1.5 h-3.5 w-3.5" />
                Persona
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none border-transparent border-b-2 px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                value="layout"
              >
                <Layout className="mr-1.5 h-3.5 w-3.5" />
                Layout
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent className="mt-0 p-4" value="general">
              <div className="space-y-4">
                <SettingRow
                  description="Enable text chat with the agent"
                  label="Chat Input"
                >
                  <Switch
                    checked={settings.supportsChatInput}
                    onCheckedChange={(v) =>
                      updateSetting("supportsChatInput", v)
                    }
                  />
                </SettingRow>

                <SettingRow
                  description="Allow camera for video calls"
                  label="Video Input"
                >
                  <Switch
                    checked={settings.supportsVideoInput}
                    onCheckedChange={(v) =>
                      updateSetting("supportsVideoInput", v)
                    }
                  />
                </SettingRow>

                <SettingRow
                  description="Allow screen sharing"
                  label="Screen Share"
                >
                  <Switch
                    checked={settings.supportsScreenShare}
                    onCheckedChange={(v) =>
                      updateSetting("supportsScreenShare", v)
                    }
                  />
                </SettingRow>

                <SettingRow
                  description="Buffer audio before connection"
                  label="Pre-Connect Buffer"
                >
                  <Switch
                    checked={settings.isPreConnectBufferEnabled}
                    onCheckedChange={(v) =>
                      updateSetting("isPreConnectBufferEnabled", v)
                    }
                  />
                </SettingRow>

                <Separator />

                <SettingRow
                  description="Show voice selection options"
                  label="Voice Selector"
                >
                  <Switch
                    checked={settings.showVoiceSelector}
                    onCheckedChange={(v) =>
                      updateSetting("showVoiceSelector", v)
                    }
                  />
                </SettingRow>
              </div>
            </TabsContent>

            {/* Persona Settings Tab */}
            <TabsContent className="mt-0 p-4" value="persona">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Persona Style
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      updateSetting("personaVariant", v as PersonaVariant)
                    }
                    value={settings.personaVariant}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Audio Visualizers</SelectLabel>
                        {PERSONA_VARIANTS.audio.map((variant) => (
                          <SelectItem key={variant} value={variant}>
                            {getPersonaLabel(variant)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Animated Personas</SelectLabel>
                        {PERSONA_VARIANTS.rive.map((variant) => (
                          <SelectItem key={variant} value={variant}>
                            {getPersonaLabel(variant)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Size
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      updateSetting(
                        "personaSize",
                        v as VoiceAgentSettings["personaSize"]
                      )
                    }
                    value={settings.personaSize}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Accent Color
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        className={cn(
                          "h-7 w-7 rounded-full border-2 transition-all",
                          settings.personaColor === color.value
                            ? "scale-110 border-foreground"
                            : "border-transparent hover:scale-105"
                        )}
                        key={color.value}
                        onClick={() =>
                          updateSetting("personaColor", color.value)
                        }
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Layout Settings Tab */}
            <TabsContent className="mt-0 p-4" value="layout">
              <div className="space-y-4">
                <SettingRow
                  description="Display conversation transcript"
                  label="Show Transcription"
                >
                  <Switch
                    checked={settings.showTranscription}
                    onCheckedChange={(v) =>
                      updateSetting("showTranscription", v)
                    }
                  />
                </SettingRow>

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Transcription Position
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      updateSetting(
                        "transcriptionPosition",
                        v as VoiceAgentSettings["transcriptionPosition"]
                      )
                    }
                    value={settings.transcriptionPosition}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="overlay">Overlay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Chat Input Style
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      updateSetting(
                        "chatInputStyle",
                        v as VoiceAgentSettings["chatInputStyle"]
                      )
                    }
                    value={settings.chatInputStyle}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Control Bar Layout
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      updateSetting(
                        "controlBarLayout",
                        v as VoiceAgentSettings["controlBarLayout"]
                      )
                    }
                    value={settings.controlBarLayout}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Video Position
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      updateSetting(
                        "videoPosition",
                        v as VoiceAgentSettings["videoPosition"]
                      )
                    }
                    value={settings.videoPosition}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Theme
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      updateSetting(
                        "themeMode",
                        v as VoiceAgentSettings["themeMode"]
                      )
                    }
                    value={settings.themeMode}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label className="font-medium text-sm">{label}</Label>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
