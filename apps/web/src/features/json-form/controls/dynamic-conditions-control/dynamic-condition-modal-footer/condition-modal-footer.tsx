import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

type Props = {
  closeModal: () => void;
  handleConfirm: () => void;
};

export function ConditionModalFooter({ closeModal, handleConfirm }: Props) {
  const t = useI18n();


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
