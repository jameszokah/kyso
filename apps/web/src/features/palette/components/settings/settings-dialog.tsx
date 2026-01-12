'use client';

import { useState } from 'react';
import { FolderCode, Key, Plug, Server, FileUp } from 'lucide-react';
import {
  SModal,
  SModalContent,
  SModalSidebar,
  SModalSidebarHeader,
  SModalSidebarSection,
  SModalSidebarSectionTitle,
  SModalSidebarItem,
  SModalMain,
  SModalMainHeader,
  SModalMainBody,
} from '@/components/ui/s-modal';
import { EnvironmentVariables, ApiKeys, Files, MCP, Integrations } from './tabs';

type NavigationSection = 'tools' | 'system';
type NavigationId = 'integrations' | 'mcp' | 'environment' | 'apikeys' | 'files';

interface NavigationItem {
  id: NavigationId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: NavigationSection;
}

const sectionConfig: { key: NavigationSection; title: string }[] = [
  { key: 'tools', title: 'Tools' },
  { key: 'system', title: 'System' },
];

const navigationItems: NavigationItem[] = [
  { id: 'integrations', label: 'Integrations', icon: Plug, section: 'tools' },
  { id: 'mcp', label: 'MCPs', icon: Server, section: 'tools' },
  { id: 'environment', label: 'Environment', icon: FolderCode, section: 'system' },
  { id: 'apikeys', label: 'API Keys', icon: Key, section: 'system' },
  { id: 'files', label: 'Files', icon: FileUp, section: 'system' },
];

const sectionLabels: Record<NavigationId, string> = {
  integrations: 'Integrations',
  mcp: 'MCPs',
  environment: 'Environment Variables',
  apikeys: 'API Keys',
  files: 'Files',
};

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState<NavigationId>('environment');

  return (
    <SModal open={open} onOpenChange={onOpenChange}>
      <SModalContent>
        {/* Sidebar */}
        <SModalSidebar>
          <SModalSidebarHeader>Settings</SModalSidebarHeader>
          {sectionConfig.map(({ key, title }) => {
            const sectionItems = navigationItems.filter((item) => item.section === key);
            if (sectionItems.length === 0) return null;

            return (
              <SModalSidebarSection key={key}>
                <SModalSidebarSectionTitle>{title}</SModalSidebarSectionTitle>
                {sectionItems.map((item) => (
                  <SModalSidebarItem
                    key={item.id}
                    active={activeSection === item.id}
                    icon={<item.icon />}
                    onClick={() => setActiveSection(item.id)}
                  >
                    {item.label}
                  </SModalSidebarItem>
                ))}
              </SModalSidebarSection>
            );
          })}
        </SModalSidebar>

        {/* Main Content */}
        <SModalMain>
          <SModalMainHeader>{sectionLabels[activeSection]}</SModalMainHeader>
          <SModalMainBody>
            {activeSection === 'environment' && <EnvironmentVariables />}
            {activeSection === 'apikeys' && <ApiKeys onOpenChange={onOpenChange} />}
            {activeSection === 'files' && <Files />}
            {activeSection === 'mcp' && <MCP />}
            {activeSection === 'integrations' && <Integrations onOpenChange={onOpenChange} />}
          </SModalMainBody>
        </SModalMain>
      </SModalContent>
    </SModal>
  );
}
