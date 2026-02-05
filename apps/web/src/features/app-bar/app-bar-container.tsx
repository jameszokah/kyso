'use client';

import useStore from '@/store/store';

import { useContext, useEffect, useState } from 'react';
import { Toolbar } from './toolbar';
import { ProjectSelection } from './project-selection';
import { ImportConfirmationDialog } from './import-confirmation-dialog';
// import { Controls } from './controls';
import { UndoRedoContext } from '@/providers/undo-redo-provider';
import { useElkLayout } from '@/hooks/use-elk-layout/use-elk-layout';
// import { useTheme } from '../../hooks/use-theme';
import { validateWorkflow, extractWorkflowConfig, type ValidationResult } from '../workflow-validator/workflow-logic';
import { PreviewDrawer } from '../workflow-validator/components/preview-drawer';
import type { WorkflowConfig } from '@/utils/state-machine-types';
import { useUpdateWorkflow } from '@/hooks/workflow-queries';
import { toast } from 'sonner';

export function AppBarContainer({ workflowId }: { workflowId: string }) {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const documentName = useStore((state) => state.documentName || '');
  const isReadOnlyMode = useStore((store) => store.isReadOnlyMode);
  const saveDiagram = useStore((store) => store.saveDiagram);
  const setToggleReadOnlyMode = useStore((store) => store.setToggleReadOnlyMode);
  const layoutDirection = useStore((store) => store.layoutDirection);
  const setLayoutDirection = useStore((store) => store.setLayoutDirection);

  const exportDiagram = useStore((store) => store.exportDiagram);
  const importDiagram = useStore((store) => store.importDiagram);
  const saveAsImage = useStore((store) => store.saveAsImage);

  const { undo, redo, canUndo, canRedo } = useContext(UndoRedoContext);

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [previewConfig, setPreviewConfig] = useState<WorkflowConfig | null>(null);

  const updateMutation = useUpdateWorkflow();
  const reactFlowInstance = useStore((state) => state.reactFlowInstance);

  const layout = useElkLayout();

  useEffect(() => {
    function handleDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
    }

    function handleDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();

      const file = event.dataTransfer?.files?.[0];
      if (file && file.name.endsWith('.jam')) {
        setPendingFile(file);
        setIsImportDialogOpen(true);
      }
    }

    globalThis.addEventListener('dragover', handleDragOver);
    globalThis.addEventListener('drop', handleDrop);

    return () => {
      globalThis.removeEventListener('dragover', handleDragOver);
      globalThis.removeEventListener('drop', handleDrop);
    };
  }, []);

  async function handleSave() {
    if (!reactFlowInstance) return;

    try {
      const flow = reactFlowInstance.toObject();
      
      await updateMutation.mutateAsync({
        id: workflowId,
        canvasData: flow,
      });
      
      toast.success('Workflow saved successfully');
    } catch (error) {
      console.error('Failed to save workflow', error);
      toast.error('Failed to save workflow');
    }
  }

  function handleChangeReadonlyMode(value: boolean) {
    setToggleReadOnlyMode(value);
  }

  async function handleLayoutChange(isVertical: boolean) {
    const direction = isVertical ? 'DOWN' : 'RIGHT';
    setLayoutDirection(direction);

    await layout(direction);
  }

  function handleExport() {
    exportDiagram();
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jam';
    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setPendingFile(file);
        setIsImportDialogOpen(true);
      }
    });
    input.click();
  }

  function handleConfirmImport() {
    if (pendingFile) {
      importDiagram(pendingFile);
      setPendingFile(null);
      setIsImportDialogOpen(false);
    }
  }

  function handleCancelImport() {
    setPendingFile(null);
    setIsImportDialogOpen(false);
  }

  function handleSaveAsImage() {
    saveAsImage();
  }

  const setValidatedEdgeIds = useStore((store) => store.setValidatedEdgeIds);

  function handlePreview() {
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    
    // Set validated edges for animation
    setValidatedEdgeIds(result.validEdges);
    
    if (result.isValid) {
        const config = extractWorkflowConfig(nodes, edges, workflowId, documentName);
        setPreviewConfig(config);
    } else {
        setPreviewConfig(null);
    }
    
    setIsPreviewOpen(true);
  }


  return (
    <div className={''}>
      <Toolbar
        onSave={handleSave}
        onUndo={undo}
        onOpen={handleImport}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onLayoutChange={handleLayoutChange}
        isLayoutVertical={layoutDirection === 'DOWN'}
        onToggleReadOnly={handleChangeReadonlyMode}
        isReadOnlyMode={isReadOnlyMode}
        onExport={handleExport}
        onImport={handleImport}
        onSaveAsImage={handleSaveAsImage}
        onPreview={handlePreview}
      />

      <ProjectSelection 
        workflowId={workflowId} 
        documentName={documentName} 
        isReadOnlyMode={isReadOnlyMode} 
      />
      <ImportConfirmationDialog
        isOpen={isImportDialogOpen}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
        fileName={pendingFile?.name || ''}
      />
      <PreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        validationResult={validationResult}
        config={previewConfig}
        workflowId={workflowId}
      />

    </div>
  );
}
