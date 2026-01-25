'use client';

import { useState } from 'react';
import { createControlRenderer } from '../../utils/rendering';
import { AgentToolConfigControl, type AgentToolConfig } from './agent-tool-config-control';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { GearSix, PencilSimple, PlusCircle } from '@phosphor-icons/react';

interface SingleAgentToolControlProps {
  data: AgentToolConfig;
  path: string;
  handleChange: (path: string, value: AgentToolConfig) => void;
}

function SingleAgentToolControl({ path, handleChange, data }: SingleAgentToolControlProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AgentToolConfig | undefined>();

  // Check if tool is already configured
  const hasConfiguredTool = data?.name && data?.name.length > 0;

  const handleOpenDialog = () => {
    setEditingTool(data || { name: '', description: '', type: 'http_request', config: {} });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingTool) {
      handleChange(path, editingTool);
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingTool(undefined);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Show configured tool summary if exists */}
      {hasConfiguredTool && (
        <div className="p-3 bg-muted/50 border rounded-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm">{data.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{data.description || 'No description'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Type: <span className="font-medium">{data.type}</span>
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleOpenDialog} className="h-8 w-8">
              <PencilSimple />
            </Button>
          </div>
        </div>
      )}

      {/* Add/Configure Tool Button */}
      <Button 
        variant={hasConfiguredTool ? "outline" : "default"} 
        onClick={handleOpenDialog}
        className="w-full gap-2"
      >
        {hasConfiguredTool ? (
          <>
            <GearSix /> Edit Tool Configuration
          </>
        ) : (
          <>
            <PlusCircle /> Add Tool
          </>
        )}
      </Button>

      {/* Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GearSix />
              {hasConfiguredTool ? 'Edit Tool Configuration' : 'Configure New Tool'}
            </DialogTitle>
          </DialogHeader>

          {editingTool && (
            <AgentToolConfigControl
              value={editingTool}
              onChange={setEditingTool}
              hideTypeSelection={true} // Restrict to HTTP for ToolNode
            />
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Tool</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const singleAgentToolControlRenderer = createControlRenderer('SingleAgentTool', SingleAgentToolControl);
