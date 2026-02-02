import type { PropsWithChildren } from 'react';
import { PlusCircle } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';
import { NodeInfoWrapper } from '../node-info-wrapper/node-wrapper-info';
import { IconPlaceholder } from '../icon-placeholder/icon-placeholder';

export function ToolInfo({ children, }: PropsWithChildren) {
  return (
    <NodeInfoWrapper label="Voice Agent Tools">
      {/* Tools list */}
      <div
        className={cn(
          'flex flex-col gap-1',
          // equivalent to :empty { display: none }
          {'hidden': !children},
        )}
      >
        {children}
      </div>

      {/* Add tool */}
      <div className="flex items-center gap-3">
        <IconPlaceholder className={cn('w-full', 'p-1.5', 'flex items-center gap-2')}>
          <PlusCircle size={16} />
          <span>Add Tool</span>
        </IconPlaceholder>
      </div>
    </NodeInfoWrapper>
  );
}
