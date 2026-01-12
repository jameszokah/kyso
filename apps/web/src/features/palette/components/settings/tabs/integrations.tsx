'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui-test/button';
import { Input } from '@/components/ui-test/input';

// Sample integrations data (in real app, would come from OAuth providers)
const SAMPLE_INTEGRATIONS = [
  {
    id: 'google',
    name: 'Google',
    services: [
      { id: 'gmail', name: 'Gmail', description: 'Send and receive emails' },
      { id: 'google-drive', name: 'Google Drive', description: 'Access and manage files' },
      { id: 'google-calendar', name: 'Google Calendar', description: 'Manage calendar events' },
      { id: 'google-sheets', name: 'Google Sheets', description: 'Read and write spreadsheets' },
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    services: [
      { id: 'outlook', name: 'Outlook', description: 'Email and calendar' },
      { id: 'onedrive', name: 'OneDrive', description: 'Cloud file storage' },
      { id: 'teams', name: 'Teams', description: 'Team collaboration' },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    services: [{ id: 'github', name: 'GitHub', description: 'Code repositories and issues' }],
  },
  {
    id: 'slack',
    name: 'Slack',
    services: [{ id: 'slack', name: 'Slack', description: 'Team messaging and notifications' }],
  },
  {
    id: 'notion',
    name: 'Notion',
    services: [{ id: 'notion', name: 'Notion', description: 'Workspace and documentation' }],
  },
];

interface IntegrationsProps {
  onOpenChange?: (open: boolean) => void;
}

export function Integrations({ onOpenChange }: IntegrationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [connectedServices, setConnectedServices] = useState<Set<string>>(new Set());

  const filteredIntegrations = useMemo(() => {
    if (!searchTerm.trim()) return SAMPLE_INTEGRATIONS;
    const term = searchTerm.toLowerCase();
    return SAMPLE_INTEGRATIONS.map((provider) => ({
      ...provider,
      services: provider.services.filter(
        (s) => s.name.toLowerCase().includes(term) || s.description.toLowerCase().includes(term),
      ),
    })).filter((p) => p.services.length > 0);
  }, [searchTerm]);

  function handleConnect(serviceId: string) {
    // In real app, would initiate OAuth flow
    setConnectedServices((previous) => new Set([...previous, serviceId]));
  }

  function handleDisconnect(serviceId: string) {
    setConnectedServices((previous) => {
      const next = new Set(previous);
      next.delete(serviceId);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/30 px-2 py-1.5">
          <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={2} />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-auto flex-1 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Integrations List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {filteredIntegrations.map((provider) => (
            <div key={provider.id} className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">{provider.name}</span>
              {provider.services.map((service) => {
                const isConnected = connectedServices.has(service.id);
                return (
                  <div key={service.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted/50">
                        <span className="text-xs font-medium">{service.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{service.name}</span>
                        <span className="text-xs text-muted-foreground">{service.description}</span>
                      </div>
                    </div>
                    {isConnected ? (
                      <Button variant="ghost" size="sm" onClick={() => handleDisconnect(service.id)}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleConnect(service.id)}>
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {searchTerm.trim() && filteredIntegrations.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No integrations found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
