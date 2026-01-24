import { Label } from '../label/label';
import type { PropsWithChildren } from 'react';

type Props = {
  label: string;
  className?: string;
  required?: boolean;
};

export function FormControlWithLabel({ label, className, required, children }: PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label label={label} className={className} required={required} />
      {children}
    </div>
  );
}
