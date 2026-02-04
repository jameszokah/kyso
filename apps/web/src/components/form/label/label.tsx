import { Label as ShadcnLabel } from '@/components/ui/label';
import { Asterisk } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export type LabelProps = {
  label: string;
  required?: boolean;
  className?: string;
};

export function Label({ label, required, className }: LabelProps) {
  return (
    <div className={cn('flex items-center gap-1 mb-1', className)}>
      {required && (
        <span className="text-destructive flex items-center">
          <Asterisk size={12} />
        </span>
      )}
      <ShadcnLabel>{label}</ShadcnLabel>
    </div>
  );
}
