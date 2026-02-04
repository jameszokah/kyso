'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { CardsIcon as Cards, SpinnerIcon as Spinner, ArrowLeftIcon as ArrowLeft } from '@phosphor-icons/react';
import useStore from '@/store/store';
import { useI18n } from '@/locales/client';
import { useUpdateWorkflow } from '@/hooks/workflow-queries';
import { toast } from 'sonner';
import { DeployDialog } from '@/components/workflow/deploy-dialog';
import { extractWorkflowConfig } from '@/features/workflow-validator/workflow-logic';

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

  const updateMutation = useUpdateWorkflow();

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

  const _items = useMemo(
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
      return extractWorkflowConfig(nodes, edges, workflowId, documentName);
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
        <Link 
          href="/dashboard"
          className="group flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap hover:text-foreground transition-colors"
        >
          <ArrowLeft 
            weight="bold" 
            className="w-3 h-3 transition-all duration-300 transform translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" 
          />
          <span className="transition-transform duration-300 group-hover:translate-x-1">Workflows</span>
          <span className="text-muted-foreground/50 ml-1">/</span>
        </Link>

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
