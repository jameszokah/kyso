'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import useStore from '@/store/store';
import type { DiagramModel } from '@kyso/types/common';
import { localStorageKey } from '@/utils/consts';
import { useTemplateSelectionModal } from './use-welcome-modal';

export function useAutoload(initialData?: DiagramModel | null) {
  const setDiagramModel = useStore((store) => store.setDiagramModel);
  const { openTemplateSelectionModal } = useTemplateSelectionModal();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;

    if (initialData) {
      setDiagramModel(initialData, false);
      hasLoaded.current = true;
      return;
    }

    const stringifiedModel = localStorage.getItem(localStorageKey);

    if (!stringifiedModel) {
      openTemplateSelectionModal({ shouldSetEmptyOnClose: true });
      return;
    }

    try {
      const model: DiagramModel = JSON.parse(stringifiedModel);
      setDiagramModel(model, false);
      hasLoaded.current = true;

      toast.success('Diagram restored successfully', {
        description: 'Your last workflow has been reloaded.',
      });
    } catch (error) {
      console.error(error);

      toast.error('Failed to restore diagram', {
        description: 'An error occurred while reloading your workflow.',
      });
    }
  }, [openTemplateSelectionModal, setDiagramModel]);
}
