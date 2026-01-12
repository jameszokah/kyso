import { NodeDataProperties } from '@/features/json-form/types/default-properties';
import { VoiceAgentNodeSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<VoiceAgentNodeSchema> = {
  label: 'Voice Agent',
  systemPrompt: 'You are a helpful assistant.',
  model: {
    provider: 'openai',
    modelName: 'gpt-4o-mini',
  },
  voice: {
    provider: 'cartesia',
    voiceId: 'sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc',
  },
  stt: {
    provider: 'assemblyai',
    modelName: 'universal-streaming',
    language: 'en',
  },
  tools: [],
};
