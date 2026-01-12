'use client';

import { LayoutWrapper } from '../layout-wrapper';
import { HorizontalLayoutElement, LayoutProps } from '../../types/layouts';
import { renderElements } from '../render-elements';
import { createLayoutRenderer } from '../../utils/rendering';
import { CSSProperties, useMemo } from 'react';
import { useHasChildError } from './use-has-child-error';
import { cn } from '@/lib/utils';

function HorizontalLayout(props: LayoutProps<HorizontalLayoutElement>) {
  const hasErrors = useHasChildError(props.uischema.elements);
  const { uischema } = props;
  const { layoutColumns } = uischema;

  // Apply dynamic inline style for grid auto columns if provided
  const style: CSSProperties = useMemo(
    () => (layoutColumns ? { gridAutoColumns: layoutColumns } : {}),
    [layoutColumns],
  );

  return (
    <LayoutWrapper hasErrors={hasErrors} {...props}>
      <div
        style={style}
        className={cn('grid grid-flow-col auto-cols-[1fr] gap-2', '[&>*:last-child]:justify-self-end')}
      >
        {renderElements(props)}
      </div>
    </LayoutWrapper>
  );
}

export const horizontalLayoutRenderer = createLayoutRenderer('HorizontalLayout', HorizontalLayout);
