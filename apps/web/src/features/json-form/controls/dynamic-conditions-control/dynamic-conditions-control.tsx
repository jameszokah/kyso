'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/locales/client';
import { cn } from '@/lib/utils';
import type { DynamicCondition, DynamicConditionsControlProps } from '../../types/controls';
import { createControlRenderer } from '../../utils/rendering';
import { ControlWrapper } from '../control-wrapper';
import { ConditionsForm, type ConditionsFormHandle } from './dynamic-conditions-form/conditions-form';
import { Icon } from '@kyso/icons';
import { conditionsToDependencies } from '../../utils/conditional-transform';
import { ConditionModalFooter } from './dynamic-condition-modal-footer/condition-modal-footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

function DynamicConditionsControl(props: DynamicConditionsControlProps) {
  const { data = [], handleChange, path, enabled } = props;
  const t = useI18n();


  const [open, setOpen] = useState(false);
  const formRef = useRef<ConditionsFormHandle>(null);

  const dependencies = useMemo(() => conditionsToDependencies(data), [data]);

  const onChange = useCallback(
    (value: DynamicCondition[]) => {
      handleChange(path, value);
    },
    [handleChange, path],
  );

  const handleConfirm = useCallback(() => {
    formRef.current?.handleConfirm();
    setOpen(false);
  }, []);

  return (
    <div className="p-2 border border-border rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2 font-semibold text-foreground">
        <span className="text-sm font-medium leading-none">{t('conditions.title')}</span>
        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setOpen(true)} title={t('conditions.title')}>
          <Icon name="FrameCornersThin" />
        </Button>
      </div>

      {/* Dependencies Viewer */}
      <ControlWrapper {...props} uischema={{ ...props.uischema, label: t('conditions.dependencies') }}>
        <Textarea
          disabled={!enabled}
          value={dependencies.join(' ')}
          onClick={() => setOpen(true)}
          className={cn(
            'min-h-[100px] text-sm cursor-pointer resize-none',
            !enabled && 'opacity-50 pointer-events-none',
          )}
          readOnly
        />
        <span className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 mt-2 inline-block w-fit">
          {t('conditions.totalNumber', { count: data.length })}
        </span>
      </ControlWrapper>

      {/* ShadCN Dialog for Condition Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('conditions.title')}</DialogTitle>
          </DialogHeader>


          <ConditionsForm ref={formRef} onChange={onChange} value={data} />

          <DialogFooter>
            <ConditionModalFooter closeModal={() => setOpen(false)} handleConfirm={handleConfirm} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const dynamicConditionsControlRenderer = createControlRenderer('DynamicConditions', DynamicConditionsControl);
