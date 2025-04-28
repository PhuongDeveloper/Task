"use client";

import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskDetails({ task, onClose, onUpdate, onDelete }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleUpdateTask = () => {
    onUpdate(editedTask);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirmation = () => {
    onDelete(task.id);
    setIsDeleteDialogOpen(false);
    onClose();
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task?.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {task?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 mt-4">
          {task?.status === "Completed" && (
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="hover:bg-destructive/80 transition-colors">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button size="sm" onClick={() => setIsEditDialogOpen(true)} className="hover:bg-primary/80 transition-colors">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl shadow-lg">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the task details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-right inline-block w-16">Title</label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={editedTask.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-right inline-block w-16">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedTask.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)} className="hover:bg-secondary/80 transition-colors">
                Cancel
              </Button>
              <Button type="submit" onClick={handleUpdateTask} className="hover:bg-primary/80 transition-colors">
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md shadow-lg">
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>Are you sure you want to delete this task? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)} className="hover:bg-secondary/80 transition-colors">
                Cancel
              </Button>
              <Button type="submit" variant="destructive" onClick={handleDeleteConfirmation} className="hover:bg-destructive/80 transition-colors">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
