'use client';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  isExpanded: boolean;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
};

export function Sidebar({ isExpanded, children, className, header, footer, contentClassName, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        // Layout
        'relative flex flex-col items-center justify-between border rounded-xl',
        // Theming
        'bg-background text-foreground border-border shadow-sm',
        // Interactions + transitions
        'pointer-events-auto transition-all duration-300 ease-in-out',
        // Spacing
        'py-4 gap-4',
        // Expanded vs collapsed
        isExpanded ? 'h-full w-64' : 'h-min w-auto',
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div className="w-full flex flex-col gap-4 px-4">{header}</div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          <Separator className="my-2" />
          <div className={cn('flex-1 flex flex-col w-full overflow-y-auto overflow-x-hidden px-4', contentClassName)}>
            {children}
          </div>
          <Separator className="my-2" />
          <div className="w-full flex flex-col px-4">{footer}</div>
        </>
      )}
    </div>
  );
}
