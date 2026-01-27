import { Button } from '@/components/ui/button';
import { forwardRef } from 'react';

type WelcomeViewProps = {
  disabled: boolean;
  onStartCall: () => void;
};

export const WelcomeView = forwardRef<HTMLDivElement, WelcomeViewProps>(({
  disabled,
  onStartCall,
}: WelcomeViewProps, ref) => {
  return (
    <div ref={ref} inert={disabled} className="absolute inset-0">
      <div className="flex h-full items-center justify-between gap-4 px-3">
        <div className="pl-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kyso-logo.png" alt="Kyso Logo" className="block size-6 dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kyso-logo-dark.png" alt="Kyso Logo" className="hidden size-6 dark:block" />
        </div>

        <Button variant="default" size="lg" onClick={onStartCall} className="w-48 font-mono">
          Chat with Agent
        </Button>
      </div>
    </div>
  );
});
