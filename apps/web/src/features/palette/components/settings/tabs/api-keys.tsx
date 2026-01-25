'use client';

import { useCallback, useMemo, useState } from 'react';
import { Check, Copy, Plus, Search, Trash2 } from 'lucide-react';
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

interface ApiKeysProps {
  onOpenChange?: (open: boolean) => void;
}

export function ApiKeys({ onOpenChange }: ApiKeysProps) {
  const apiKeys = useStore((state) => state.apiKeys);
  const addApiKey = useStore((state) => state.addApiKey);
  const removeApiKey = useStore((state) => state.removeApiKey);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const filteredKeys = useMemo(() => {
    if (!searchTerm.trim()) return apiKeys;
    return apiKeys.filter((key) => key.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [apiKeys, searchTerm]);

  const handleCreateKey = useCallback(() => {
    if (!newKeyName.trim()) return;
    const key = addApiKey({
      name: newKeyName.trim(),
      key: '',
      displayKey: '',
      keyType: 'personal',
    });
    setNewKey(key);
    setShowNewKeyDialog(true);
    setNewKeyName('');
    setIsCreateDialogOpen(false);
  }, [newKeyName, addApiKey]);

  const handleDeleteKey = useCallback(() => {
    if (!deleteKeyId) return;
    removeApiKey(deleteKeyId);
    setShowDeleteDialog(false);
    setDeleteKeyId(null);
  }, [deleteKeyId, removeApiKey]);

  const copyToClipboard = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }, []);

  function formatDate(dateString?: string) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        {/* Search and Create */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/30 px-2 py-1.5">
            <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={2} />
            <Input
              placeholder="Search API keys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-auto flex-1 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create
          </Button>
        </div>

        {/* Keys List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {apiKeys.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Click "Create" above to get started
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-sm">{key.name}</span>
                      <span className="text-xs text-muted-foreground">
                        (last used: {formatDate(key.lastUsed).toLowerCase()})
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{key.displayKey}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDeleteKeyId(key.id);
                      setShowDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}

              {searchTerm.trim() && filteredKeys.length === 0 && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No API keys found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new API key</DialogTitle>
            <DialogDescription>
              Enter a name for your API key to help you identify it later. Make sure to copy it after creation as you
              won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Development, Production"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New API Key Dialog */}
      <Dialog
        open={showNewKeyDialog}
        onOpenChange={(open) => {
          setShowNewKeyDialog(open);
          if (!open) {
            setNewKey(null);
            setCopySuccess(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your API key has been created</DialogTitle>
            <DialogDescription>
              This is the only time you will see your API key. <strong>Copy it now and store it securely.</strong>
            </DialogDescription>
          </DialogHeader>
          {newKey && (
            <div className="relative mt-2">
              <div className="flex items-center rounded-md border bg-muted/50 px-3 py-2 pr-10">
                <code className="flex-1 truncate font-mono text-sm">{newKey}</code>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => copyToClipboard(newKey)}
              >
                {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete API key</DialogTitle>
            <DialogDescription>
              Deleting this key will immediately revoke access for any integrations using it.{' '}
              <span className="text-destructive">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteKey}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
