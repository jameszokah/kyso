'use client';

import { useMemo, useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Cards, CaretDown, Spinner } from '@phosphor-icons/react';
import useStore from '@/store/store';
import { useI18n } from '@/locales/client';
import { useUpdateWorkflow } from '@/hooks/workflow-queries';
import { toast } from 'sonner';
import { DeployDialog } from '@/components/workflow/deploy-dialog';
import { extractWorkflowConfig } from '@/features/workflow-validator/workflow-logic';
import { authClient } from '@/lib/auth-client';

interface ProjectSelectionProps {
  workflowId: string;
  documentName: string;
  onDuplicateClick?: () => void;
  isReadOnlyMode: boolean;
}

export function ProjectSelection({ workflowId, documentName, onDuplicateClick, isReadOnlyMode }: ProjectSelectionProps) {
  const setDocumentName = useStore((state) => state.setDocumentName);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  
  const [editName, setEditName] = useState<boolean>(false);
  const [localName, setLocalName] = useState(documentName);
  const [isPending, startTransition] = useTransition();
  const t = useI18n();

  const { data: session } = authClient.useSession();
  const updateMutation = useUpdateWorkflow();

  const folderName = session?.user?.name || session?.user?.email?.split('@')[0] || t('header.folderName');

  // Sync local name with prop when not editing
  useEffect(() => {
    if (!editName) {
      setLocalName(documentName);
    }
  }, [documentName, editName]);

  const handleNameSave = () => {
    if (localName.trim() === documentName) {
      setEditName(false);
      return;
    }

    if (!localName.trim()) {
      setLocalName(documentName);
      setEditName(false);
      return;
    }

    setEditName(false);
    
    startTransition(async () => {
      try {
        setDocumentName(localName); // Optimistic update
        await updateMutation.mutateAsync({
          id: workflowId,
          name: localName,
        });
        toast.success('Workflow name updated');
      } catch {
        setDocumentName(documentName); // Revert on failure
        setLocalName(documentName);
        toast.error('Failed to update workflow name');
      }
    });
  };

  const items = useMemo(
    () =>
      onDuplicateClick
        ? [
            {
              label: t('header.projectSelection.duplicateToDrafts'),
              icon: <Cards weight="thin" />,
              onClick: onDuplicateClick,
            },
          ]
        : [],
    [onDuplicateClick, t],
  );

  const extractedConfig = useMemo(() => {
    try {
      return extractWorkflowConfig(nodes, edges);
    } catch {
      return null;
    }
  }, [nodes, edges]);

  return (
    <header className="flex justify-between items-center">
      <div
        // center the project selection in the app bar; hidden on small screens like original CSS
        className="absolute left-1/2 top-7 transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 w-[calc(100%-40%)] rounded-md mx-4 pointer-events-auto"
        // allow clicks to focus / edit without interfering with parent handlers
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className="text-sm text-muted-foreground whitespace-nowrap">{folderName} /</span>

        {editName && !isReadOnlyMode ? (
          <Input
            value={localName}
            onChange={(event) => {
              if (event.target.value.length > 128) return;
              setLocalName(event.target.value);
            }}
            onBlur={handleNameSave}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleNameSave();
                (event.currentTarget as HTMLInputElement).blur();
              }
            }}
            autoFocus
            className="min-w-[200px] max-w-[420px] text-sm"
          />
        ) : (
          <button
            type="button"
            onClick={() => !isReadOnlyMode && setEditName(true)}
            className="text-sm font-medium text-foreground truncate max-w-[320px] text-left flex items-center gap-2"
            title={documentName}
          >
            {documentName || 'Untitled'}
            {isPending && <Spinner className="animate-spin h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        )}

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('tooltips.pickTheProject') as string}
                className="h-8 w-8"
              >
                <CaretDown weight="thin" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={6} className="min-w-[200px]">
              {items.map((it, index) => (
                <DropdownMenuItem
                  key={`${it.label}-${index}`}
                  onSelect={(event) => {
                    event.preventDefault();
                    it.onClick();
                  }}
                  className="flex items-center gap-2"
                >
                  {it.icon}
                  <span>{it.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="absolute right-6 top-7 transform -translate-y-1/2 w-[calc(100%-75%)] pointer-events-auto">
        <DeployDialog 
          workflowId={workflowId}
          workflowName={documentName}
          extractedConfig={extractedConfig}
        />
      </div>
    </header>
  );
}
