// import { toast } from 'sonner';
import { sileo } from 'sileo';

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
            title: buttonLabel,
            onClick: onButtonClick,
          }
        : undefined,
  };

  switch (variant) {
    case 'destructive':
    case 'error': {
      sileo.error({ title: message, description: options.description, button: options.action });
      break;
    }
    case 'success': {
      sileo.success({ title: message, description: options.description, button: options.action });
      break;
    }
    case 'warning': {
      sileo.warning({ title: message, description: options.description, button: options.action });
      break;
    }
    case 'info': {
      sileo.info({ title: message, description: options.description, button: options.action });
      break;
    }
    default: {
      sileo.show({ title: message, description: options.description, button: options.action });
    }
  }
}
