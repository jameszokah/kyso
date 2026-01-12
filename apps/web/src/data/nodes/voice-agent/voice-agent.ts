import { PaletteItem } from '@kyso/types/common';
import { schema } from './schema';
import { defaultPropertiesData } from './default-properties-data';
import { NodeType } from '@kyso/types/node-types';
import { uischema } from './uischema';

export const voiceAgent: PaletteItem = {
  label: 'Voice Agent',
  description: 'Voice Agent Node',
  type: 'voice-agent',
  icon: 'MicrophoneThin', // Reusing AiAgent icon for now, or use 'Mic' if available? Assuming 'AiAgent' works.
  templateType: NodeType.VoiceNode,
  defaultPropertiesData,
  schema,
  uischema,
};
