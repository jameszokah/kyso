import { GetDiagramState, SetDiagramState } from '@/store/store';
import { toast } from 'sonner';
import { DiagramModel, StatusType } from '@kyso/types/common';
import { delay } from '@/utils/common';

export function importDiagram(set: SetDiagramState, get: GetDiagramState) {
  return async (file: File) => {
    if (!file) return;

    set({ loadDiagramStatus: StatusType.Loading });

    try {
      const text = await file.text();
      const data = JSON.parse(text) as DiagramModel;

      // Basic validation
      if (!data.diagram || !Array.isArray(data.diagram.nodes) || !Array.isArray(data.diagram.edges)) {
        throw new Error('Invalid file format');
      }

      const { name, diagram, layoutDirection } = data;

      set({
        documentName: name,
        nodes: diagram.nodes,
        layoutDirection: layoutDirection || 'RIGHT',
        loadDiagramStatus: StatusType.Success,
      });

      set({
        edges: diagram.edges,
      });

      if (diagram.viewport) {
        get().reactFlowInstance?.setViewport(diagram.viewport);
      }

      await delay(500);

      toast.success('Import successful', {
        description: `Workflow loaded from ${file.name}`,
      });
    } catch (error) {
      console.error('Import error:', error);
      set({ loadDiagramStatus: StatusType.Error });
      toast.error('Import failed', {
        description: 'Failed to parse the workflow file. Please ensure it is a valid .jam file.',
      });
    } finally {
      set({ loadDiagramStatus: StatusType.Idle });
    }
  };
}
