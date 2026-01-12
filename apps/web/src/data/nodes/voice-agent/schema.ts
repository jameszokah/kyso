import { NodeSchema } from '@kyso/types/node-schema';
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
    },
  },
} satisfies NodeSchema;

export type VoiceAgentNodeSchema = typeof schema;
