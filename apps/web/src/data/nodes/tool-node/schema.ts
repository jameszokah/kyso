import { NodeSchema } from '@kyso/types/node-schema';
import { sharedProperties } from '../shared/shared-properties';

export const schema = {
  required: ['label'],
  type: 'object',
  properties: {
    ...sharedProperties,
    toolDescription: {
      type: 'string',
    },
    toolType: {
      type: 'string',
      options: [
        { label: 'Function', value: 'function' },
        { label: 'Transfer To', value: 'transfer' },
      ],
      label: 'Type',
    },
    functionConfig: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
          type: {
            type: 'string',
            options: [
              { label: 'Transfer To', value: 'transfer' },
              { label: 'Function', value: 'function' },
            ],
          },
          config: {
            type: 'object',
            properties: {},
          },
        },
      },
    transferTo: {
      type: 'string',
    },
  },
} satisfies NodeSchema;

export type ToolNodeSchema = typeof schema;
