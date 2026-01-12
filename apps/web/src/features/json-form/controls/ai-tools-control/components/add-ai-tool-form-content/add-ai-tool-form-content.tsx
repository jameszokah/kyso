'use client';

import { useCallback, useState } from 'react';
import { AiAgentTool } from '../../../../types/controls';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import { Input } from '@/components/ui-test/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toolOptions } from '../../../../../../data/nodes/ai-agent/select-options';
import { Icon } from '@kyso/icons';

export const FORM_TOOLS_NAME = 'ai-tools-form';

type ContentProps = {
  onSubmit: (data: AiAgentTool) => void;
  data?: AiAgentTool | undefined;
};

export function AddAiToolFormContent({ onSubmit, data }: ContentProps) {
  const [formData, setFormData] = useState<AiAgentTool>(() => ({
    id: data?.id ?? '',
    tool: data?.tool ?? '',
    description: data?.description ?? '',
    apiKey: data?.apiKey ?? '',
  }));

  function updateFormField<K extends keyof AiAgentTool>(key: K, value: AiAgentTool[K]) {
    setFormData((previous) => ({ ...previous, [key]: value }));
  }

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit],
  );

  return (
    <form id={FORM_TOOLS_NAME} className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
      {/* Select Tool */}
      <FormControlWithLabel label="Select Tool">
        <Select value={formData.tool} onValueChange={(value: string) => updateFormField('tool', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Tool..." />
          </SelectTrigger>
          <SelectContent className="max-h-[220px] overflow-y-auto" >
            {Object.entries(toolOptions).map(([key, option]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  {option.icon && <Icon name={option.icon} size="small" />}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControlWithLabel>

      {/* Description */}
      <FormControlWithLabel label="Tool Description">
        <Textarea
          placeholder="Type your description here..."
          value={formData.description}
          onChange={(event) => updateFormField('description', event.target.value)}
          className="min-h-[120px]"
        />
      </FormControlWithLabel>

      {/* API Key */}
      <FormControlWithLabel label="API/Access Key">
        <Input
          placeholder="Enter API key..."
          value={formData.apiKey}
          onChange={(event) => updateFormField('apiKey', event.target.value)}
        />
      </FormControlWithLabel>
    </form>
  );
}
