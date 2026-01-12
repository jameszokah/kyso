'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AccordionLayoutElement, LayoutProps } from '../../types/layouts';
import { LayoutWrapper } from '../layout-wrapper';
import { createLayoutRenderer } from '../../utils/rendering';
import { renderElements } from '../render-elements';

function AccordionLayout(props: LayoutProps<AccordionLayoutElement>) {
  const { uischema } = props;

  return (
    <LayoutWrapper {...props}>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-base font-medium">{uischema.label}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">{renderElements(props)}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </LayoutWrapper>
  );
}

export const accordionLayoutRenderer = createLayoutRenderer('Accordion', AccordionLayout);
