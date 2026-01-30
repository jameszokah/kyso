'use client';

import { type ReactNode } from 'react';
import { useSaveDiagramOnClose } from '@/hooks/use-save-diagram-on-close';
import { useCommandHandler } from '@/hooks/use-command-handler';
import { useCommandHandlerKeyboard } from '@/hooks/use-command-handler-keyboard';
import useStore from '@/store/store';
import { useAutoload } from '../../hooks/use-autoload';

import type { DiagramModel } from '@kyso/types/common';

export function DiagramWrapper({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: DiagramModel | null;
}) {
  useAutoload(initialData);

  const isReadOnlyMode = useStore((store) => store.isReadOnlyMode);
  const commandHandler = useCommandHandler(isReadOnlyMode);
  useCommandHandlerKeyboard(commandHandler);
  
  // Only auto-save to local storage if we didn't load from initialData (server)
  // or if we decide to implement separate local keys per workflow later.
  useSaveDiagramOnClose();

  return <div className="absolute inset-0">{children}</div>;
}
