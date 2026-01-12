'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontalIcon, TrashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui-test/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  ConditionsForm,
  ConditionsFormHandle,
} from '../../dynamic-conditions-control/dynamic-conditions-form/conditions-form';
import { ConditionModalFooter } from '../../dynamic-conditions-control/dynamic-condition-modal-footer/condition-modal-footer';
import { DecisionBranch } from '@/features/json-form/types/controls';

type Props = {
  branch: DecisionBranch;
  onUpdate: (branch: DecisionBranch) => void;
  onRemove: (index: number) => void;
};

export function BranchCard({ branch, onUpdate, onRemove }: Props) {
  const { t } = useTranslation();
  const { conditions, index } = branch;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formRef = useRef<ConditionsFormHandle>(null);

  const conditionCount = conditions.length;
  const hasNoConditions = conditionCount === 0;

  const handleConfirm = useCallback(() => {
    formRef.current?.handleConfirm();
    setIsDialogOpen(false);
  }, []);

  const handleEdit = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleRemove = useCallback(() => {
    onRemove(branch.index);
  }, [onRemove, branch]);

  function getConditionText() {
    if (conditionCount === 1) {
      return t('decisionBranches.singleCondition');
    } else if (conditionCount > 1) {
      return t('decisionBranches.manyConditions', { count: conditionCount });
    } else {
      return t('decisionBranches.noConditions');
    }
  }

  return (
    <>
      <div className="flex flex-col items-start p-2 gap-1.5 rounded-md border border-border">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <h1 className="text-sm font-semibold">{t('decisionBranches.branch', { index })}</h1>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <SlidersHorizontalIcon weight="bold" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRemove}>
              <TrashIcon weight="bold" />
            </Button>
          </div>
        </div>

        {/* Conditions Chip */}
        <div
          className={`flex justify-center items-center text-xs px-1.5 py-1 rounded ${
            hasNoConditions ? 'bg-muted text-muted-foreground' : 'bg-secondary text-secondary-foreground'
          }`}
        >
          {getConditionText()}
        </div>
      </div>

      {/* ShadCN Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('conditions.title')}</DialogTitle>
          </DialogHeader>
          <ConditionsForm
            ref={formRef}
            value={conditions}
            onChange={(updatedConditions) => onUpdate({ index, conditions: updatedConditions })}
          />
          <DialogFooter>
            <ConditionModalFooter closeModal={() => setIsDialogOpen(false)} handleConfirm={handleConfirm} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
