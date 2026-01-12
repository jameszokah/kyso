'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDock } from './dock';

interface MenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  showChevron?: boolean;
}

export function Menu({ trigger, children, align = 'left', showChevron = true }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer inline-flex items-center"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        {showChevron && (
          <ChevronDown className="ml-2 -mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-9 focus:outline-none z-50`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export function MenuItem({ children, onClick, disabled = false, icon, isActive = false }: MenuItemProps) {
  return (
    <button
      className={`relative block w-full h-16 text-center group
        ${disabled ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300'}
        ${isActive ? 'bg-white/10' : ''}
      `}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center justify-center h-full mt-[5%]">
        {icon && <span className="h-6 w-6 transition-all duration-200 group-hover:[&_svg]:stroke-[2.5]">{icon}</span>}
        {children}
      </span>
    </button>
  );
}

export function MenuContainer({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  const { setIsMenuOpen } = useDock();


  const handleToggle: () => void = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
    setIsMenuOpen?.(isExpanded);
  };

  const handleClose: () => void = () => { 
    setIsExpanded(false);
    // setIsMenuOpen?.(false);
  }

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className="relative w-[42px] h-full" data-expanded={isExpanded} ref={containerRef}>
      {/* Container for all items */}
      <div className="relative">
        {/* First item - always visible */}
        <div
          className="relative flex justify-center items-center text-center w-10 h-10 bg-gray-200 dark:bg-gray-800 cursor-pointer rounded-full group will-change-transform z-50"
          onClick={handleToggle}
        >
          {childrenArray[0]}
        </div>

        {/* Other items */}
        {childrenArray.slice(1).map((child, index) => {
          // Inject onClick handler if the child is a valid React element
          if (!React.isValidElement(child)) return child;

          const item = React.cloneElement(child as React.ReactElement<any>, {
            onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
              // Call the child’s existing onClick if defined
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if ((child.props as any).onClick) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (child.props as any).onClick(event);
              }
              handleClose();
            },
          });

          return (
            <div
              key={index}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 flex justify-center items-center bg-gray-200 dark:bg-gray-800 will-change-transform z-60"
              style={{
                transform: `translateY(${isExpanded ? -(index + 1) * 48 : 0}px)`,
                opacity: isExpanded ? 1 : 0,
                zIndex: 40 - index,
                clipPath: index === childrenArray.length - 2 ? 'circle(50% at 50% 50%)' : 'circle(50% at 50% 55%)',
                transition: `transform ${isExpanded ? '300ms' : '300ms'} cubic-bezier(0.4, 0, 0.2, 1),
                         opacity ${isExpanded ? '300ms' : '350ms'}`,
                backfaceVisibility: 'hidden',
                perspective: 1000,
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
