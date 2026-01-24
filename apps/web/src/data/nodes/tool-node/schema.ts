import type { NodeSchema } from '@kyso/types/node-schema';
import { sharedProperties } from '../shared/shared-properties';

export const schema = {
  required: ['label'],
  type: 'object',
  properties: {
    ...sharedProperties,
    label: {
      type: 'string',
    },
    tool: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        type: {
          type: 'string',
          options: [{ label: 'HTTP Request', value: 'http_request' }],
        },
        config: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
} satisfies NodeSchema;


export type ToolNodeSchema = typeof schema;
