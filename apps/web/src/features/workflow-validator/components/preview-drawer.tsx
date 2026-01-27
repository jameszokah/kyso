'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { ValidationResult } from '../workflow-logic';
import type { WorkflowConfig } from '@/utils/state-machine-types';
import { CheckCircle, XCircle, Copy } from '@phosphor-icons/react';
import { useState } from 'react';
import { ApplyThemeScript } from '@/components/voice-ui/theme-toggle';
import WelcomeDynamic from '@/components/voice-ui/welcome-dynamic';
import { APP_CONFIG_DEFAULTS } from '@/app/app-config';
import EmbedPopupAgentClient from '@/components/voice-ui/embed-popup/agent-client';

interface PreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: ValidationResult | null;
  config: WorkflowConfig | null;
}

export function PreviewDrawer({
  isOpen,
  onClose,
  validationResult,
  config,
}: PreviewDrawerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (config) {
      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="top" className="max-h-[80vh] w-[calc(100%-4rem)] justify-center left-1/2 -translate-x-1/2 overflow-y-auto rounded-b-3xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Workflow Preview
            {validationResult?.isValid ? (
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="mr-1" /> Valid
              </span>
            ) : (
              <span className="flex items-center text-sm font-medium text-destructive bg-red-50 px-2 py-1 rounded-full">
                <XCircle className="mr-1" /> Invalid
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        

        <div className="flex-1 overflow-y-auto py-4 px-4">
          {!validationResult?.isValid && validationResult?.errors && (
            <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 rounded-md">
              <h4 className="font-semibold text-destructive mb-2">Validation Errors</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-destructive-foreground">
                {validationResult.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResult?.isValid && (
            <div className="bg-background">
              <EmbedPopupAgentClient appConfig={APP_CONFIG_DEFAULTS} />
            </div>
          )}
            

          {/* <div className="bg-background">
            <ApplyThemeScript />
            <WelcomeDynamic />
          </div> */}

          {config && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">Generated Configuration</h4>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1">
                  <Copy />
                  {copied ? 'Copied!' : 'Copy JSON'}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-mono border max-h-[300px] overflow-y-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          )}
        </div>

      

        <SheetFooter>
          <Button onClick={onClose}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
