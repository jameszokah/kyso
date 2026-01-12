import { Button } from '@/components/ui-test/button';
import { useTranslation } from 'react-i18next';

type Props = {
  closeModal: () => void;
  handleConfirm: () => void;
};

export function ConditionModalFooter({ closeModal, handleConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" type="button" onClick={closeModal}>
        {t('conditions.cancel')}
      </Button>
      <Button onClick={handleConfirm}>
        {t('conditions.confirm')}
      </Button>
    </div>
  );
}
