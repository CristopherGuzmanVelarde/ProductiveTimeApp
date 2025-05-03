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
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const addTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  if (!isClient) {
    // Render placeholder or loading state on server
    return (
       <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Lista de Tareas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cargando tareas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full shadow-lg flex flex-col h-full max-h-[600px]">
        <CardHeader>
          <CardTitle className="text-2xl">Lista de Tareas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow space-y-4 overflow-hidden">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Añadir nueva tarea..."
              value={newTaskText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="flex-grow"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={addTask} aria-label="Añadir Tarea">
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir nueva tarea</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <ScrollArea className="flex-grow pr-4">
            <ul className="space-y-3">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary transition-colors">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    aria-labelledby={`task-label-${task.id}`}
                  />
                  <label
                    id={`task-label-${task.id}`}
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      "flex-grow cursor-pointer text-sm",
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
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Eliminar tarea ${task.text}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eliminar tarea</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
              {tasks.length === 0 && (
                 <p className="text-muted-foreground text-center py-4">No hay tareas pendientes.</p>
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
