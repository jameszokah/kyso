import { toPng } from 'html-to-image';
import { type DiagramState } from '../diagram-slice';
// import { toast } from 'sonner';
import { sileo } from 'sileo';
import { getNodesBounds } from '@xyflow/react';

export function saveAsImage(get: () => DiagramState) {
  return async () => {
    const { nodes, documentName } = get();

    // We need to query the viewport element from the DOM
    // This assumes the React Flow wrapper has a specific class or ID we can target
    // Or we can try to find the .react-flow__viewport element
    const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;

    if (!viewportElement) {
      // toast.error('Export failed', {
      //   description: 'Could not find the diagram viewport.',
      // });
      sileo.error({ title: 'Export failed', description: 'Could not find the diagram viewport.' });
      return;
    }

    try {
      // Calculate bounds to ensure we capture all nodes
      const nodesBounds = getNodesBounds(nodes);
      const imageWidth = nodesBounds.width;
      const imageHeight = nodesBounds.height;

      // Add some padding
      const padding = 50;

      // We might need to temporarily style the element to ensure it captures everything
      // But html-to-image usually handles the current view.
      // To capture the *entire* diagram, we often need to use the `width` and `height` options
      // and potentially transform the element.
      // However, a simpler approach for "Save as Image" is often just saving what's visible
      // OR saving the whole flow. Let's aim for the whole flow.

      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#ffffff', // or transparent
        width: imageWidth + padding * 2,
        height: imageHeight + padding * 2,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${nodesBounds.x * -1 + padding}px, ${nodesBounds.y * -1 + padding}px)`,
        },
      });

      const link = document.createElement('a');
      const filename = (documentName || 'workflow').replaceAll(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      // toast.success('Image saved', {
      //   description: `Workflow saved as ${filename}.png`,
      // });
      sileo.success({ title: 'Image saved', description: `Workflow saved as ${filename}.png` });
    } catch (error) {
      console.error('Save as image error:', error);
      // toast.error('Export failed', {
      //   description: 'Failed to generate image from workflow.',
      // });
      sileo.error({ title: 'Export failed', description: 'Failed to generate image from workflow.' });
    }
  };
}
