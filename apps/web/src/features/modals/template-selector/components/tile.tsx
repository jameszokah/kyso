'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@kyso/icons';
import type { IconType } from '@kyso/types/common';

type TileProps = {
  icon: IconType;
  title: string;
  subTitle?: string;
  outlined?: boolean;
  onClick: () => void;
};

export function Tile({ icon, title, subTitle, outlined, onClick }: TileProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Layout
        'flex flex-col items-start gap-4 p-4 rounded-2xl transition-all duration-300',
        // Theming
        outlined ? 'bg-transparent border border-border' : 'bg-muted border border-transparent',
        // Hover states
        'hover:border-primary hover:cursor-pointer hover:text-primary',
        // Smooth transitions
        'transition-[border-color,color] ease-in-out',
        // Width (you can customize as needed)
        'w-full sm:w-40',
      )}
    >
      {/* Icon */}
      <Icon
        name={icon}
        size="large"
        className="text-foreground group-hover:text-primary transition-colors duration-300"
      />

      {/* Description */}
      <div className="flex flex-col items-start gap-1 w-full">
        <span className="text-base font-medium text-foreground">{title}</span>
        {subTitle && <span className="text-sm text-muted-foreground">{subTitle}</span>}
      </div>
    </div>
  );
}
