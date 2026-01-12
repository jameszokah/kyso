'use client';

import { PlusCircleIcon, SlidersHorizontalIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui-test/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createControlRenderer } from '../../utils/rendering';
import { useState, useCallback } from 'react';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import { AiToolsControlProps, AiAgentTool } from '../../types/controls';
import { toolOptions } from '../../../../data/nodes/ai-agent/select-options';
import { AddAiToolFormContent } from './components/add-ai-tool-form-content/add-ai-tool-form-content';
import { AddAiToolFooter } from './components/add-ai-tool-footer/add-ai-tool-footer';
import { Icon } from '@kyso/icons';

function hasAnyValue(data: AiAgentTool): boolean {
  return Object.values(data).some((value) => typeof value === 'string' && value.trim() !== '');
}

function AiToolsControl({ path, handleChange, data }: AiToolsControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AiAgentTool | undefined>();

  const handleSubmit = useCallback(
    (change: AiAgentTool) => {
      if (hasAnyValue(change)) {
        const updated = (data ?? []).some((item) => item.id === change.id)
          ? (data ?? []).map((item) => (item.id === change.id ? { ...item, ...change, id: item.id } : item))
          : [...(data ?? []), { ...change, id: crypto.randomUUID() }];

        handleChange(path, updated);
      }
      setIsOpen(false);
      setEditingTool(undefined);
    },
    [data, handleChange, path],
  );

  const openEditorModal = useCallback((tool?: AiAgentTool) => {
    setEditingTool(tool);
    setIsOpen(true);
  }, []);

  return (
    <>
      {data?.map((toolData, index) => {
        const toolOption = toolOptions[toolData.tool];
        const icon = toolOption?.icon;
        const label = toolOption?.label;

        return (
          <FormControlWithLabel key={toolData.id ?? index} label={`Tool #${index + 1}`}>
            <Button
              variant="secondary"
              className="flex items-center gap-1"
              onClick={() => openEditorModal(toolData)}
            >
              {icon && <Icon name={icon} className="mr-2" />}
              {label}
            </Button>
          </FormControlWithLabel>
        );
      })}

      <Button variant="default" onClick={() => openEditorModal()}>
        <PlusCircleIcon />
        Add Tool Slot
      </Button>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontalIcon />
              Add Tools
            </DialogTitle>
          </DialogHeader>

          <AddAiToolFormContent onSubmit={handleSubmit} data={editingTool} />

          <DialogFooter>
            <AddAiToolFooter onCancelClick={() => setIsOpen(false)} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const aiToolsControlRenderer = createControlRenderer('AiTools', AiToolsControl);
