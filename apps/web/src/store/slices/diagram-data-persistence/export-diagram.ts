import { DiagramState } from '../diagram-slice';
import { toast } from 'sonner';

export function exportDiagram(get: () => DiagramState) {
  return () => {
    try {
      const { reactFlowInstance, documentName, layoutDirection } = get();

      if (!reactFlowInstance) {
        toast.error('Export failed', {
          description: 'No diagram instance found to export.',
        });
        return;
      }

      const data = reactFlowInstance.toObject();
      const model = {
        name: documentName || 'Untitled',
        layoutDirection,
        diagram: data,
        version: '1.0.0', // Adding a version for future compatibility
        timestamp: new Date().toISOString(),
      };

      const json = JSON.stringify(model, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Sanitize filename
      const filename = (documentName || 'workflow').replaceAll(/[^a-z0-9]/gi, '_').toLowerCase();

      link.href = url;
      link.download = `${filename}.jam`;
      document.body.append(link);
      link.click();

      // Cleanup
      link.remove();
      URL.revokeObjectURL(url);

      toast.success('Export successful', {
        description: `Workflow exported as ${filename}.jam`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: 'An error occurred while exporting the workflow.',
      });
    }
  };
}
