'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'motion/react';
import React, { Children, cloneElement, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};
type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onChange?: (direction: boolean) => void;
  isTogglable: boolean;
  isChecked?: boolean;
  disabled?: boolean;
};
type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};
type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocumentContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
type DockProviderProps = {
  children: React.ReactNode;
  value: DocumentContextType;
};

type ChildProps = {
  width: MotionValue<number>;
  isHovered: MotionValue<number>;
};

const DockContext = createContext<DocumentContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

export function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within an DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const hoverHeight = useSpring(heightRow, spring);

  // final height: if menu open, override hover
  const dockHeight = useMotionValue(panelHeight);

  useEffect(() => {
    if (!isMenuOpen) {
      dockHeight.set(magnification * 4.2);
    } 

    
  }, [isMenuOpen, hoverHeight, magnification, dockHeight]);

  return (
    <motion.div
      style={{
        height: dockHeight,
        scrollbarWidth: 'none',
      }}
      className="pointer-events-none mx-2 flex max-w-full h-full items-end overflow-x-auto"
    >
      <motion.div
        onMouseMove={({ pageX }: React.MouseEvent<HTMLDivElement>) => {
          if (isMenuOpen) isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          if (isMenuOpen) isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          'pointer-events-auto mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50 px-4 dark:bg-neutral-900',
          className,
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring, distance, magnification, setIsMenuOpen }}>{children}</DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, onClick, onChange, isTogglable, isChecked, disabled, ...props }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { distance, magnification, mouseX, spring } = useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (value) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(mouseDistance, [-distance, 0, distance], [40, magnification, 40]);

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        if (isTogglable) {
          onChange?.(!isChecked);
        } else {
          onClick?.(event);
        }
      }}
      className={cn('relative inline-flex items-center justify-center', className, {
        'border-2 border-primary/50': isChecked === false,
        'pointer-events-none opacity-50 select-none': disabled,
      })}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      {...props}
    >
      {Children.map(children, (child) => cloneElement(child as React.ReactElement<ChildProps>,
        { width, 
          "data-hovered": isHovered,
        }
      ))}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['data-hovered'] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white',
            className,
          )}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const width = restProps['width'] as MotionValue<number>;

  const widthTransform = useTransform(width, (value) => value / 2);

  return (
    <motion.div style={{ width: widthTransform }} className={cn('flex items-center justify-center', className)}>
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };