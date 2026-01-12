import { PaletteItem } from '@kyso/types/common';
import { schema } from './schema';
import { defaultPropertiesData } from './default-properties-data';
import { uischema } from './uischema';

export const endNode: PaletteItem = {
  label: 'End',
  description: 'End of the flow',
  type: 'end-node',
  icon: 'StopCircleThin',
  defaultPropertiesData,
  schema,
  uischema,
};
