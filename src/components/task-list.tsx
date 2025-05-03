"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2 } from 'lucide-react';
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
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskText('');
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
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
               <Button disabled><Plus /></Button>
            </div>
            <p className="text-muted-foreground text-center py-4">Cargando tareas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Client-side rendering
  return (
    <TooltipProvider>
        {/* Removed flex properties, let Tabs component handle layout */}
       <Card className="w-full shadow-lg border border-border rounded-lg min-h-[400px]"> {/* Added min-height */}
        <CardHeader className="pt-6 pb-4">
           {/* Adjusted title size for consistency */}
          <CardTitle className="text-xl font-semibold text-foreground">Lista de Tareas</CardTitle>
        </CardHeader>
         {/* Adjusted padding and structure for better fit in Tabs */}
        <CardContent className="flex flex-col space-y-4 pt-2 pb-6 h-[calc(400px-80px)]"> {/* Calculate height based on min-height and header */}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Añadir nueva tarea..."
              value={newTaskText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="flex-grow rounded-md shadow-sm"
              aria-label="Nueva tarea"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={addTask} aria-label="Añadir Tarea" className="rounded-md shadow">
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir nueva tarea (o presiona Enter)</p>
              </TooltipContent>
            </Tooltip>
          </div>
           {/* Use flex-grow on ScrollArea for dynamic height */}
          <ScrollArea className="flex-grow pr-4 -mr-4">
            {tasks.length === 0 ? (
               <p className="text-muted-foreground text-center py-4">No hay tareas pendientes.</p>
             ) : (
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <li key={task.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary transition-colors group">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        aria-labelledby={`task-label-${task.id}`}
                        className="rounded shadow-sm"
                      />
                      <label
                        id={`task-label-${task.id}`}
                        htmlFor={`task-${task.id}`}
                        className={cn(
                          "flex-grow cursor-pointer text-sm break-words", // Allow text wrapping
                          task.completed ? "line-through text-muted-foreground" : "text-foreground"
                        )}
                      >
                        {task.text}
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full" // Make visible on hover/focus
                            onClick={() => deleteTask(task.id)}
                            aria-label={`Eliminar tarea: ${task.text}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar esta tarea</p>
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
