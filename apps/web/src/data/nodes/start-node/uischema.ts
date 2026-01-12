import { UISchema } from '@/features/json-form/types/uischema';
import { getScope } from '@/features/json-form/utils/get-scope';
import { StartNodeSchema } from './schema';

const scope = getScope<StartNodeSchema>;

export const uischema: UISchema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Text', scope: scope('properties.label'), label: 'Title', placeholder: 'Start' },
    {
      type: 'Group',
      label: 'Call Configuration',
      elements: [
        { type: 'Text', scope: scope('properties.agentName'), label: 'Agent Name' },
        { type: 'Switch', scope: scope('properties.allowCall'), label: 'Allow Incoming Calls' },
      ],
    },
  ],
};
