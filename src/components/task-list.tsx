
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CalendarIcon, Info, ClipboardList, Sparkles, PartyPopper, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, parseISO, isValid, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskDetailsSheet } from './task-details-sheet';
import Confetti from 'react-confetti';
import { TimePicker } from './time-picker';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date | null;
  notes?: string;
}

const taskTemplates = [
    "📅 Planificar la semana",
    "📧 Revisar correos electrónicos",
    "🏋️ Hacer ejercicio",
    "📞 Llamar a [Nombre]",
    "📊 Preparar informe",
    "📖 Leer [Libro/Artículo]",
    "🛒 Comprar víveres",
    "🧹 Limpiar la casa",
];

type SortOption = 'default' | 'dueDateAsc' | 'dueDateDesc' | 'completedFirst' | 'completedLast';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);

    const storedTasks = localStorage.getItem('pomodoroTasks');
    if (storedTasks) {
       try {
        const parsedTasks: any[] = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
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
           localStorage.removeItem('pomodoroTasks');
       }
    }

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    if (typeof window !== "undefined") {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
    }
    return () => {
        if (typeof window !== "undefined") {
            window.removeEventListener('resize', handleResize);
        }
    };
  }, []);

  useEffect(() => {
    if (isClient) {
        try {
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

  const sortedTasks = React.useMemo(() => {
    let newTasks = [...tasks];
    switch (sortBy) {
      case 'dueDateAsc':
        newTasks.sort((a, b) => {
          if (a.dueDate === b.dueDate) return 0; // Handles both null or same date
          if (!a.dueDate) return 1; // Tasks without due date go last
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'dueDateDesc':
        newTasks.sort((a, b) => {
          if (a.dueDate === b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
        break;
      case 'completedLast': // Incomplete first
        newTasks.sort((a, b) => (a.completed === b.completed ? (b.id - a.id) : a.completed ? 1 : -1));
        break;
      case 'completedFirst':
        newTasks.sort((a, b) => (a.completed === b.completed ? (b.id - a.id) : a.completed ? -1 : 1));
        break;
      case 'default':
      default:
        newTasks.sort((a, b) => b.id - a.id); // Newest first (by id)
        break;
    }
    return newTasks;
  }, [tasks, sortBy]);

  const addTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      dueDate: null,
      notes: '',
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setNewTaskText('');
  };

  const toggleTaskCompletion = (id: number) => {
    let taskJustCompleted = false;
    setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === id) {
            if (!task.completed) {
                taskJustCompleted = true;
            }
            return { ...task, completed: !task.completed };
        }
        return task;
    }));

    if (taskJustCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const updateTaskDueDate = (id: number, date: Date | undefined | null) => {
    setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === id) {
            let newDueDate = date ? new Date(date) : null;
            if (newDueDate && task.dueDate) {
                newDueDate = setHours(newDueDate, task.dueDate.getHours());
                newDueDate = setMinutes(newDueDate, task.dueDate.getMinutes());
            }
            return { ...task, dueDate: newDueDate };
        }
        return task;
    }));
  };

   const updateTaskDueTime = (id: number, date: Date | undefined | null) => {
       setTasks(prevTasks => prevTasks.map(task =>
           task.id === id ? { ...task, dueDate: date ?? null } : task
       ));
   };

   const updateTaskDetails = (updatedTask: Task) => {
     setTasks(prevTasks => prevTasks.map(task =>
       task.id === updatedTask.id ? updatedTask : task
     ));
     setIsDetailsSheetOpen(false);
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
      const textOnly = template.replace(/^(\p{Emoji}\s*)/u, '');
      setNewTaskText(textOnly);
      document.getElementById('new-task-input')?.focus();
  };

  if (!isClient) {
    return (
       <Card ref={cardRef} className="w-full shadow-lg border border-border rounded-lg min-h-[400px]">
        <CardHeader className="pt-6 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">📝 Lista de Tareas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          <div className="space-y-4">
             {/* Placeholder for Sort Dropdown */}
            <div className="mb-2">
                <div className="h-5 w-20 bg-muted/60 rounded mb-1"></div> {/* Label placeholder */}
                <div className="h-9 w-full sm:w-[240px] bg-muted/60 rounded"></div> {/* Select placeholder */}
            </div>
            <div className="flex space-x-2">
               <Input disabled placeholder="Añadir nueva tarea..." className="flex-grow" id="new-task-input"/>
               <Button disabled variant="outline" size="icon"><ClipboardList className="h-4 w-4" /></Button>
               <Button disabled><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 p-2 rounded-md bg-muted/30">
                   <Checkbox disabled className="rounded shadow-sm" />
                   <div className="flex-grow h-4 bg-muted/60 rounded"></div>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><CalendarIcon className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Clock className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Info className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Trash2 className="h-4 w-4" /></Button>
                 </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-muted/30">
                   <Checkbox disabled className="rounded shadow-sm" />
                   <div className="flex-grow h-4 bg-muted/60 rounded w-2/3"></div>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><CalendarIcon className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Clock className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Info className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Trash2 className="h-4 w-4" /></Button>
                 </div>
             </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
        {showConfetti && isClient && (
           <Confetti
               width={windowSize.width}
               height={windowSize.height}
               recycle={false}
               numberOfPieces={250}
               gravity={0.15}
               initialVelocityY={20}
           />
        )}

       <Card ref={cardRef} className="w-full shadow-lg border border-border rounded-lg min-h-[400px] flex flex-col relative overflow-hidden">
        <CardHeader className="pt-6 pb-4 flex-shrink-0">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
             <span role="img" aria-label="Memo">📝</span>
             Lista de Tareas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-2 pb-6 flex-grow overflow-hidden">

          {/* Sort Dropdown */}
          <div className="flex-shrink-0 mb-2">
            <Label htmlFor="sort-tasks" className="text-xs font-medium text-muted-foreground mb-1 block">Ordenar por:</Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger id="sort-tasks" className="w-full sm:w-[260px] h-9 text-sm" aria-label="Ordenar tareas">
                <SelectValue placeholder="Seleccionar orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Más recientes primero</SelectItem>
                <SelectItem value="dueDateAsc">Fecha límite (más próximas)</SelectItem>
                <SelectItem value="dueDateDesc">Fecha límite (más lejanas)</SelectItem>
                <SelectItem value="completedLast">Estado (pendientes primero)</SelectItem>
                <SelectItem value="completedFirst">Estado (completadas primero)</SelectItem>
              </SelectContent>
            </Select>
          </div>

           {/* Task Input & Templates */}
          <div className="flex space-x-2 flex-shrink-0 items-center">
            <Input
              id="new-task-input"
              type="text"
              placeholder="✨ Añadir nueva tarea mágica..."
              value={newTaskText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="flex-grow rounded-md shadow-sm transition-shadow focus:shadow-md"
              aria-label="Nueva tarea"
            />
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
                <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
                    {taskTemplates.map((template, index) => (
                        <DropdownMenuItem key={index} onClick={() => handleTemplateSelect(template)} className="flex items-center gap-2">
                             <span>{template.split(' ')[0]}</span>
                             <span>{template.substring(template.indexOf(' ') + 1)}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
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

          <ScrollArea className="flex-grow pr-4 -mr-4">
             {sortedTasks.length === 0 ? (
                <div className="text-center py-10 flex flex-col items-center gap-3">
                    <PartyPopper className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground italic">¡Todo listo! 🎉 Añade tu próxima tarea.</p>
                </div>
             ) : (
                <ul className="space-y-3">
                  {sortedTasks.map((task, index) => (
                    <li
                      key={task.id}
                      className={cn(
                          "flex items-center space-x-3 p-2 rounded-md transition-all duration-300 ease-out group bg-card hover:bg-secondary/70",
                          task.completed ? "opacity-60" : "",
                          "animate-task-appear"
                       )}
                      style={{ '--animation-order': index } as React.CSSProperties}
                      >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                         aria-labelledby={`task-label-${task.id}`}
                        className="rounded shadow-sm transition-colors duration-200 flex-shrink-0 transform hover:scale-110 active:scale-95"
                      />
                      <div
                        className="flex-grow cursor-pointer group/label"
                        onClick={(e) => {
                            const target = e.target as HTMLElement;
                            if (target.closest('button, input, [role="checkbox"]')) {
                                return;
                            }
                            handleTaskClick(task);
                        }}
                      >
                        <span
                          id={`task-label-${task.id}`}
                          className={cn(
                            "text-sm break-words transition-all duration-200 group-hover/label:text-primary",
                             task.completed ? "line-through text-muted-foreground italic" : "text-foreground"
                           )}
                        >
                          {task.text}
                           {task.completed && <Sparkles className="inline-block ml-2 h-4 w-4 text-yellow-400" />}
                        </span>
                         {task.dueDate && isValid(task.dueDate) && (
                            <span className={cn(
                                "ml-2 text-xs",
                                task.completed ? "text-muted-foreground/80" : "text-muted-foreground"
                                )}>
                                (🗓️ {format(task.dueDate, 'P p', { locale: es })})
                            </span>
                         )}
                      </div>

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
                                      "hover:scale-110 active:scale-95",
                                      task.completed && "hidden"
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
                            {task.dueDate && (
                              <div className="p-3 border-t border-border">
                                <TimePicker setDate={(date) => updateTaskDueTime(task.id, date)} date={task.dueDate} />
                              </div>
                            )}
                         </PopoverContent>
                       </Popover>

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

    