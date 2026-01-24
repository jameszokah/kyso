'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Cards, CaretDown } from '@phosphor-icons/react';
import useStore from '@/store/store';
import { useI18n } from '@/locales/client';

interface ProjectSelectionProps {
  documentName: string;
  onDuplicateClick?: () => void;
  isReadOnlyMode: boolean;
}

export function ProjectSelection({ documentName, onDuplicateClick, isReadOnlyMode }: ProjectSelectionProps) {
  const setDocumentName = useStore((state) => state.setDocumentName);
  const [editName, setEditName] = useState<boolean>(false);
  const t = useI18n();


  const items = useMemo(
    () =>
      onDuplicateClick
        ? [
            {
              label: t('header.projectSelection.duplicateToDrafts'),
              icon: <Cards weight="thin" />,
              onClick: onDuplicateClick,
            },
          ]
        : [],
    [onDuplicateClick, t],
  );

  return (
    <header className="flex justify-between items-center">
      <div
        // center the project selection in the app bar; hidden on small screens like original CSS
        className="absolute left-1/2 top-7 transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 w-[calc(100%-40%)] rounded-md mx-4 pointer-events-auto"
        // allow clicks to focus / edit without interfering with parent handlers
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className="text-sm text-muted-foreground whitespace-nowrap">{t('header.folderName')} /</span>

        {editName && !isReadOnlyMode ? (
          <Input
            value={documentName}
            onChange={(event) => {
              if (event.target.value.length > 128) return;
              setDocumentName(event.target.value);
            }}
            onBlur={() => setEditName(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                (event.currentTarget as HTMLInputElement).blur();
              }
            }}
            autoFocus
            className="min-w-[200px] max-w-[420px] text-sm"
          />
        ) : (
          <button
            type="button"
            onClick={() => !isReadOnlyMode && setEditName(true)}
            className="text-sm font-medium text-foreground truncate max-w-[320px] text-left"
            title={documentName}
          >
            {documentName || t('header.folderName')}
          </button>
        )}

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('tooltips.pickTheProject') as string}
                className="h-8 w-8"
              >
                <CaretDown weight="thin" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={6} className="min-w-[200px]">
              {items.map((it, index) => (
                <DropdownMenuItem
                  key={`${it.label}-${index}`}
                  onSelect={(event) => {
                    event.preventDefault();
                    it.onClick();
                  }}
                  className="flex items-center gap-2"
                >
                  {it.icon}
                  <span>{it.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="absolute right-4 top-7 transform -translate-y-1/2 pointer-events-auto">
        <Button variant="ghost" aria-label="Close project selection" onClick={() => setEditName(false)}>
          Preview
        </Button>
      </div>
    </header>
  );
}
