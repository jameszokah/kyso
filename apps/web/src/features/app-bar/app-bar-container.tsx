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
import { PreviewDialog } from '../workflow-validator/components/preview-dialog';
import type { WorkflowConfig } from '@/utils/state-machine-types';

export function AppBarContainer() {
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

  function handleSave() {
    saveDiagram(true);
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

  function handlePreview() {
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    
    if (result.isValid) {
        const config = extractWorkflowConfig(nodes, edges);
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

      <ProjectSelection documentName={documentName} isReadOnlyMode={isReadOnlyMode} />
      <ImportConfirmationDialog
        isOpen={isImportDialogOpen}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
        fileName={pendingFile?.name || ''}
      />
      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        validationResult={validationResult}
        config={previewConfig}
      />

    </div>
  );
}
