import { PaletteItem } from '@kyso/types/common';
import { schema } from './schema';
import { defaultPropertiesData } from './default-properties-data';
import { NodeType } from '@kyso/types/node-types';
import { uischema } from './uischema';

export const aiAgent: PaletteItem = {
  label: 'AI Agent',
  description: 'AI Agent Node',
  type: 'ai-agent',
  icon: 'AiAgent',
  templateType: NodeType.AiNode,
  defaultPropertiesData,
  schema,
  uischema,
};
