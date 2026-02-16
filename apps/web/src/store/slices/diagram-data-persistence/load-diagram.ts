import { type GetDiagramState, type SetDiagramState } from '@/store/store';
import { delay } from '@/utils/common';
import { localStorageKey } from '@kyso/types/consts';
// import { toast } from 'sonner';
import { sileo } from 'sileo';
import { type DiagramModel, StatusType } from '@kyso/types/common';

export function loadDiagram(set: SetDiagramState, get: GetDiagramState) {
  return async () => {
    set({ loadDiagramStatus: StatusType.Loading });

    const data = await loadData(onError);

    if (data) {
      const { name, diagram } = data;

      set({
        documentName: name,
        nodes: diagram.nodes,
        loadDiagramStatus: StatusType.Success,
      });

      set({
        edges: diagram.edges,
      });

      get().reactFlowInstance?.setViewport(diagram.viewport);

      await delay(500);
    } else {
      // toast.error('No diagram to load', {
      //   description: 'There is no saved workflow available to load.',
      // });
      sileo.error({ title: 'No diagram to load', description: 'There is no saved workflow available to load.' });
    }

    set({ loadDiagramStatus: StatusType.Idle });
  };

  function onError() {
    set({ loadDiagramStatus: StatusType.Error });
    // toast.error('Failed to load diagram', {
    //   description: 'An error occurred while loading your workflow.',
    // });
    sileo.error({ title: 'Failed to load diagram', description: 'An error occurred while loading your workflow.' });
  }
}

async function loadData(onError: () => void): Promise<DiagramModel | null> {
  try {
    const json = globalThis.localStorage.getItem(localStorageKey) || '';
    return JSON.parse(json) as DiagramModel;
  } catch {
    onError();
  }

  return null;
}
