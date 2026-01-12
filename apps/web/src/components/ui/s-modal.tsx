'use client';

/**
 * Sidebar modal variant with navigation sidebar and main content area.
 *
 * @example
 * ```tsx
 * <SModal open={open} onOpenChange={setOpen}>
 *   <SModalContent>
 *     <SModalSidebar>
 *       <SModalSidebarHeader>Settings</SModalSidebarHeader>
 *       <SModalSidebarSection>
 *         <SModalSidebarSectionTitle>Account</SModalSidebarSectionTitle>
 *         <SModalSidebarItem icon={<User />} active>Profile</SModalSidebarItem>
 *         <SModalSidebarItem icon={<Key />}>Security</SModalSidebarItem>
 *       </SModalSidebarSection>
 *     </SModalSidebar>
 *     <SModalMain>
 *       <SModalMainHeader>Profile</SModalMainHeader>
 *       <SModalMainBody>Content here</SModalMainBody>
 *     </SModalMain>
 *   </SModalContent>
 * </SModal>
 * ```
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

const ANIMATION_CLASSES =
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in';

const CONTENT_ANIMATION_CLASSES =
  'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[50%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[50%]';

/**
 * Root sidebar modal component.
 */
function SModal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

/**
 * Trigger element that opens the modal.
 */
const SModalTrigger = DialogPrimitive.Trigger;

/**
 * Close element that closes the modal.
 */
const SModalClose = DialogPrimitive.Close;

/**
 * Modal overlay.
 */
const SModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-[499] bg-black/40 backdrop-blur-sm', ANIMATION_CLASSES, className)}
    {...props}
  />
));
SModalOverlay.displayName = 'SModalOverlay';

/**
 * Modal content with horizontal flex layout.
 */
const SModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const [isInteractionReady, setIsInteractionReady] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInteractionReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DialogPrimitive.Portal>
      <SModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          ANIMATION_CLASSES,
          CONTENT_ANIMATION_CLASSES,
          'fixed top-[50%] left-[50%] z-[500] flex h-[min(70vh,720px)] max-h-[800px] min-h-[520px] w-[min(60vw,900px)] min-w-[680px] max-w-[1000px] translate-x-[-50%] translate-y-[-50%] flex-row rounded-lg border bg-background shadow-lg duration-200',
          className,
        )}
        onEscapeKeyDown={(e) => {
          if (!isInteractionReady) {
            e.preventDefault();
            return;
          }
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
        }}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
SModalContent.displayName = 'SModalContent';

/**
 * Sidebar container.
 */
const SModalSidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex w-[180px] flex-col py-3', className)} {...props} />
  ),
);
SModalSidebar.displayName = 'SModalSidebar';

/**
 * Sidebar header with title.
 */
const SModalSidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4 px-3 font-medium text-base text-foreground', className)} {...props} />
  ),
);
SModalSidebarHeader.displayName = 'SModalSidebarHeader';

/**
 * Sidebar section container. Groups related items.
 */
const SModalSidebarSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 px-3 [&+&]:mt-3', className)} {...props} />
  ),
);
SModalSidebarSection.displayName = 'SModalSidebarSection';

/**
 * Sidebar section title.
 */
const SModalSidebarSectionTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-1 font-medium text-xs text-muted-foreground', className)} {...props} />
  ),
);
SModalSidebarSectionTitle.displayName = 'SModalSidebarSectionTitle';

export interface SModalSidebarItemProps extends React.ComponentPropsWithoutRef<typeof Button> {
  /** Whether the item is currently active/selected */
  active?: boolean;
  /** Icon element to display */
  icon?: React.ReactNode;
}

/**
 * Sidebar item with icon and text. Uses Button component with ghost variant.
 */
function SModalSidebarItem({ className, active, icon, children, ...props }: SModalSidebarItemProps) {
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      className={cn(
        'w-full justify-start gap-2 rounded-md text-sm',
        !active && 'text-muted-foreground hover:bg-accent hover:text-foreground',
        className,
      )}
      {...props}
    >
      {icon && <span className="h-4 w-4 flex-shrink-0 [&>svg]:h-full [&>svg]:w-full">{icon}</span>}
      {children}
    </Button>
  );
}

/**
 * Main content container.
 */
const SModalMain = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 flex-col gap-4 rounded-lg border-l bg-muted/30 p-4', className)}
      {...props}
    />
  ),
);
SModalMain.displayName = 'SModalMain';

/**
 * Main header with title and close button.
 */
const SModalMainHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between', className)} {...props}>
      <span className="font-medium text-sm text-muted-foreground">{children}</span>
      <DialogPrimitive.Close asChild>
        <Button variant="ghost" size="icon-sm" className="h-6 w-6">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogPrimitive.Close>
    </div>
  ),
);
SModalMainHeader.displayName = 'SModalMainHeader';

/**
 * Main body content area.
 */
const SModalMainBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('min-w-0 flex-1 overflow-y-auto', className)} {...props} />
  ),
);
SModalMainBody.displayName = 'SModalMainBody';

export {
  SModal,
  SModalTrigger,
  SModalClose,
  SModalContent,
  SModalOverlay,
  SModalSidebar,
  SModalSidebarHeader,
  SModalSidebarSection,
  SModalSidebarSectionTitle,
  SModalSidebarItem,
  SModalMain,
  SModalMainHeader,
  SModalMainBody,
};
