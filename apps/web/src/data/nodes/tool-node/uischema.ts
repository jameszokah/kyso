import type { UISchema } from '@/features/json-form/types/uischema';
import { getScope } from '@/features/json-form/utils/get-scope';
import type { ToolNodeSchema } from './schema';

const scope = getScope<ToolNodeSchema>;

export const uischema: UISchema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Text', scope: scope('properties.label'), label: 'Title', placeholder: 'Tool' },
    {
      type: 'Group',
      label: 'Tool Configuration',
      elements: [
        { type: 'SingleAgentTool', scope: scope('properties.tool') },
      ],
    },
  ],
};

