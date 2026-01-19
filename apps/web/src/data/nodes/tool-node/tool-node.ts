import type { PaletteItem } from '@kyso/types/common';
import { schema } from './schema';
import { defaultPropertiesData } from './default-properties-data';
import { uischema } from './uischema';
import { NodeType } from '@kyso/types/node-types';

export const toolNode: PaletteItem = {
  label: 'Tool',
  description: 'Define a tool for the agent',
  type: 'tool-node',
  icon: 'WrenchThin', // WrenchThin caused crash, using valid icon
  templateType: NodeType.Node, // Or a custom template
  defaultPropertiesData,
  schema,
  uischema,
};
