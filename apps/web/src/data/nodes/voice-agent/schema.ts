import type { NodeSchema } from '@kyso/types/node-schema';
import { sharedProperties } from '../shared/shared-properties';
import {
  modelProviderOptions,
  modelNameOptions,
  voiceProviderOptions,
  voiceIdOptions,
  sttProviderOptions,
  sttModelOptions,
  languageOptions,
} from './select-options';

export const schema = {
  required: ['label', 'systemPrompt'],
  type: 'object',
  properties: {
    ...sharedProperties,
    systemPrompt: {
      type: 'string',
    },
    model: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          options: Object.values(modelProviderOptions),
          placeholder: 'Select Model Provider',
        },
        modelName: {
          type: 'string',
          options: Object.values(modelNameOptions),
          placeholder: 'Select Model',
        },
        apiKey: {
          type: 'string',
          placeholder: 'API Key (optional)',
        },
      },
    },

    voice: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          options: Object.values(voiceProviderOptions),
          placeholder: 'Select Voice Provider',
        },
        voiceId: {
          type: 'string',
          options: Object.values(voiceIdOptions),
          placeholder: 'Select Voice',
        },
        apiKey: {
          type: 'string',
          placeholder: 'API Key (optional)',
        },
      },
    },

    stt: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          options: Object.values(sttProviderOptions),
          placeholder: 'Select STT Provider',
        },
        modelName: {
          type: 'string',
          options: Object.values(sttModelOptions),
          placeholder: 'Select STT Model',
        },
        language: {
          type: 'string',
          options: Object.values(languageOptions),
          placeholder: 'Select Language',
        },
        apiKey: {
          type: 'string',
          placeholder: 'API Key (optional)',
        },
      },
    },

    tools: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          type: {
            type: 'string',
            options: [
              { label: 'HTTP Request', value: 'http_request' },
              { label: 'Function', value: 'function' },
              { label: 'Webhook', value: 'webhook' },
            ],
          },
          config: {
            type: 'object',
            properties: {}, // Allow any config for now, managed by custom control
          },
        },
      },
    },
  },
} satisfies NodeSchema;

export type VoiceAgentNodeSchema = typeof schema;
