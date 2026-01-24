import type { UISchema } from '@/features/json-form/types/uischema';
import { getScope } from '@/features/json-form/utils/get-scope';
import type { VoiceAgentNodeSchema } from './schema';

const scope = getScope<VoiceAgentNodeSchema>;

export const uischema: UISchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Accordion',
      label: 'General Information',
      elements: [
        {
          type: 'Text',
          scope: scope('properties.label'),
          label: 'Title',
          placeholder: 'Voice Agent',
        },
      ],
    },
    {
      type: 'Accordion',
      label: 'System Prompt',
      elements: [
        {
          type: 'TextArea',
          scope: scope('properties.systemPrompt'),
          placeholder: 'Type your system prompt here...',
          minRows: 5,
        },
      ],
    },
    {
      type: 'Accordion',
      label: 'Model Configuration',
      elements: [
        { type: 'Select', scope: scope('properties.model.properties.provider'), label: 'Provider' },
        { type: 'Select', scope: scope('properties.model.properties.modelName'), label: 'Model Name' },
      ],
    },
    {
      type: 'Accordion',
      label: 'Voice Configuration',
      elements: [
        { type: 'Select', scope: scope('properties.voice.properties.provider'), label: 'Provider' },
        { type: 'Select', scope: scope('properties.voice.properties.voiceId'), label: 'Voice ID' },
      ],
    },
    {
      type: 'Accordion',
      label: 'STT Configuration',
      elements: [
        { type: 'Select', scope: scope('properties.stt.properties.provider'), label: 'Provider' },
        { type: 'Select', scope: scope('properties.stt.properties.modelName'), label: 'Model Name' },
        { type: 'Select', scope: scope('properties.stt.properties.language'), label: 'Language' },
      ],
    },
    {
      type: 'Accordion',
      label: 'Tools',
      elements: [{ type: 'AgentToolsList', scope: scope('properties.tools') }],
    },
  ],
};
