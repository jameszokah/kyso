"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { ReactFlowProvider } from '@xyflow/react';
import { ZoomProvider } from '@/providers/zoom-provider';
import { UndoRedoProvider } from '@/providers/undo-redo-provider';
import { MousePositionProvider } from '@/providers/mouse-position-provider';
import { ModalProvider } from '@/features/modals/modal-provider';
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/utils/orpc";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ReactFlowProvider>
            <ZoomProvider>
              <UndoRedoProvider>
                <MousePositionProvider>
                  <ModalProvider>   
                      <QueryClientProvider client={queryClient}>
                        {children}
                        <ReactQueryDevtools />
                      </QueryClientProvider>
                      <Toaster richColors />
                  </ModalProvider>
                </MousePositionProvider>
              </UndoRedoProvider>
            </ZoomProvider>
      </ReactFlowProvider>
    </ThemeProvider>
  );
}
