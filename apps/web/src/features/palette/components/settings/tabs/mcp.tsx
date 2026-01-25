'use client';

import { useCallback, useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useStore from '@/store/store';
import type { McpServer } from '@/store/slices/settings/settings-slice';

const DEFAULT_FORM_DATA = {
  name: '',
  transport: 'streamable-http',
  url: '',
  timeout: 30_000,
  headers: {} as Record<string, string>,
};

export function MCP() {
  const mcpServers = useStore((state) => state.mcpServers);
  const addMcpServer = useStore((state) => state.addMcpServer);
  const removeMcpServer = useStore((state) => state.removeMcpServer);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<{ id: string; name: string } | null>(null);
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null);

  const filteredServers = useMemo(() => {
    return mcpServers.filter((server) => server.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [mcpServers, searchTerm]);

  const handleAddServer = useCallback(() => {
    if (!formData.name.trim() || !formData.url.trim()) return;

    addMcpServer({
      name: formData.name.trim(),
      transport: formData.transport,
      url: formData.url.trim(),
      headers: formData.headers,
      timeout: formData.timeout,
      enabled: true,
    });

    setFormData(DEFAULT_FORM_DATA);
    setShowAddForm(false);
  }, [formData, addMcpServer]);

  const handleRemoveServer = useCallback((serverId: string, serverName: string) => {
    setServerToDelete({ id: serverId, name: serverName });
    setShowDeleteDialog(true);
  }, []);

  const confirmDeleteServer = useCallback(() => {
    if (!serverToDelete) return;
    removeMcpServer(serverToDelete.id);
    setShowDeleteDialog(false);
    setServerToDelete(null);
  }, [serverToDelete, removeMcpServer]);

  if (selectedServer) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Server Name</span>
              <p className="text-sm text-muted-foreground">{selectedServer.name || 'Unnamed Server'}</p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Transport</span>
              <p className="text-sm text-muted-foreground">{selectedServer.transport}</p>
            </div>

            {selectedServer.url && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">URL</span>
                <p className="break-all font-mono text-sm text-muted-foreground">{selectedServer.url}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Tools ({selectedServer.tools.length})</span>
              {selectedServer.tools.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tools available</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedServer.tools.map((tool) => (
                    <div key={tool.name} className="rounded-md border bg-muted/30 px-3 py-2">
                      <p className="text-sm font-medium">{tool.name}</p>
                      {tool.description && <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button onClick={() => setSelectedServer(null)}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        {/* Search and Add */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/30 px-2 py-1.5">
            <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={2} />
            <Input
              placeholder="Search MCPs..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-auto flex-1 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Server Name</span>
                <Input
                  placeholder="e.g., My MCP Server"
                  value={formData.name}
                  onChange={(event) => setFormData((previous) => ({ ...previous, name: event.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Server URL</span>
                <Input
                  placeholder="https://mcp.server.dev/sse"
                  value={formData.url}
                  onChange={(event) => setFormData((previous) => ({ ...previous, url: event.target.value }))}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddServer} disabled={!formData.name.trim() || !formData.url.trim()}>
                  Add Server
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Servers List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {mcpServers.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Click &quot;Add&quot; above to get started
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredServers.map((server) => (
                <div key={server.id} className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                  <button className="flex min-w-0 flex-col gap-0.5 text-left" onClick={() => setSelectedServer(server)}>
                    <span className="truncate font-medium text-sm">{server.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {server.tools.length} tools • {server.transport}
                    </span>
                  </button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleRemoveServer(server.id, server.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {searchTerm.trim() && filteredServers.length === 0 && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No servers found matching &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete MCP Server</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{serverToDelete?.name}</strong>?{' '}
              <span className="text-destructive">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteServer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
