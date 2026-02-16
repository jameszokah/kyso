import { localStorageKey } from '@kyso/types/consts';
// import { toast } from 'sonner';
import { sileo } from 'sileo';
import { type DiagramState } from '../diagram-slice';
import { extractStateMachineConfig } from '@/utils/export-state-machine';

export function saveDiagram(get: () => DiagramState) {
  return (showNotification = true) => {
    try {
      const { reactFlowInstance, documentName, layoutDirection } = get();
      const data = reactFlowInstance?.toObject();
      const model = {
        name: documentName || '',
        layoutDirection,
        diagram: data,
      };

      console.log('Nodes:', data?.nodes);
      console.log('Edges:', data?.edges);
      console.log('extractStateMachineConfig', extractStateMachineConfig(data?.nodes || [], data?.edges || []));

      const json = JSON.stringify(model);
      localStorage.setItem(localStorageKey, json);

      if (!showNotification) return;

      // toast.success('Diagram saved successfully', {
      //   description: 'Your workflow has been saved to local storage.',
      // });
      sileo.success({ title: 'Diagram saved successfully', description: 'Your workflow has been saved to local storage.' });
    } catch {
      onError();
    }
  };
}

function onError() {
  // toast.error('Failed to save diagram', {
  //   description: 'An error occurred while saving your workflow.',
  // });
  sileo.error({ title: 'Failed to save diagram', description: 'An error occurred while saving your workflow.' });
}
