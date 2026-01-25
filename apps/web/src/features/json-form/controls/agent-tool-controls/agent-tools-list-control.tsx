'use client';

import { PlusCircleIcon, SlidersHorizontalIcon, TrashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createControlRenderer } from '../../utils/rendering';
import { useState, useCallback } from 'react';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import type { AgentToolConfig } from './agent-tool-config-control';
import { AgentToolConfigControl } from './agent-tool-config-control';
import type { ControlProps } from '@jsonforms/core';

// Reusing generic ControlProps or defining specific one
// Depending on how strict the TS setup is. I'll define a minimal interface.
interface AgentToolsListControlProps {
  data: AgentToolConfig[];
  path: string;
  handleChange: (path: string, value: AgentToolConfig[]) => void;
  uischema?: any;
}

function hasAnyValue(data: AgentToolConfig): boolean {
  return !!data.name && !!data.type;
}

function AgentToolsListControl({ path, handleChange, data }: AgentToolsListControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [editingTool, setEditingTool] = useState<AgentToolConfig | undefined>();

  const handleSubmit = useCallback(() => {
    if (editingTool && hasAnyValue(editingTool)) {
      let updated = data ? [...data] : [];
      if (editingIndex !== undefined) {
        updated[editingIndex] = editingTool;
      } else {
        updated.push(editingTool);
      }
      handleChange(path, updated);
      setIsOpen(false);
      setEditingTool(undefined);
      setEditingIndex(undefined);
    }
  }, [data, handleChange, path, editingTool, editingIndex]);

  const openEditorModal = useCallback((tool?: AgentToolConfig, index?: number) => {
    setEditingTool(tool || { name: '', description: '', type: 'http_request', config: {} });
    setEditingIndex(index);
    setIsOpen(true);
  }, []);

  const removeTool = useCallback((index: number) => {
    const updated = data.filter((_, i) => i !== index);
    handleChange(path, updated);
  }, [data, handleChange, path]);

  return (
    <>
      <div className="flex flex-col gap-2">
        {data?.map((toolData, index) => (
          <div key={index} className="flex gap-2 items-center">
             <Button
                variant="secondary"
                className="flex-1 justify-start gap-2"
                onClick={() => openEditorModal(toolData, index)}
              >
                <SlidersHorizontalIcon />
                {toolData.name || `Tool #${index + 1}`}
                <span className="text-xs text-muted-foreground ml-auto">
                    {toolData.type}
                </span>
             </Button>
             <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTool(index)}
                className="text-destructive hover:text-destructive"
             >
                 <TrashIcon />
             </Button>
          </div>
        ))}

        <Button variant="default" onClick={() => openEditorModal()}>
          <PlusCircleIcon className="mr-2" />
          Add Tool
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontalIcon />
              {editingIndex !== undefined ? 'Edit Tool' : 'Add Tool'}
            </DialogTitle>
          </DialogHeader>

          {isOpen && editingTool && (
             <AgentToolConfigControl
               value={editingTool}
               onChange={setEditingTool}
             />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Tool</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const agentToolsListControlRenderer = createControlRenderer('AgentToolsList', AgentToolsListControl);
