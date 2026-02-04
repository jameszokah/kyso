"use client";

import {
  Check,
  Clock,
  History,
  MessageSquare,
  Rocket,
  RotateCcw,
} from "lucide-react";
import { HandPointingIcon } from '@phosphor-icons/react';
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeployWorkflow,
  useRollbackWorkflow,
  useWorkflowReleases,
  type WorkflowRelease,
} from "@/hooks/workflow-queries";
import { cn } from "@/lib/utils";
import type { WorkflowConfig } from "@/utils/state-machine-types";
import EmbedPopupAgentClient from "@/components/voice-ui/embed-popup/agent-client";
import { APP_CONFIG_DEFAULTS } from "@/app/app-config";
import { getSandboxId } from "@/lib/env";
import { motion } from "motion/react";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import { Code } from "lucide-react";

interface DeployDialogProps {
  workflowId: string;
  workflowName: string;
  extractedConfig: WorkflowConfig | null;
  onDeploySuccess?: (release: WorkflowRelease) => void;
  onRollbackSuccess?: () => void;
}

export function DeployDialog({
  workflowId,
  workflowName,
  extractedConfig,
  onDeploySuccess,
  onRollbackSuccess,
}: DeployDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [releaseMessage, setReleaseMessage] = useState("");
  const [previewTab, setPreviewTab] = useState<"iframe" | "popup">("iframe");


  const { data: releases, isLoading: releasesLoading } = useWorkflowReleases(
    isOpen ? workflowId : undefined
  );

  const deployMutation = useDeployWorkflow();
  const rollbackMutation = useRollbackWorkflow();

  const latestRelease = releases?.[0];
  const hasReleases = releases && releases.length > 0;

  // Generate embed URLs
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const popupUrl = `${baseUrl}/embed-popup.js`;
  const iframeEmbedUrl = `${baseUrl}/embed/${workflowId}`;
  const embedSandboxId = useMemo(() => typeof window !== "undefined" ? getSandboxId(window.location.origin) : "", []);
  
  const popupEmbedCode = `<script\n  src="${popupUrl}"\n  data-lk-sandbox-id="${embedSandboxId}"\n  data-workflow-id="${workflowId}"\n></script>`;
  
  const iframeEmbedCode = useMemo(() => {
    return `<iframe\n  src="${iframeEmbedUrl}"\n  style="width: 320px; height: 64px;"\n></iframe>`;
  }, [iframeEmbedUrl]);

  // Handle Deployment
  const handleDeploy = async () => {
    if (!extractedConfig) {
      toast.error("Cannot deploy: workflow configuration is invalid");
      return;
    }

    if (!releaseMessage.trim()) {
      toast.error("Please enter a release message");
      return;
    }

    try {
      const release = await deployMutation.mutateAsync({
        workflowId,
        message: releaseMessage.trim(),
        agentFlow: extractedConfig,
      });

      toast.success(`Release #${release.releaseNumber} deployed successfully!`);
      setReleaseMessage("");
      onDeploySuccess?.(release as WorkflowRelease);
    } catch {
      toast.error("Failed to deploy release");
    }
  };

  // Handle Rollback
  const handleRollback = async (releaseId: string, releaseNumber: number) => {
    try {
      await rollbackMutation.mutateAsync({
        workflowId,
        releaseId,
      });

      toast.success(`Rolled back to Release #${releaseNumber}`);
      onRollbackSuccess?.();
    } catch {
      toast.error("Failed to rollback");
    }
  };

  // Construct config for preview from the *current* extractedConfig
  const previewAppConfig = useMemo(() => {
    // Start with defaults
    const config = { ...APP_CONFIG_DEFAULTS };
    
    // Inject workflowId
    config.workflowId = workflowId;
    
    return config;
  }, [workflowId, extractedConfig]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" size="sm">
          <Rocket className="h-4 w-4" />
          Deploy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deploy {workflowName}
          </DialogTitle>
          <DialogDescription>
            Create a new release and get embed codes for your voice agent.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="deploy">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="deploy">
              <Rocket className="mr-2 h-4 w-4" />
              Deploy
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="embed">
              <Code className="mr-2 h-4 w-4" />
              Embed & Preview
            </TabsTrigger>
            {hasReleases && (
              <TabsTrigger className="flex-1" value="history">
                <History className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            )}
          </TabsList>

          {/* Deploy Tab */}
          <TabsContent className="mt-4 space-y-4" value="deploy">
            <div className="space-y-3">
              <Label htmlFor="release-message">Release Message</Label>
              <Input
                disabled={deployMutation.isPending}
                id="release-message"
                onChange={(e) => setReleaseMessage(e.target.value)}
                placeholder="What changes are in this release?"
                value={releaseMessage}
              />
              <Button
                className="w-full gap-2"
                disabled={
                  deployMutation.isPending ||
                  !releaseMessage.trim() ||
                  !extractedConfig
                }
                onClick={handleDeploy}
              >
                {deployMutation.isPending ? (
                  <>Deploying...</>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Deploy New Release
                  </>
                )}
              </Button>
              {!extractedConfig && (
                <p className="text-destructive text-sm">
                  Workflow configuration is invalid. Fix errors before
                  deploying.
                </p>
              )}
            </div>

            {latestRelease && (
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  Current: Release #{latestRelease.releaseNumber}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  {latestRelease.message}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Embed & Preview Tab */}
          <TabsContent className="mt-4 space-y-4" value="embed">
            {hasReleases ? (
              <div className="space-y-6">
                 {/* Variant Selection similar to welcome.tsx */}
                 <div>
                    <div className="text-sm font-semibold mb-1">Select a variant</div>
                    <div className="border border-border rounded-lg p-1 bg-muted/20">
                      <div className="relative flex gap-2">
                        <motion.div
                          layout="position"
                          layoutId="tab-indicator"
                          initial={false}
                          className="absolute top-0 h-full w-1/2 rounded-md bg-background shadow-sm border border-border"
                          animate={previewTab === 'iframe' ? { left: 0 } : { left: '50%' }}
                          transition={{ duration: 0.2 }}
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewTab('iframe')}
                          className={cn(
                            'relative z-10 flex-1 py-1.5 text-sm font-mono font-medium transition-colors text-center',
                            previewTab === 'iframe' ? 'text-foreground font-bold' : 'text-muted-foreground'
                          )}
                        >
                          iFrame
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab('popup')}
                          className={cn(
                            'relative z-10 flex-1 py-1.5 text-sm font-mono font-medium transition-colors text-center',
                            previewTab === 'popup' ? 'text-foreground font-bold' : 'text-muted-foreground'
                          )}
                        >
                          Popup
                        </button>
                      </div>
                    </div>
                 </div>

                 {/* Iframe View */}
                 {previewTab === 'iframe' && (
                   <div className="space-y-4">
                     <div className="space-y-2">
                       <Label className="text-sm font-semibold">Embed Code</Label>
                       <CodeBlock code={iframeEmbedCode} language="html" className="max-w-full">
                         <div className="absolute top-2 right-2 z-10">
                           <CodeBlockCopyButton />
                         </div>
                       </CodeBlock>
                     </div>
                     
                     <div className="flex justify-center border rounded-lg p-8 bg-muted/10">
                       <iframe
                         src={iframeEmbedUrl}
                         style={{ width: 320, height: 64 }}
                         className="shadow-lg rounded-full"
                         allow="microphone"
                       />
                     </div>
                   </div>
                 )}

                 {/* Popup View */}
                 {previewTab === 'popup' && (
                   <div className="space-y-4">
                      <div className="space-y-2">
                       <Label className="text-sm font-semibold">Embed Code</Label>
                       <CodeBlock code={popupEmbedCode} language="html" className="max-w-full">
                         <div className="absolute top-2 right-2 z-10">
                           <CodeBlockCopyButton />
                         </div>
                       </CodeBlock>
                      </div>

                     <div className="flex justify-center pt-8">
                       <div className="text-primary flex gap-1 items-center">
                         <p className="text-sm">
                           The popup button should appear in the bottom right corner of the screen
                         </p>
                         <HandPointingIcon
                           size={16}
                           className="rotate-[145deg] animate-bounce"
                         />
                       </div>
                     </div>
                     
                     {/* This renders the popup client specifically for preview purposes within the dialog context context 
                         NOTE: Since this uses fixed positioning (bottom right), it will appear on the user's screen outside the dialog. 
                         This is the intended behavior as per welcome.tsx demonstration.
                     */}
                     <EmbedPopupAgentClient appConfig={previewAppConfig} />
                   </div>
                 )}

              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                <Rocket className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground text-sm">
                  Deploy a release first to get embed codes
                </p>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          {hasReleases && (
            <TabsContent className="mt-4" value="history">
              <ScrollArea className="h-64">
                {releasesLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                    Loading releases...
                  </div>
                ) : (
                  <div className="space-y-2 pr-4">
                    {releases?.map((release, index) => (
                      <ReleaseItem
                        isLatest={index === 0}
                        isRollingBack={rollbackMutation.isPending}
                        key={release.id}
                        onRollback={() =>
                          handleRollback(release.id, release.releaseNumber)
                        }
                        release={release}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface ReleaseItemProps {
  release: WorkflowRelease;
  isLatest: boolean;
  onRollback: () => void;
  isRollingBack: boolean;
}

function ReleaseItem({
  release,
  isLatest,
  onRollback,
  isRollingBack,
}: ReleaseItemProps) {
  const deployedAt = new Date(release.deployedAt);
  const formattedDate = deployedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = deployedAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        isLatest
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-muted/30 hover:bg-muted/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              Release #{release.releaseNumber}
            </span>
            {isLatest && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 font-medium text-primary text-xs">
                Current
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
            <MessageSquare className="h-3 w-3" />
            <span className="truncate">{release.message}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            <span>
              {formattedDate} at {formattedTime}
            </span>
          </div>
        </div>

        {!isLatest && (
          <Button
            className="h-7 gap-1 text-xs"
            disabled={isRollingBack}
            onClick={onRollback}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="h-3 w-3" />
            Rollback
          </Button>
        )}
      </div>
    </div>
  );
}
