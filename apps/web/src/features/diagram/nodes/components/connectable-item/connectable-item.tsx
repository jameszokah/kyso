import { Handle, HandleType, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { getHandleId } from '@/features/diagram/handles/get-handle-id';
import useStore from '@/store/store';

type Props = {
  nodeId: string;
  innerId: string;
  handleType: HandleType;
  label: string;
};

export function ConnectableItem({ label, nodeId, innerId, handleType }: Props) {
  const layoutDirection = useStore(({ layoutDirection }) => layoutDirection);
  const isVertical = layoutDirection === 'DOWN';
  const position = isVertical ? Position.Bottom : Position.Right;

  const handleId = getHandleId({ nodeId, innerId, handleType });

  return (
    <div
      className={cn(
        'relative flex justify-between bg-secondary',
        'px-3 py-2',
        'border border-input',
        'rounded-md',
        'font-normal',
      )}
    >
      {label}

      <div className={cn('relative', { 'absolute bottom-0 left-1/2 -translate-x-1/2': isVertical })}>
        <Handle id={handleId} position={position} type="source" />
      </div>
    </div>
  );
}
