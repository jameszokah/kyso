import { uischema } from './uischema';
import { defaultPropertiesData } from './default-properties-data';
import { ConditionalNodeSchema, schema } from './schema';
import { PaletteItem } from '@kyso/types/common';

export const conditional: PaletteItem<ConditionalNodeSchema> = {
  label: 'node.conditional.label',
  description: 'node.conditional.description',
  type: 'conditional',
  icon: 'ListChecksThin',
  defaultPropertiesData,
  schema,
  uischema,
};
