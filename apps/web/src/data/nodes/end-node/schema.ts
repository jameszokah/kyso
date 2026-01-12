import { NodeSchema } from '@kyso/types/node-schema';
import { sharedProperties } from '../shared/shared-properties';

export const schema = {
  required: ['label'],
  type: 'object',
  properties: {
    ...sharedProperties,
  },
} satisfies NodeSchema;

export type EndNodeSchema = typeof schema;
