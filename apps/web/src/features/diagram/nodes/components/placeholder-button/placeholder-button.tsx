'use client';

import { Button } from '@/components/ui-test/button';
import { PlusCircleIcon } from '@phosphor-icons/react';

type Props = {
  label: string;
} & Omit<React.ComponentProps<typeof Button>, 'children'>;

export function PlaceholderButton({ label, className, ...props }: Props) {
  return (
    <Button
      variant="secondary"
      className={`flex items-center gap-2 text-sm text-muted-foreground border border-dashed hover:border-muted-foreground/60 ${className ?? ''}`}
      {...props}
    >
      <PlusCircleIcon weight="bold" />
      {label}
    </Button>
  );
}
