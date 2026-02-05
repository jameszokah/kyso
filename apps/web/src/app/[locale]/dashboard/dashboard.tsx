"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useWorkflows,
  useCreateWorkflow,
  useDeleteWorkflow,
  type Workflow as WorkflowType,
} from "@/hooks/workflow-queries";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { Route } from "next";
import { templates } from "@/data/templates";
import { Icon } from "@kyso/icons";
import type { TemplateModel } from "@kyso/types/common";

interface DashboardProps {
  customerState: Awaited<ReturnType<typeof authClient.customer.state>>;
  session: typeof authClient.$Infer.Session;
}

export default function Dashboard({ customerState, session }: DashboardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowDescription, setNewWorkflowDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateModel | null>(null);
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowType | null>(null);

  const { data, isLoading, error } = useWorkflows();
  const createMutation = useCreateWorkflow();
  const deleteMutation = useDeleteWorkflow();

  const workflows = data?.workflows ?? [];
  const filteredWorkflows = workflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkflow = async () => {
    try {
      const created = await createMutation.mutateAsync({
        name: newWorkflowName.trim() || "Untitled Workflow",
        description: newWorkflowDescription.trim() || undefined,
        canvasData: selectedTemplate?.value.diagram,
      });
      setIsCreateDialogOpen(false);
      setNewWorkflowName("");
      setNewWorkflowDescription("");
      setSelectedTemplate(null);
      toast.success("Workflow created!");
      router.push(`/workflow/${created.id}` as Route);
    } catch {
      toast.error("Failed to create workflow");
    }
  };

  const handleDeleteWorkflow = async () => {
    if (!workflowToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: workflowToDelete.id });
      setWorkflowToDelete(null);
      toast.success("Workflow deleted");
    } catch {
      toast.error("Failed to delete workflow");
    }
  };

  const handleOpenWorkflow = (id: string) => {
    router.push(`/workflow/${id}` as Route);
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Workflows</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage your voice agent workflows
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Workflow Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-8 text-center">
          <p className="text-destructive">Failed to load workflows</p>
          <p className="mt-1 text-muted-foreground text-sm">
            Please try refreshing the page
          </p>
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <Workflow className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold text-lg">No workflows yet</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {searchQuery
              ? "No workflows match your search"
              : "Create your first workflow to get started"}
          </p>
          {!searchQuery && (
            <Button
              className="mt-4 gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              onOpen={() => handleOpenWorkflow(wf.id)}
              onDelete={() => setWorkflowToDelete(wf)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Give your workflow a name and choose a preset to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Name</Label>
              <Input
                id="workflow-name"
                placeholder="My Voice Agent"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="workflow-description">
                Description <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="workflow-description"
                placeholder="Brief description of your workflow..."
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Start from a preset</Label>
              <div className="grid grid-cols-3 gap-2">
                {/* Empty Canvas Option */}
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(null)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                    "hover:border-primary/50 hover:bg-muted/50",
                    !selectedTemplate
                      ? "border-primary bg-primary/5"
                      : "border-border bg-transparent"
                  )}
                >
                  {!selectedTemplate && (
                    <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                  <Icon name="CornersOutThin" size="medium" className="text-muted-foreground" />
                  <span className="text-xs font-medium">Empty</span>
                </button>

                {/* Template Options */}
                {templates.map((template) => (
                  <button
                    type="button"
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                      "hover:border-primary/50 hover:bg-muted/50",
                      selectedTemplate?.id === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-transparent"
                    )}
                  >
                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                    <Icon name={template.icon} size="medium" className="text-muted-foreground" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium line-clamp-1">{template.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {template.value.diagram.nodes.length} nodes
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWorkflow}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Workflow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!workflowToDelete}
        onOpenChange={(open) => !open && setWorkflowToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{workflowToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWorkflowToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkflow}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WorkflowCardProps {
  workflow: WorkflowType;
  onOpen: () => void;
  onDelete: () => void;
}

function WorkflowCard({ workflow, onOpen, onDelete }: WorkflowCardProps) {
  const updatedAt = new Date(workflow.updatedAt);
  const formattedDate = updatedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const nodeCount = workflow.canvasData?.nodes?.length ?? 0;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
      )}
      onClick={onOpen}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-lg">{workflow.name}</h3>
          {workflow.description && (
            <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
              {workflow.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-muted-foreground text-xs">
          <div className="flex items-center gap-1">
            <Workflow className="h-3.5 w-3.5" />
            <span>{nodeCount} nodes</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
