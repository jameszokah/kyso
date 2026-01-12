import { PaletteItem } from '@kyso/types/common';
import { schema } from './schema';
import { defaultPropertiesData } from './default-properties-data';
import { uischema } from './uischema';

export const startNode: PaletteItem = {
  label: 'Start',
  description: 'Start of the flow',
  type: 'start-node',
  icon: 'PlayCircleThin',
  defaultPropertiesData,
  schema,
  uischema,
};
