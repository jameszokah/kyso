"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { ReactFlowProvider } from '@xyflow/react';
import { ZoomProvider } from '@/providers/zoom-provider';
import { UndoRedoProvider } from '@/providers/undo-redo-provider';
import { MousePositionProvider } from '@/providers/mouse-position-provider';
import { ModalProvider } from '@/features/modals/modal-provider';


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ReactFlowProvider>
            <ZoomProvider>
              <UndoRedoProvider>
                <MousePositionProvider>
                  <ModalProvider>   
                      {children}
                      <Toaster richColors />
                  </ModalProvider>
                </MousePositionProvider>
              </UndoRedoProvider>
            </ZoomProvider>
      </ReactFlowProvider>
    </ThemeProvider>
  );
}
