import { Button } from '@/components/ui-test/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { templates } from '@/data/templates';
import { TemplateSelector } from '@/features/modals/template-selector/template-selector';
import { SettingsDialog } from '../settings/settings-dialog';
import { Settings } from 'lucide-react';
import { useFitView } from '@/hooks/use-fit-view';
import useStore from '@/store/store';
import type { DiagramModel } from '@kyso/types/common';
import { useCallback, useState } from 'react';
import { useI18n } from '@/locales/client';

export function PaletteFooter() {
  const t = useI18n();
  const fitView = useFitView();
  const setDiagramModel = useStore((store) => store.setDiagramModel);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectTemplate = useCallback(
    (model?: DiagramModel) => {
      setDiagramModel(model);
      fitView();
      setIsOpen(false);
    },
    [setDiagramModel, fitView],
  );

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full" size="default">
            {t('palette.templates')}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle></DialogTitle>

            <DialogDescription></DialogDescription>
          </DialogHeader>
          <TemplateSelector data={templates} selectTemplate={handleSelectTemplate} />
          <DialogFooter className="flex-col mt-6 gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsSettingsOpen(true)}>
        <Settings className="w-4 h-4" />
        {t('palette.settings')}
      </Button>

      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
