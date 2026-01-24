import { Button } from '@/components/ui-test/button';
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Icon } from '@kyso/icons';
import { useI18n } from '@/locales/client';


export function PaletteHeader() {
  const t = useI18n();
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className={'flex items-center justify-between gap-1 w-full '}>
          <span className="ax-public-h7">{t('palette.nodesLibrary')}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSidebar()}
            type='button'
            className="rounded-lg"
          >
            <Icon name="SidebarSimpleThin" />
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
