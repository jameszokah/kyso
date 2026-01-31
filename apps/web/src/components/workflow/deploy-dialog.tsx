"use client";

import {
  Check,
  Clock,
  Code,
  Copy,
  History,
  MessageSquare,
  Rocket,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
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
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const { data: releases, isLoading: releasesLoading } = useWorkflowReleases(
    isOpen ? workflowId : undefined
  );

  const deployMutation = useDeployWorkflow();
  const rollbackMutation = useRollbackWorkflow();

  const latestRelease = releases?.[0];

  // Generate embed URLs
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const popupUrl = `${baseUrl}/embed/${workflowId}/popup`;
  const iframeUrl = `${baseUrl}/embed/${workflowId}`;
  const iframeCode = `<iframe src="${iframeUrl}" width="400" height="600" frameborder="0" allow="microphone"></iframe>`;

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedType(null), 2000);
  };

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

  const hasReleases = releases && releases.length > 0;

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" size="sm">
          <Rocket className="h-4 w-4" />
          Deploy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
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
              Embed
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

          {/* Embed Tab */}
          <TabsContent className="mt-4 space-y-4" value="embed">
            {hasReleases ? (
              <>
                <div className="space-y-2">
                  <Label>Popup URL</Label>
                  <div className="flex gap-2">
                    <Input
                      className="font-mono text-xs"
                      readOnly
                      value={popupUrl}
                    />
                    <Button
                      onClick={() => handleCopy(popupUrl, "popup")}
                      size="icon"
                      variant="outline"
                    >
                      {copiedType === "popup" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>iFrame URL</Label>
                  <div className="flex gap-2">
                    <Input
                      className="font-mono text-xs"
                      readOnly
                      value={iframeUrl}
                    />
                    <Button
                      onClick={() => handleCopy(iframeUrl, "iframe")}
                      size="icon"
                      variant="outline"
                    >
                      {copiedType === "iframe" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>iFrame Embed Code</Label>
                  <div className="flex gap-2">
                    <Input
                      className="font-mono text-xs"
                      readOnly
                      value={iframeCode}
                    />
                    <Button
                      onClick={() => handleCopy(iframeCode, "code")}
                      size="icon"
                      variant="outline"
                    >
                      {copiedType === "code" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => window.open(popupUrl, "_blank")}
                    variant="outline"
                  >
                    Preview Popup
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => window.open(iframeUrl, "_blank")}
                    variant="outline"
                  >
                    Preview iFrame
                  </Button>
                </div>
              </>
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
