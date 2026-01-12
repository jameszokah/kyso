import { createContext, useState, type ReactNode, useMemo, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type OpenModalProps = {
  content: ReactNode;
  icon?: ReactNode;
  title: string;
  footer?: ReactNode;
  isCloseButtonVisible?: boolean;
  footerVariant?: 'integrated' | 'separated'; // Keeping type for compatibility but might not use it
  onModalClosed?: () => void;
};

type ModalContextType = {
  openModal: (props: OpenModalProps) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dataRef = useRef<OpenModalProps | null>(null);

  const openModal = useCallback(
    ({ isCloseButtonVisible = true, footerVariant = 'integrated', ...restProps }: OpenModalProps) => {
      dataRef.current = { ...restProps, isCloseButtonVisible, footerVariant };
      setIsOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Use setTimeout to allow animation to finish before clearing data or calling callback?
    // Or just call callback immediately.
    dataRef.current?.onModalClosed?.();
  }, []);

  const value = useMemo(() => ({ openModal, closeModal }), [closeModal, openModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        {dataRef.current && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {dataRef.current.icon}
                {dataRef.current.title}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">{dataRef.current.content}</div>
            {dataRef.current.footer && <DialogFooter>{dataRef.current.footer}</DialogFooter>}
          </DialogContent>
        )}
      </Dialog>
    </ModalContext.Provider>
  );
}
