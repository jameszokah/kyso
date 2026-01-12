import { SelectControlProps } from '../../types/controls';
import { createControlRenderer } from '../../utils/rendering';
import { ControlWrapper } from '../control-wrapper';
import { PrimitiveFieldSchema } from '@kyso/types/node-schema';
import { Icon } from '@kyso/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SelectControl(props: SelectControlProps) {
  const { data, handleChange, path, enabled, schema } = props;

  const options = (schema as PrimitiveFieldSchema).options ?? [];

  function onChange(value: string) {
    handleChange(path, value);
  };

  return (
    <ControlWrapper {...props}>
      <Select
        disabled={!enabled}
        onValueChange={onChange}
        value={data ?? ''}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={schema.placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option, index) => {
            if (option.type === 'separator') {
              return (
                <div
                  key={`sep-${index}`}
                  className="my-1 border-t border-muted"
                />
              );
            }

            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <Icon name={option.icon} size="small" />
                  )}
                  <span>{option.label ?? option.value}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </ControlWrapper>
  );
}

export const selectControlRenderer = createControlRenderer('Select', SelectControl);
