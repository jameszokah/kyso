'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { TextAreaControlProps } from '../../types/controls';
import { createControlRenderer } from '../../utils/rendering';
import { ControlWrapper } from '../control-wrapper';

function TextAreaControl(props: TextAreaControlProps) {
  const { data, handleChange, path, enabled, uischema } = props;
  const { placeholder, minRows } = uischema;

  const [inputValue, setInputValue] = useState<string>(data || '');

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value);
  }

  function onBlur() {
    handleChange(path, inputValue);
  }

  useEffect(() => {
    setInputValue(data || '');
  }, [data]);

  return (
    <ControlWrapper {...props}>
      <Textarea
        disabled={!enabled}
        value={inputValue}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className="text-sm min-h-[calc(1.5rem*var(--rows,2))] resize-y"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={minRows ? { ['--rows' as any]: minRows } : undefined}
      />
    </ControlWrapper>
  );
}

export const textAreaControlRenderer = createControlRenderer('TextArea', TextAreaControl);
