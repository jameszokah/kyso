import {
  ControlProps,
  isControl,
  isLayout,
  JsonFormsRendererRegistryEntry,
  LayoutProps,
  or,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

function UnknownRenderer({ uischema: { type } }: ControlProps | LayoutProps) {
  return (
    <div className="font-normal text-red-500">
      No renderer provided for type: {type}
    </div>
  );
}

const UnknownRendererTester = rankWith(0, or(isControl, isLayout));

export const unknownRenderer: JsonFormsRendererRegistryEntry = {
  tester: UnknownRendererTester,
  renderer: withJsonFormsControlProps(UnknownRenderer),
};
