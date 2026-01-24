import type { Node, Edge } from '@xyflow/react';
import styles from './delete-confirmation.module.css';
// import { Trans, useTranslation } from 'react-i18next';
import { useI18n } from '@/locales/client';
import { Checkbox } from '@/components/ui-test/checkbox';
import { Button } from '@/components/ui-test/button';
import { useState } from 'react';
import { Label } from '@/components/ui-test/label';

type DeleteConfirmationProps = {
  nodes: Node[];
  edges: Edge[];
  onShouldShowAgainChange?: (value: boolean) => void;
};

export function DeleteConfirmation({ nodes, edges, onShouldShowAgainChange }: DeleteConfirmationProps) {
  const [isChecked, setIsChecked] = useState(false);
  const t = useI18n();

  // Use explicit keys instead of dynamic template literals
  const getNodeWord = () => nodes.length > 1 ? t('deleteConfirmation.nodes') : t('deleteConfirmation.node');
  const getEdgeWord = () => edges.length > 1 ? t('deleteConfirmation.edges') : t('deleteConfirmation.edge');

  const parts = [
    nodes.length > 0 ? getNodeWord() : '',
    edges.length > 0 ? getEdgeWord() : '',
  ].filter(Boolean);

  function handleChange(checked: boolean) {
    setIsChecked(checked);
    onShouldShowAgainChange?.(checked);
  }

  const translatedParts = parts.join(` ${t('deleteConfirmation.andConnected')} `);
  const selectedText = nodes.length > 1 ? t('deleteConfirmation.selectedPlural') : t('deleteConfirmation.selected');


  return (
    <div className={styles['content']}>
      <span
        dangerouslySetInnerHTML={{
          __html: t('deleteConfirmation.text', {
            selected: selectedText,
            parts: translatedParts,
          }),
        }}
      />

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="dont-show-again-checkbox"
          checked={isChecked}
          onCheckedChange={(checked: boolean | 'indeterminate') => handleChange(checked === true)}
        />
        <Label htmlFor="dont-show-again-checkbox">{t('deleteConfirmation.dontShowMeThisAgain')}</Label>
      </div>
    </div>
  );
}

type DeleteConfirmationButtonsProps = {
  onDeleteClick: () => void;
  onCancelClick: () => void;
};

export function DeleteConfirmationButtons({ onDeleteClick, onCancelClick }: DeleteConfirmationButtonsProps) {
  const t = useI18n();

  return (
    <div className={styles['buttons']}>
      <Button variant="secondary" onClick={onCancelClick}>
        {t('deleteConfirmation.cancel')}
      </Button>
      <Button onClick={onDeleteClick} variant="destructive" autoFocus>
        {t('deleteConfirmation.delete')}
      </Button>
    </div>
  );
}
