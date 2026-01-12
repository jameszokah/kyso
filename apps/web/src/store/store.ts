import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';
import {
  type DiagramDataModificationState,
  useDiagramDataModificationSlice,
} from './slices/diagram-data-modification/diagram-data-modification-slice';
import {
  type DiagramDataPersistenceState,
  useDiagramDataPersistenceSlice,
} from './slices/diagram-data-persistence/diagram-data-persistence-slice';
import { type PaletteState, usePaletteSlice } from './slices/palette/palette-slice';
import { type DiagramSelectionState, useDiagramSelectionSlice } from './slices/diagram-selection/diagram-selection-slice';
import { type DiagramState, useDiagramSlice } from './slices/diagram-slice';
import { devtools } from 'zustand/middleware';
import { withInterceptingMiddleware } from './middleware/middleware';
import { shallow } from 'zustand/shallow';
import { type UserPreferencesState, useUserPreferencesSlice } from './slices/user-preferences/user-preferences-slice';
import { type SettingsState, useSettingsSlice } from './slices/settings/settings-slice';

export type WorkflowEditorState = DiagramState &
  PaletteState &
  DiagramSelectionState &
  DiagramDataPersistenceState &
  DiagramDataModificationState &
  UserPreferencesState &
  SettingsState;

export type SetDiagramState = (
  partial:
    | WorkflowEditorState
    | Partial<WorkflowEditorState>
    | ((state: WorkflowEditorState) => WorkflowEditorState | Partial<WorkflowEditorState>),
  replace?: false | undefined,
) => void;

export type GetDiagramState = () => WorkflowEditorState;

const store: StateCreator<WorkflowEditorState> = withInterceptingMiddleware((set, get) => ({
  ...useDiagramSlice(set, get),
  ...useDiagramDataModificationSlice(set, get),
  ...useDiagramDataPersistenceSlice(set, get),
  ...useDiagramSelectionSlice(set, get),
  ...usePaletteSlice(set, get),
  ...useUserPreferencesSlice(set, get),
  ...useSettingsSlice(set, get),
}))([]);
const useStore = createWithEqualityFn<WorkflowEditorState>()(
  devtools<WorkflowEditorState>(store, {
    enabled: process.env.NODE_ENV === 'development',
  }),
  shallow,
);

export default useStore;
