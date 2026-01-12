'use client';

import { type ReactNode } from 'react';
import { useSaveDiagramOnClose } from '@/hooks/use-save-diagram-on-close';
import { useCommandHandler } from '@/hooks/use-command-handler';
import { useCommandHandlerKeyboard } from '@/hooks/use-command-handler-keyboard';
import useStore from '@/store/store';
import { useAutoload } from '../../hooks/use-autoload';

export function DiagramWrapper({ children }: { children: ReactNode }) {
  useAutoload();

  const isReadOnlyMode = useStore((store) => store.isReadOnlyMode);
  const commandHandler = useCommandHandler(isReadOnlyMode);
  useCommandHandlerKeyboard(commandHandler);
  useSaveDiagramOnClose();

  return <div className="absolute inset-0">{children}</div>;
}
