
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Load tasks from localStorage on client-side mount
  useEffect(() => {
    setIsClient(true);
    const storedTasks = localStorage.getItem('pomodoroTasks');
    if (storedTasks) {
       try {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks);
        } else {
            console.warn("Stored tasks are not an array, resetting.");
            localStorage.removeItem('pomodoroTasks');
        }
       } catch (error) {
           console.error("Error parsing tasks from localStorage:", error);
           localStorage.removeItem('pomodoroTasks'); // Clear corrupted data
       }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (isClient) {
        try {
            localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving tasks to localStorage:", error);
            // Optionally notify user or handle error
        }
    }
  }, [tasks, isClient]);

  const addTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(), // Use timestamp for a simple unique ID
      text: newTaskText.trim(),
      completed: false,
    };
    // Add task with a subtle animation feel (though CSS handles the real animation)
    setTasks(prevTasks => [newTask, ...prevTasks]); // Add to the top
    setNewTaskText('');
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
     // Optionally add a temporary "deleting" state or animation trigger here
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Server-side rendering placeholder
  if (!isClient) {
    return (
       <Card className="w-full shadow-lg border border-border rounded-lg min-h-[400px]"> {/* Added min-height */}
        <CardHeader className="pt-6 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Lista de Tareas</CardTitle> {/* Adjusted title size */}
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          <div className="space-y-4">
            <div className="flex space-x-2">
               <Input disabled placeholder="Añadir nueva tarea..." className="flex-grow" />
               <Button disabled><Plus className="h-4 w-4" /></Button>
            </div>
             {/* Use Skeleton Loader for a better loading state */}
            <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 p-2 rounded-md">
                   <Checkbox disabled className="rounded shadow-sm" />
                   <div className="flex-grow h-4 bg-muted rounded"></div>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-50"><Trash2 className="h-4 w-4" /></Button>
                 </div>
                <div className="flex items-center space-x-3 p-2 rounded-md">
                   <Checkbox disabled className="rounded shadow-sm" />
                   <div className="flex-grow h-4 bg-muted rounded w-3/4"></div>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-50"><Trash2 className="h-4 w-4" /></Button>
                 </div>
                <div className="flex items-center space-x-3 p-2 rounded-md">
                    <Checkbox disabled className="rounded shadow-sm" />
                    <div className="flex-grow h-4 bg-muted rounded w-1/2"></div>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-50"><Trash2 className="h-4 w-4" /></Button>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Client-side rendering
  return (
    <TooltipProvider delayDuration={100}>
       <Card className="w-full shadow-lg border border-border rounded-lg min-h-[400px] flex flex-col"> {/* Added flex flex-col */}
        <CardHeader className="pt-6 pb-4 flex-shrink-0"> {/* Prevent header shrinking */}
          <CardTitle className="text-xl font-semibold text-foreground">Lista de Tareas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 pt-2 pb-6 flex-grow overflow-hidden"> {/* flex-grow and overflow-hidden */}
          <div className="flex space-x-2 flex-shrink-0"> {/* Prevent input shrinking */}
            <Input
              type="text"
              placeholder="Añadir nueva tarea..."
              value={newTaskText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="flex-grow rounded-md shadow-sm transition-shadow focus:shadow-md"
              aria-label="Nueva tarea"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button
                    onClick={addTask}
                    aria-label="Añadir Tarea"
                    className="rounded-md shadow transition-transform duration-150 ease-in-out active:scale-95"
                    disabled={!newTaskText.trim()} // Disable if input is empty
                  >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir tarea (Enter)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <ScrollArea className="flex-grow pr-4 -mr-4"> {/* Let ScrollArea handle scrolling */}
            {tasks.length === 0 ? (
               <p className="text-muted-foreground text-center py-10 italic">¡Todo listo por hoy!</p>
             ) : (
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <li
                      key={task.id}
                      className={cn(
                          "flex items-center space-x-3 p-2 rounded-md transition-all duration-200 ease-in-out group",
                          task.completed ? "bg-secondary/50" : "hover:bg-secondary", // subtle background on complete
                          "animate-task-appear" // Add appear animation class
                       )}
                      style={{ '--animation-order': tasks.findIndex(t => t.id === task.id) } as React.CSSProperties} // Stagger animation
                      >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        aria-labelledby={`task-label-${task.id}`}
                        className="rounded shadow-sm transition-colors duration-200"
                      />
                      <label
                        id={`task-label-${task.id}`}
                        htmlFor={`task-${task.id}`}
                        className={cn(
                          "flex-grow cursor-pointer text-sm break-words transition-colors duration-200",
                           task.completed ? "line-through text-muted-foreground italic" : "text-foreground"
                         )}
                      >
                         {/* Add icon based on completion state */}
                        {task.completed ? (
                          <CheckCircle2 className="inline-block h-4 w-4 mr-2 text-primary" />
                        ) : (
                          <Circle className="inline-block h-4 w-4 mr-2 text-muted-foreground/50" />
                        )}
                        {task.text}
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                             className={cn(
                               "h-7 w-7 text-muted-foreground hover:text-destructive transition-all duration-200 rounded-full",
                                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100", // Make visible on hover/focus
                               "hover:scale-110 active:scale-95" // Subtle scale animation
                            )}
                            onClick={() => deleteTask(task.id)}
                            aria-label={`Eliminar tarea: ${task.text}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Eliminar tarea</p>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
             )}
          </ScrollArea>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

