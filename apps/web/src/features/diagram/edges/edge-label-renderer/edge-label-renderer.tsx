import { EdgeLabelRenderer } from '@xyflow/react';
import { cn } from '@/lib/utils';

type EdgeLabelProps = {
  id: string;
  labelX: number;
  labelY: number;
  content: React.ReactNode;
  hovered: boolean;
  selected?: boolean;
  icon?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export function EdgeLabel({
  id,
  labelX,
  labelY,
  content,
  hovered,
  selected,
  onMouseEnter,
  onMouseLeave,
}: EdgeLabelProps) {
  return (
    <EdgeLabelRenderer>
      <div
        data-labeledgeid={id}
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          pointerEvents: 'all',
        }}
        className={cn(
          'bg-white border rounded px-2 py-1 text-xs shadow-sm transition-colors',
          hovered && 'border-primary',
          selected ? 'border-primary ring-1 ring-primary' : 'border-border',
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {content}
      </div>
    </EdgeLabelRenderer>
  );
}
