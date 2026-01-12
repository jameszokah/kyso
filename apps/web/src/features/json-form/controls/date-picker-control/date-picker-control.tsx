'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-test/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { DatePickerControlProps } from '../../types/controls';
import { ControlWrapper } from '../control-wrapper';
import { createControlRenderer } from '../../utils/rendering';

function DatePickerControl(props: DatePickerControlProps) {
  const { data, handleChange, path, enabled } = props;

  const initialDate = data ? new Date(data) : undefined;
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const onSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    handleChange(path, selectedDate ? selectedDate.toISOString() : null);
  };

  return (
    <ControlWrapper {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={!enabled}
            className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus disabled={!enabled} />
        </PopoverContent>
      </Popover>
    </ControlWrapper>
  );
}

export const datePickerControlRenderer = createControlRenderer('DatePicker', DatePickerControl);
