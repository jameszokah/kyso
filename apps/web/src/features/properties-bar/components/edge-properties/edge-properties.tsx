import type { WorkflowBuilderEdge } from '@kyso/types/node-data';
import useStore from '@/store/store';
import { useEffect, useState } from 'react';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import { Input } from '@/components/ui/input';

type Props = {
  edge: WorkflowBuilderEdge;
};

export function EdgeProperties({ edge }: Props) {
  const { data = {}, id } = edge;
  const { label } = data;

  const setEdgeData = useStore((state) => state.setEdgeData);
  const isReadOnlyMode = useStore((state) => state.isReadOnlyMode);

  const [input, setInput] = useState(label);

  useEffect(() => {
    setInput(label);
  }, [label]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setInput(value);
    setEdgeData(id, { label: value });
  };

  return (
    <div className={'flex flex-col gap-2 p-4'}>
      <FormControlWithLabel label="Label">
        <Input value={input || ''} onChange={onChange} disabled={isReadOnlyMode} />
      </FormControlWithLabel>
    </div>
  );
}
