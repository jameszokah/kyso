import { UISchema } from '@/features/json-form/types/uischema';
import { getScope } from '@/features/json-form/utils/get-scope';
import { EndNodeSchema } from './schema';

const scope = getScope<EndNodeSchema>;

export const uischema: UISchema = {
  type: 'VerticalLayout',
  elements: [{ type: 'Text', scope: scope('properties.label'), label: 'Title', placeholder: 'End' }],
};
