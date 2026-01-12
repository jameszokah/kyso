import { cn } from '@/lib/utils';

import { PropsWithChildren } from 'react';

type Props = {
  className?: string;
};

export function IconPlaceholder({ className, children }: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        'flex justify-center items-center rounded-md outline outline-dashed outline-[var(--ax-ui-stroke-secondary-default)] p-[0.4375rem]',
        className,
      )}
    >
      {children}
    </div>
  );
}
