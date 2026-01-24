'use client';

import styles from './app-bar.module.css';
// import { useTranslation } from 'react-i18next'; // Removing old import
import { useI18n } from '@/locales/client';
import { Archive, DownloadSimple, Export, Image } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { LanguageSelector } from '../translation/language-selector';

interface ControlsProps {
  layoutVertical: boolean;
  onLayoutChange: (isVertical: boolean) => void;
  onToggleReadOnly: (value: boolean) => void;
  onExport: () => void;
  onImport: () => void;
  onSaveAsImage: () => void;
  onArchive: () => void;
  isReadOnlyMode: boolean;
  isDarkMode: boolean;
  onThemeChange: (isDarkMode: boolean) => void;
}

export function Controls({ onExport, onImport, onSaveAsImage, onArchive }: ControlsProps) {
  const t = useI18n();


  const items = useMemo(
    () => [
      {
        label: t('header.controls.export'),
        icon: <Export />,
        onClick: onExport,
      },
      {
        label: t('header.controls.import'),
        icon: <DownloadSimple />,
        onClick: onImport,
      },
      {
        label: t('header.controls.saveAsImage'),
        icon: <Image />,
        onClick: onSaveAsImage,
      },
      {
        type: 'separator',
      },
      {
        label: t('header.controls.archive'),
        icon: <Archive />,
        destructive: true,
        onClick: onArchive,
      },
    ],
    [onArchive, onExport, onImport, onSaveAsImage, t],
  );

  return (
    <div className={styles['controls']}>
      {/* This control is added temporarily for testing purposes. Its final position will be determined later. */}
      <LanguageSelector />
    </div>
  );
}
