import { useChangeLocale, useCurrentLocale } from '@/locales/client';
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
  code: 'en' | 'es';
  label: string;
}

const languages: Language[] = [
  { code: 'en', label: '🇬🇧' },
  { code: 'es', label: '🇪🇸' },
];

export function LanguageSelector() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  
  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];


  return (
    <>
      <span className={styles['title']}>{currentLanguage.label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Change Language">
            <CaretDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map(({ code, label }) => (
            <DropdownMenuItem key={code} onClick={() => changeLocale(code)}>
              {label}
            </DropdownMenuItem>
          ))}

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
