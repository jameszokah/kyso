'use client';

import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DynamicCondition } from '@/features/json-form/types/controls';
import { ModalContext } from '@/features/modals/modal-provider';
import { validateCondition } from '@/features/json-form/utils/conditional-transform';
import { ConditionsFormField } from '../dynamic-conditions-form-field/conditions-form-field';

type ConditionsFormProps = {
  onChange: (value: DynamicCondition[]) => void;
  value: DynamicCondition[];
};

const emptyCondition: DynamicCondition = {
  x: '',
  comparisonOperator: 'isEqual',
  y: '',
  logicalOperator: 'AND',
};

export interface ConditionsFormHandle {
  handleConfirm: () => void;
}

export const ConditionsForm = forwardRef<ConditionsFormHandle, ConditionsFormProps>(
  ({ onChange, value }: ConditionsFormProps, ref: ForwardedRef<ConditionsFormHandle>) => {
    const { closeModal } = useContext(ModalContext);
    const [shouldShowValidation, setShouldShowValidation] = useState(false);
    const [conditions, setConditions] = useState<Partial<DynamicCondition>[]>(
      value.length > 0 ? value : [emptyCondition],
    );

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
      setShouldShowValidation(false);
    }, [conditions]);

    const addCondition = () => {
      setConditions((state) => [...state, emptyCondition]);
    };

    const removeCondition = (index: number) => {
      setConditions((state) => state.filter((_, index_) => index_ !== index));
    };

    const updateCondition = (index: number) => (condition: DynamicCondition) => {
      setConditions((state) => [...state.slice(0, index), condition, ...state.slice(index + 1)]);
    };

    const handleConfirm = useCallback(() => {
      const hasAllVariablesEmpty = conditions.every(({ x, y }) => !x && !y);
      if (hasAllVariablesEmpty) {
        onChange([]);
        closeModal();
        return;
      }

      const hasErrors = conditions.some((condition) => Object.values(validateCondition(condition)).some(Boolean));
      if (hasErrors) {
        setShouldShowValidation(true);
        return;
      }

      onChange(conditions as DynamicCondition[]);
      closeModal();
    }, [closeModal, conditions, onChange]);

    const lastIndex = conditions.length - 1;

    useImperativeHandle(ref, () => ({ handleConfirm }), [handleConfirm]);

    return (
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirm();
        }}
        className="w-full flex flex-col space-y-4"
      >
        <div className="flex flex-col gap-1.5">
          {conditions.map((condition, index) => (
            <ConditionsFormField
              key={index}
              condition={condition}
              onChange={updateCondition(index)}
              onRemove={() => removeCondition(index)}
              isLast={index === lastIndex}
              shouldShowValidation={shouldShowValidation}
            />
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" className="w-full mt-4" onClick={addCondition}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      </form>
    );
  },
);

ConditionsForm.displayName = 'ConditionsForm';
