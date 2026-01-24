'use client';

import { Tile } from './components/tile';
import type { DiagramModel, TemplateModel } from '@kyso/types/common';
// import { Trans, useTranslation } from 'react-i18next';
import { useI18n } from '@/locales/client';
import { cn } from '@/lib/utils';

type TemplateSelectorProps = {
  data: TemplateModel[];
  selectTemplate: (model?: DiagramModel) => void;
};

export function TemplateSelector({ data, selectTemplate }: TemplateSelectorProps) {
  const t = useI18n();


  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header */}
      <section className="flex flex-col items-center">
        <span className="text-center text-muted-foreground text-sm">
          {/* <Trans i18nKey="templateSelector.description" components={{ br: <br /> }} /> */}
          <span dangerouslySetInnerHTML={{ __html: t('templateSelector.description') }} />
        </span>

      </section>

      {/* Content */}
      <section className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'grid grid-cols-2 justify-center gap-3', // 6px = gap-1.5
            'max-w-[calc((116px+12px*2)*3+16px)]', // preserved your layout math
          )}
        >
          {data.map(({ icon, id, name, value }) => (
            <Tile
              key={id}
              icon={icon}
              title={name}
              subTitle={`${value.diagram.nodes.length} nodes`}
              onClick={() => selectTemplate(value)}
            />
          ))}

          <Tile icon="CornersOutThin" title={t('templateSelector.emptyCanvas')} outlined onClick={selectTemplate} />
        </div>
      </section>
    </div>
  );
}
