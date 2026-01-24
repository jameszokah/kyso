import { toast } from 'sonner';
// import i18n from 'i18next';
// import { DefaultTranslationMap } from '@/i18n/i18next';

const SNACKBAR_PREFIX = `snackbar` as const;
// type SnackbarKey = keyof DefaultTranslationMap[typeof SNACKBAR_PREFIX];

type ShowSnackbarProps = {
  title: any;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error';
  subtitle?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  close?: boolean;
  autoHideDuration?: number;
  preventDuplicate?: boolean;
};

export function showSnackbar({ title, variant = 'default', subtitle, buttonLabel, onButtonClick }: ShowSnackbarProps) {
  // TODO: Refactor to use hook or context, for now we pass key
  // const message = i18n.t(`${SNACKBAR_PREFIX}.${title}`);
  const message = title; // Temporarily just use title or need refactor


  const options = {
    description: subtitle,
    action:
      buttonLabel && onButtonClick
        ? {
            label: buttonLabel,
            onClick: onButtonClick,
          }
        : undefined,
  };

  switch (variant) {
    case 'destructive':
    case 'error': {
      toast.error(message, options);
      break;
    }
    case 'success': {
      toast.success(message, options);
      break;
    }
    case 'warning': {
      toast.warning(message, options);
      break;
    }
    case 'info': {
      toast.info(message, options);
      break;
    }
    default: {
      toast(message, options);
    }
  }
}
