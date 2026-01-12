import { PaletteItem } from '@kyso/types/common';
import { defaultPropertiesData } from './default-properties-data';
import { DecisionNodeSchema, schema } from './schema';
import { uischema } from './uischema';
import { NodeType } from '@kyso/types/node-types';

export const decision: PaletteItem<DecisionNodeSchema> = {
  label: 'node.decision.label',
  description: 'node.decision.description',
  type: 'decision',
  icon: 'ArrowsSplitThin',
  templateType: NodeType.DecisionNode,
  defaultPropertiesData,
  schema,
  uischema,
};
