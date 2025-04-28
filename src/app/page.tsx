"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/task-list";
import { TaskDetails } from "@/components/task-details";
import { TaskCreateDialog } from "@/components/task-create-dialog";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Circle,
  Dot,
  CheckCircle,
  Plus,
  History
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

const getInitialTasks = () => {
  return [
    { title: "Learn React", description: "Read the React documentation", status: "To Do" },
    { title: "Build a Kanban board", description: "Implement drag and drop", status: "In Progress" },
    { title: "Style the app", description: "Use Tailwind CSS for styling", status: "Completed" },
  ];
};

export default function Home() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [initialized, setInitialized] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const [taskHistory, setTaskHistory] = useLocalStorage('taskHistory', []); // Task history
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); // History modal state
  const [date, setDate] = useState<Date | undefined>(new Date()); // Date modal state
  const [clientDate, setClientDate] = useState(''); // Client-side date state
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Ensure getInitialTasks is only called client-side and only once
    if (!initialized) {
      setInitialized(true);
      // Initialize tasks only if localStorage is empty
      if (!tasks || tasks.length === 0) {
        setTasks(getInitialTasks().map(task => ({ ...task, id: uuidv4() })));
      }
    }
  }, [initialized, setTasks, tasks]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setClientDate(format(now, 'dd/MM/yyyy HH:mm'));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setSelectedTask(null);
  };

  const handleTaskCreate = (newTask) => {
    setTasks([...tasks, { ...newTask, id: uuidv4() }]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Task Created",
      description: `Task "${newTask.title}" has been created.`,
    });
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));

      const historyEntry = `Công việc "${task.title}" đã được chuyển sang "${newStatus}" lúc ${clientDate}.`;
      setTaskHistory(prevHistory => [historyEntry, ...prevHistory]);
      toast({
        title: "Task Status Updated",
        description: historyEntry,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex items-center justify-between mb-4">
        <div className="traffic-light-buttons">
          <div className="traffic-light-button traffic-light-red hover:ring-2 ring-red-500" />
          <div className="traffic-light-button traffic-light-yellow hover:ring-2 ring-yellow-500" />
          <div className="traffic-light-button traffic-light-green hover:ring-2 ring-green-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="hover:bg-primary/80 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button variant="secondary" onClick={() => setIsHistoryOpen(true)} className="hover:bg-secondary/80 transition-colors">
            <History className="w-4 h-4 mr-2" />
            Task History
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal hover:bg-accent/80 transition-colors",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskList
          title="To Do"
          tasks={initialized ? tasks.filter(task => task.status === "To Do") : []}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleTaskStatusChange}
          statusIcon={<Circle className="w-4 h-4 mr-2 text-gray-500" />} // Pass status icon as prop
        />
        <TaskList
          title="In Progress"
          tasks={initialized ? tasks.filter(task => task.status === "In Progress") : []}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleTaskStatusChange}
          statusIcon={<Dot className="w-4 h-4 mr-2 text-blue-500" />} // Pass status icon as prop
        />
        <TaskList
          title="Completed"
          tasks={initialized ? tasks.filter(task => task.status === "Completed") : []}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleTaskStatusChange}
          statusIcon={<CheckCircle className="w-4 h-4 mr-2 text-green-500" />} // Pass status icon as prop
        />
      </main>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}

      <TaskCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleTaskCreate}
      />

      {/* Task History Modal */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle>Task History</DialogTitle>
            <DialogDescription>
              Recent changes to your tasks are listed here.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <div className="p-4">
              {taskHistory.length === 0 ? (
                <p>No task history available.</p>
              ) : (
                taskHistory.map((entry, index) => (
                  <p key={index} className="mb-2 last:mb-0">{entry}</p>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Clock */}
      <div className="fixed bottom-4 right-4 bg-secondary text-secondary-foreground rounded-md p-2 shadow-md">
        {currentTime}
      </div>

      <div id="portal" />
    </div>
  );
}
