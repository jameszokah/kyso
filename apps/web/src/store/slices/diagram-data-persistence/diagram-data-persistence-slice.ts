import { StatusType } from '@kyso/types/common';
import { GetDiagramState, SetDiagramState } from '@/store/store';
import { saveDiagram } from './save-diagram';
import { loadDiagram } from './load-diagram';
import { exportDiagram } from './export-diagram';
import { importDiagram } from './import-diagram';
import { saveAsImage } from './save-as-image';

export type DiagramDataPersistenceState = {
  loadDiagramStatus: StatusType;
  saveDiagram: (showNotification?: boolean) => void;
  loadDiagram: () => void;
  exportDiagram: () => void;
  importDiagram: (file: File) => void;
  saveAsImage: () => void;
};

export function useDiagramDataPersistenceSlice(set: SetDiagramState, get: GetDiagramState) {
  return {
    loadDiagramStatus: StatusType.Idle,
    saveDiagram: saveDiagram(get),
    loadDiagram: loadDiagram(set, get),
    exportDiagram: exportDiagram(get),
    importDiagram: importDiagram(set, get),
    saveAsImage: saveAsImage(get),
  };
}
