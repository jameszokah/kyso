import { Switch } from '@/components/ui/switch';
import { SwitchControlProps } from '../../types/controls';
import { createControlRenderer } from '../../utils/rendering';
import { ControlWrapper } from '../control-wrapper';

function SwitchControl(props: SwitchControlProps) {
  const { data, handleChange, path, enabled } = props;

  function onCheckedChange(checked: boolean) {
    handleChange(path, checked);
  }

  return (
    <ControlWrapper {...props}>
      <div className="flex items-center space-x-2">
        <Switch disabled={!enabled} checked={data ?? false} onCheckedChange={onCheckedChange} />
      </div>
    </ControlWrapper>
  );
}

export const switchControlRenderer = createControlRenderer('Switch', SwitchControl);
