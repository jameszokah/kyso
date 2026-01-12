import { NodeSchema } from '@kyso/types/node-schema';
import { sharedProperties } from '../shared/shared-properties';

export const schema = {
  required: ['label'],
  type: 'object',
  properties: {
    ...sharedProperties,
    agentName: {
      type: 'string',
    },
    allowCall: {
      type: 'boolean',
    },
  },
} satisfies NodeSchema;

export type StartNodeSchema = typeof schema;
