// import Logo from '../../../assets/workflow-builder-logo.svg?react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { MenuItem, MenuContainer } from '@/components/ui/fluid-menu';
import { X, MoreVertical } from 'lucide-react';

import { Icon } from '@kyso/icons';
interface ToolbarProps {
  onSave: () => void;
  onOpen?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isReadOnlyMode: boolean;
  onLayoutChange: (direction: boolean) => void;
  isLayoutVertical: boolean;
  onToggleReadOnly: (isReadOnlyMode: boolean) => void;
  onExport?: () => void;
  onImport?: () => void;
  onSaveAsImage?: () => void;
  onArchive?: () => void;
  onPreview?: () => void;
}


export function Toolbar({
  onSave,
  onOpen,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isReadOnlyMode,
  onLayoutChange,
  isLayoutVertical,
  onToggleReadOnly,
  onExport,
  onImport,
  onSaveAsImage,
  onArchive,
  onPreview,
}: ToolbarProps) {

  const data = [
    {
      title: 'Save',
      icon: <Icon name="FloppyDiskThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      onClick: onSave,
      isTogglable: false,
      disabled: false,
    },
    {
      title: 'Preview',
      icon: <Icon name="PlayThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      onClick: onPreview,
      isTogglable: false,
      disabled: false,
    },

    {
      title: 'Open',
      icon: <Icon name="FolderOpenThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      onClick: onOpen,
      isTogglable: false,
      disabled: false,
    },
    {
      title: isLayoutVertical ? 'Vertical Layout' : 'Horizontal Layout',
      icon: (
        <Icon
          name={isLayoutVertical ? 'GitBranchThin' : 'GitMergeThin'}
          className="h-full w-full text-neutral-600 dark:text-neutral-300"
        />
      ),
      onChange: onLayoutChange,
      isChecked: isLayoutVertical,
      isTogglable: true,
      disabled: false,
    },
    {
      title: 'Edit',
      icon: (
        <Icon
          name={isReadOnlyMode ? 'PencilSimpleSlashThin' : 'PencilSimpleThin'}
          className="h-full w-full text-neutral-600 dark:text-neutral-300"
        />
      ),
      onChange: onToggleReadOnly,
      isChecked: isReadOnlyMode,
      isTogglable: true,
      disabled: false,
    },
    {
      title: 'Undo',
      icon: <Icon name="ArrowUUpLeftThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      onClick: onUndo,
      isTogglable: false,
      disabled: !canUndo,
    },
    {
      title: 'Redo',
      icon: <Icon name="ArrowUUpRightThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      onClick: onRedo,
      isTogglable: false,
      disabled: !canRedo,
    },
    {
      title: 'More',
      isTogglable: false,
      disabled: false,
    },
  ];

  return (
    <>
      <div className="absolute bottom-2 left-1/2 max-w-full -translate-x-1/2 pointer-events-auto">
        <Dock className="items-end pb-3">
          {data.map((item, index) =>
            item.title === 'More' ? (
              <DockItem isTogglable={item.isTogglable} key={item.title} className="z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-b from-gray-900/10 to-transparent dark:from-gray-100/10 blur-3xl -z-10 rounded-full" />
                  <MenuContainer>
                    <MenuItem
                      icon={
                        <div className="relative w-5 h-5">
                          <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
                            <MoreVertical size={24} strokeWidth={1.5} />
                          </div>
                          <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
                            <X size={24} strokeWidth={1.5} />
                          </div>
                        </div>
                      }
                    />
                    <MenuItem
                      onClick={onExport}
                      icon={<Icon name="ExportThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />}
                    />
                    <MenuItem
                      onClick={onImport}
                      icon={
                        <Icon
                          name="CloudArrowDownThin"
                          className="h-full w-full text-neutral-600 dark:text-neutral-300"
                        />
                      }
                    />
                    <MenuItem
                      onClick={onSaveAsImage}
                      icon={<Icon name="ImageThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />}
                    />
                    <MenuItem
                      onClick={onArchive}
                      icon={
                        <Icon name="ArchiveThin" className="h-full w-full text-neutral-600 dark:text-neutral-300" />
                      }
                    />
                  </MenuContainer>
                </div>
              </DockItem>
            ) : (
              <DockItem
                onClick={item.onClick}
                onChange={item.onChange}
                isTogglable={item.isTogglable}
                key={index}
                isChecked={item?.isChecked}
                className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800"
                disabled={item.disabled}
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            ),
          )}
        </Dock>
      </div>
      {/* <div className={styles['nav-segment']}>
        <NavButton onClick={onSave} tooltip={t('save')}>
          <Icon name="FloppyDisk" />
        </NavButton>
        <NavButton onClick={onOpen} tooltip={t('open')}>
          <Icon name="FolderOpen" />
        </NavButton>
        <NavButton onClick={onUndo} disabled={!canUndo || isReadOnlyMode} tooltip={t('undo')}>
          <Icon name="ArrowUUpLeft" />
        </NavButton>
        <NavButton onClick={onRedo} disabled={!canRedo || isReadOnlyMode} tooltip={t('redo')}>
          <Icon name="ArrowUUpRight" />
        </NavButton>
      </div>
    </div> */}
    </>
  );
}
