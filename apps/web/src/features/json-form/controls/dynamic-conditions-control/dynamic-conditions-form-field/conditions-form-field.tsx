'use client';

import { useMemo } from 'react';
import { useI18n } from '@/locales/client';
import { Button } from '@/components/ui-test/button';
import { Input } from '@/components/ui-test/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Icon } from '@kyso/icons';
import { comparisonsOperators, validateCondition } from '@/features/json-form/utils/conditional-transform';
import type { DynamicCondition } from '@/features/json-form/types/controls';

type ConditionsFormFieldProps = {
  condition: Partial<DynamicCondition>;
  onRemove: () => void;
  onChange: (condition: DynamicCondition) => void;
  isLast?: boolean;
  shouldShowValidation?: boolean;
};

export function ConditionsFormField({
  condition,
  onChange,
  onRemove,
  isLast,
  shouldShowValidation,
}: ConditionsFormFieldProps) {
  const t = useI18n();

  // Helper to get type-safe operator translations
  const getOperatorLabel = (operator: string) => {
    const operatorMap: Record<string, string> = {
      isEqual: t('conditions.compare.isEqual'),
      isNotEqual: t('conditions.compare.isNotEqual'),
      isGreaterThan: t('conditions.compare.isGreaterThan'),
      isLessThan: t('conditions.compare.isLessThan'),
      isLessThanOrEqual: t('conditions.compare.isLessThanOrEqual'),
      isGreaterThanOrEqual: t('conditions.compare.isGreaterThanOrEqual'),
      isContaining: t('conditions.compare.isContaining'),
      isNotContaining: t('conditions.compare.isNotContaining'),
    };
    return operatorMap[operator] || operator;
  };

  const handleChange = (field: 'x' | 'comparisonOperator' | 'y' | 'logicalOperator', value: unknown) => {
    onChange({
      ...condition,
      [field]: value,
    } as DynamicCondition);
  };

  const errors = useMemo(() => {
    if (!shouldShowValidation) return {} as Record<string, any>;
    return validateCondition(condition);
  }, [condition, shouldShowValidation]);

  const hasError = shouldShowValidation && (!condition.x || !condition.y);

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-1 p-1.5 rounded-lg transition-colors',
          hasError ? 'bg-destructive/10 border border-destructive/50' : 'bg-muted/50',
        )}
      >
        {/* Drag Handle or Menu */}
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" title={t('tooltips.menu') ?? ''}>
          <Icon name="DotsSixVerticalThin" size="small" />
        </Button>

        {/* Condition Inputs */}
        <div className="flex flex-col gap-1 w-full">
          <Input
            className="bg-background text-sm"
            onChange={(e) => handleChange('x', e.target.value)}
            value={condition.x ?? ''}
            aria-invalid={errors.x}
          />

          <Select
            value={condition.comparisonOperator}
            onValueChange={(value: string) => handleChange('comparisonOperator', value)}
          >
            <SelectTrigger className="bg-background text-sm">
              <SelectValue placeholder={t('conditions.compare.select') as string} />
            </SelectTrigger>
            <SelectContent>
              {comparisonsOperators.map((operator) => (
                <SelectItem key={operator} value={operator}>
                  {getOperatorLabel(operator)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className="bg-background text-sm"
            onChange={(e) => handleChange('y', e.target.value)}
            value={condition.y ?? ''}
            aria-invalid={errors.y}
          />
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-destructive"
          onClick={onRemove}
          title={t('tooltips.remove') ?? ''}
        >
          <Icon name="XThin" size="small" />
        </Button>
      </div>

      {/* Logical Operator Selector (AND / OR) */}
      {!isLast && (
        <div className="flex justify-center mt-2">
          <ToggleGroup
            type="single"
            size="sm"
            value={condition.logicalOperator || 'AND'}
            onValueChange={(value: string) => handleChange('logicalOperator', value)}
            className="w-[150px]"
          >
            <ToggleGroupItem value="AND">{t('conditions.compare.and')}</ToggleGroupItem>
            <ToggleGroupItem value="OR">{t('conditions.compare.or')}</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
    </>
  );
}
