'use client';

import { LayoutWrapper } from '../layout-wrapper';
import { GroupLayoutElement, LayoutProps } from '../../types/layouts';
import { renderElements } from '../render-elements';
import { createLayoutRenderer } from '../../utils/rendering';
import { cn } from '@/lib/utils';

function GroupLayout(props: LayoutProps<GroupLayoutElement>) {
  const { uischema } = props;

  return (
    <LayoutWrapper {...props}>
      <div className="flex flex-col py-2 gap-3">
        {uischema.label && <h1 className={cn('py-2 font-medium')}>{uischema.label}</h1>}
        {renderElements(props)}
      </div>
    </LayoutWrapper>
  );
}

export const groupLayoutRenderer = createLayoutRenderer('Group', GroupLayout);
