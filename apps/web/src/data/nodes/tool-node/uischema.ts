import { UISchema } from '@/features/json-form/types/uischema';
import { getScope } from '@/features/json-form/utils/get-scope';
import { ToolNodeSchema } from './schema';

const scope = getScope<ToolNodeSchema>;

export const uischema: UISchema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Text', scope: scope('properties.label'), label: 'Title', placeholder: 'Tool' },
    {
      type: 'Group',
      label: 'Tool Configuration',
      elements: [
        {
          type: 'Text',
          scope: scope('properties.toolDescription'),
          label: 'Tool Description',
          placeholder: 'Enter tool description',
        },
        { type: 'Select', scope: scope('properties.toolType'), label: 'Type' },

        // Reverting to simple Text for now as specific visibility logic might vary
        {
          type: 'Text',
          scope: scope('properties.transferTo'),
          label: 'Transfer To',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: scope('properties.toolType'),
              schema: {
                const: 'transfer',
              },
              failWhenUndefined: true,
            },
          },
        },
        {
        type: 'VerticalLayout',
        elements: [{ type: 'AiTools', scope: scope('properties.functionConfig') }],
          rule: {
            effect: 'SHOW',
            condition: {
              scope: scope('properties.toolType'),
              schema: {
                const: 'function',
                
              },
              failWhenUndefined: true,
            },
          },
        },
      ],
    },
  ],
};
