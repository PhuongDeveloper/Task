"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskList({ title, tasks, onTaskClick, onTaskStatusChange, statusIcon }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    onTaskStatusChange(taskId, title);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Use useEffect to ensure tasks are only rendered after hydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // or a suitable loading state
  }

  return (
    <Card onDrop={handleDrop} onDragOver={handleDragOver} className="bg-secondary rounded-lg shadow-md mac-card hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          {statusIcon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tasks && tasks.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(event) => handleDragStart(event, task.id)}
            className={cn(
              "bg-card p-4 rounded-md shadow-sm cursor-grab hover:shadow-lg transition-shadow flex items-center",
              "hover:bg-accent hover:text-accent-foreground active:shadow-inner" // macOS Highlight on Hover
            )}
            onClick={() => onTaskClick(task)}
          >
            <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
            {task.title}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
