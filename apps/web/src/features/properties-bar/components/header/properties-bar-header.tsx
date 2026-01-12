'use client';

import { Button } from '@/components/ui-test/button';
import { cn } from '@/lib/utils';
import { Icon } from '@kyso/icons';

type Props = {
  header: string;
  name: string;
  isExpanded: boolean;
  onDotsClick?: () => void;
};

export function PropertiesBarHeader({ isExpanded, header, name, onDotsClick }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 px-2">
      <div className="flex flex-col flex-grow">
        <span
          className={cn(
            'font-semibold leading-none tracking-tight',
            name ? 'text-sm text-muted-foreground' : 'text-base text-foreground',
          )}
        >
          {header}
        </span>
        {isExpanded && name && <p className="text-sm font-medium text-foreground/80 truncate">{name}</p>}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={onDotsClick}
      >
        <Icon name="DotsThreeVerticalThin" />
      </Button>
    </div>
  );
}
