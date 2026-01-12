import { useTranslation } from 'react-i18next';
import { CaretDown } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import styles from '../app-bar/app-bar.module.css';

interface Language {
  code: string;
  label: string;
}

const languages: Language[] = [
  { code: 'en', label: '🇬🇧' },
  { code: 'pl', label: '🇵🇱' },
];

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <>
      <span className={styles['title']}>{currentLanguage.label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title={t('tooltips.changeLanguage')}>
            <CaretDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map(({ code, label }) => (
            <DropdownMenuItem key={code} onClick={() => i18n.changeLanguage(code)}>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
