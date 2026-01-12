import { Label } from '../label/label';
import { PropsWithChildren } from 'react';

type Props = {
  label: string;
  required?: boolean;
};

export function FormControlWithLabel({ label, required, children }: PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label label={label} required={required} />
      {children}
    </div>
  );
}
