'use client';
import { useCallback } from 'react';
import { useI18n } from '@/locales/client';

export function useTranslateIfPossible() {
  const t = useI18n();

  const translateIfPossible = useCallback(
    (value = '') => {
      // Logic for dynamic translation check if needed
      // For now, next-international types makes t(value) unsafe if value is any string
      // return t(value as any); 
      return value;
    },
    [t],
  );

  return translateIfPossible;
}

