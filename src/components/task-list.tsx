
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Trash2, CheckCircle2, ClipboardList, CalendarIcon, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from 'date-fns'; // Import date-fns functions
import { es } from 'date-fns/locale'; // Import Spanish locale
import { TaskDetailsSheet } from './task-details-sheet'; // Import the new sheet component

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date | null; // Changed to Date | null
  notes?: string; // Add notes field
}

const taskTemplates = [
    "Planificar la semana",
    "Revisar correos electrónicos",
    "Hacer ejercicio",
    "Llamar a [Nombre]",
    "Preparar informe",
    "Leer [Libro/Artículo]",
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  // Load tasks from localStorage on client-side mount
  useEffect(() => {
    setIsClient(true);
    const storedTasks = localStorage.getItem('pomodoroTasks');
    if (storedTasks) {
       try {
        const parsedTasks: any[] = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
            // Revive dates from ISO strings
            const tasksWithDates = parsedTasks.map(task => ({
                ...task,
                dueDate: task.dueDate ? parseISO(task.dueDate) : null,
            }));
            setTasks(tasksWithDates);
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
            // Store dates as ISO strings
            const tasksToStore = tasks.map(task => ({
                ...task,
                dueDate: task.dueDate instanceof Date && isValid(task.dueDate) ? task.dueDate.toISOString() : null,
            }));
            localStorage.setItem('pomodoroTasks', JSON.stringify(tasksToStore));
        } catch (error) {
            console.error("Error saving tasks to localStorage:", error);
        }
    }
  }, [tasks, isClient]);

  const addTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      dueDate: null, // Initialize dueDate as null
      notes: '', // Initialize notes
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
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

  const updateTaskDueDate = (id: number, date: Date | undefined | null) => {
    setTasks(prevTasks => prevTasks.map(task =>
        task.id === id ? { ...task, dueDate: date ?? null } : task
    ));
  };

   const updateTaskDetails = (updatedTask: Task) => {
     setTasks(prevTasks => prevTasks.map(task =>
       task.id === updatedTask.id ? updatedTask : task
     ));
     setIsDetailsSheetOpen(false); // Close sheet after saving
   };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsDetailsSheetOpen(true);
  };

  const handleTemplateSelect = (template: string) => {
      setNewTaskText(template);
      // Optionally focus the input field after selecting a template
      // document.getElementById('new-task-input')?.focus();
  };

  // Server-side rendering placeholder
  if (!isClient) {
    return (
       <Card className="w-full shadow-lg border border-border rounded-lg min-h-[400px]">
        <CardHeader className="pt-6 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Lista de Tareas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          <div className="space-y-4">
            <div className="flex space-x-2">
               <Input disabled placeholder="Añadir nueva tarea..." className="flex-grow" id="new-task-input"/>
               {/* Placeholder for Templates Button */}
               <Button disabled variant="outline" size="icon"><ClipboardList className="h-4 w-4" /></Button>
               <Button disabled><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 p-2 rounded-md">
                   <Checkbox disabled className="rounded shadow-sm" />
                   <div className="flex-grow h-4 bg-muted rounded"></div>
                   {/* Placeholder for Calendar Icon */}
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-50"><CalendarIcon className="h-4 w-4" /></Button>
                   {/* Placeholder for Details Icon */}
                    <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-50"><Info className="h-4 w-4" /></Button>
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
       <Card className="w-full shadow-lg border border-border rounded-lg min-h-[400px] flex flex-col">
        <CardHeader className="pt-6 pb-4 flex-shrink-0">
          <CardTitle className="text-xl font-semibold text-foreground">Lista de Tareas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-2 pb-6 flex-grow overflow-hidden">

           {/* Task Input & Templates */}
          <div className="flex space-x-2 flex-shrink-0 items-center">
            <Input
              id="new-task-input"
              type="text"
              placeholder="Añadir nueva tarea..."
              value={newTaskText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="flex-grow rounded-md shadow-sm transition-shadow focus:shadow-md"
              aria-label="Nueva tarea"
            />
            {/* Templates Dropdown */}
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Plantillas de tareas" className="rounded-md shadow">
                                <ClipboardList className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Usar plantilla</p>
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                    {taskTemplates.map((template, index) => (
                        <DropdownMenuItem key={index} onClick={() => handleTemplateSelect(template)}>
                            {template}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {/* Add Task Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button
                    onClick={addTask}
                    aria-label="Añadir Tarea"
                    className="rounded-md shadow transition-transform duration-150 ease-in-out active:scale-95"
                    disabled={!newTaskText.trim()}
                  >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir tarea (Enter)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Task List */}
          <ScrollArea className="flex-grow pr-4 -mr-4">
             {tasks.length === 0 ? (
               <p className="text-muted-foreground text-center py-10 italic">¡No hay tareas pendientes!</p>
             ) : (
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <li
                      key={task.id}
                      className={cn(
                          "flex items-center space-x-3 p-2 rounded-md transition-all duration-200 ease-in-out group bg-card hover:bg-secondary/70", // Ensure background for hover clarity
                          task.completed ? "opacity-70" : "", // Dim completed tasks
                          "animate-task-appear"
                       )}
                      style={{ '--animation-order': tasks.findIndex(t => t.id === task.id) } as React.CSSProperties}
                      >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        aria-labelledby={`task-label-${task.id}`}
                        className="rounded shadow-sm transition-colors duration-200 flex-shrink-0"
                      />
                      {/* Clickable Task Label Area */}
                      <div
                        className="flex-grow cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <span
                          id={`task-label-${task.id}`}
                          className={cn(
                            "text-sm break-words transition-colors duration-200",
                             task.completed ? "line-through text-muted-foreground italic" : "text-foreground"
                           )}
                        >
                          {task.text}
                        </span>
                         {/* Due Date Display */}
                         {task.dueDate && isValid(task.dueDate) && (
                            <span className="ml-2 text-xs text-muted-foreground">
                                ({format(task.dueDate, 'P', { locale: es })})
                            </span>
                         )}
                      </div>

                       {/* Calendar Popover */}
                       <Popover>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <PopoverTrigger asChild>
                               <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                      "h-7 w-7 text-muted-foreground hover:text-primary transition-all duration-200 rounded-full flex-shrink-0",
                                      "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                                      "hover:scale-110 active:scale-95"
                                  )}
                                  aria-label={`Asignar fecha límite a: ${task.text}`}
                                >
                                 <CalendarIcon className="h-4 w-4" />
                               </Button>
                             </PopoverTrigger>
                           </TooltipTrigger>
                           <TooltipContent side="left">
                             <p>Fecha Límite</p>
                           </TooltipContent>
                         </Tooltip>
                         <PopoverContent className="w-auto p-0" align="end">
                           <Calendar
                             mode="single"
                             selected={task.dueDate ?? undefined}
                             onSelect={(date) => updateTaskDueDate(task.id, date)}
                             initialFocus
                             locale={es}
                           />
                         </PopoverContent>
                       </Popover>

                       {/* Details Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-7 w-7 text-muted-foreground hover:text-blue-500 transition-all duration-200 rounded-full flex-shrink-0",
                                        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                                        "hover:scale-110 active:scale-95"
                                    )}
                                    onClick={() => handleTaskClick(task)}
                                    aria-label={`Ver detalles de: ${task.text}`}
                                >
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Ver Detalles</p>
                            </TooltipContent>
                        </Tooltip>

                      {/* Delete Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                             className={cn(
                               "h-7 w-7 text-muted-foreground hover:text-destructive transition-all duration-200 rounded-full flex-shrink-0",
                                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                               "hover:scale-110 active:scale-95"
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

       {/* Task Details Sheet */}
       {editingTask && (
         <TaskDetailsSheet
           isOpen={isDetailsSheetOpen}
           onOpenChange={setIsDetailsSheetOpen}
           task={editingTask}
           onSave={updateTaskDetails}
         />
       )}

    </TooltipProvider>
  );
}

    