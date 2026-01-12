'use client';

import { Button } from '@/components/ui-test/button';
import { FORM_TOOLS_NAME } from '../add-ai-tool-form-content/add-ai-tool-form-content';

type Props = {
  onCancelClick: () => void;
};

export function AddAiToolFooter({ onCancelClick }: Props) {
  return (
    <div className="flex justify-between w-full gap-3 mt-4">
      <Button variant="secondary" onClick={onCancelClick}>
        Cancel
      </Button>
      <Button variant="default" type="submit" form={FORM_TOOLS_NAME}>
        Confirm
      </Button>
    </div>
  );
}
