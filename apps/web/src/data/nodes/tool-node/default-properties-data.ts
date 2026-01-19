import type { NodeDataProperties } from '@/features/json-form/types/default-properties';
import type { ToolNodeSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<ToolNodeSchema> = {
  label: 'New Tool',
  toolDescription: 'my_tool_description',
  toolType: 'function',
  functionConfig: undefined,
};
