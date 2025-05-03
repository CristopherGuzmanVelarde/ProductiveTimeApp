
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
import { Plus, Trash2, CalendarIcon, Info, ClipboardList, Sparkles, PartyPopper } from 'lucide-react'; // Added Sparkles, PartyPopper
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from 'date-fns'; // Import date-fns functions
import { es } from 'date-fns/locale'; // Import Spanish locale
import { TaskDetailsSheet } from './task-details-sheet'; // Import the new sheet component
// Import a confetti library (example: react-confetti)
// You might need to install it: npm install react-confetti
import Confetti from 'react-confetti';


export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date | null; // Changed to Date | null
  notes?: string; // Add notes field
}

// Added emojis to templates
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

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [taskCompleteAudio, setTaskCompleteAudio] = useState<HTMLAudioElement | null>(null); // State for completion audio
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti animation
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 }); // State for confetti bounds

  // Ref for the card element to get confetti bounds (optional, can use window size)
  const cardRef = useRef<HTMLDivElement>(null);

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

     // Load completion sound - run only on client
     // NOTE: Assumes 'task-complete.mp3' exists in the public folder
    if (typeof window !== "undefined") {
        try {
            const audio = new Audio('/task-complete.mp3');
            setTaskCompleteAudio(audio);
        } catch (error) {
            console.error("Error loading task complete audio:", error);
        }
        // Set initial window size for confetti
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        // Update window size on resize
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // Cleanup listener
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
    let taskJustCompleted = false;
    setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === id) {
            if (!task.completed) { // Task is being marked as complete
                taskJustCompleted = true;
            }
            return { ...task, completed: !task.completed };
        }
        return task;
    }));

    if (taskJustCompleted) {
        // Play sound
        taskCompleteAudio?.play().catch(err => console.error("Error playing task complete sound:", err));
        // Trigger confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // Show confetti for 4 seconds
    }
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
    // Only open details if the task itself (not checkbox/buttons) is clicked
    setEditingTask(task);
    setIsDetailsSheetOpen(true);
  };

  const handleTemplateSelect = (template: string) => {
      // Remove leading emoji before setting input value
      const textOnly = template.replace(/^(\p{Emoji}\s*)/u, '');
      setNewTaskText(textOnly);
      // Optionally focus the input field after selecting a template
      document.getElementById('new-task-input')?.focus();
  };

  // Server-side rendering placeholder
  if (!isClient) {
    return (
       <Card ref={cardRef} className="w-full shadow-lg border border-border rounded-lg min-h-[400px]">
        <CardHeader className="pt-6 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">📝 Lista de Tareas</CardTitle>
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
                {/* Placeholder Task Item */}
                <div className="flex items-center space-x-3 p-2 rounded-md bg-muted/30">
                   <Checkbox disabled className="rounded shadow-sm" />
                   <div className="flex-grow h-4 bg-muted/60 rounded"></div>
                   {/* Placeholder Icons */}
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><CalendarIcon className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Info className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Trash2 className="h-4 w-4" /></Button>
                 </div>
                 {/* Another Placeholder */}
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-muted/30">
                   <Checkbox disabled className="rounded shadow-sm" />
                   <div className="flex-grow h-4 bg-muted/60 rounded w-2/3"></div>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><CalendarIcon className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Info className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" disabled className="h-7 w-7 opacity-30"><Trash2 className="h-4 w-4" /></Button>
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
        {/* Confetti Overlay */}
        {showConfetti && isClient && (
           <Confetti
               width={windowSize.width}
               height={windowSize.height}
               recycle={false}
               numberOfPieces={250} // Adjust number of pieces
               gravity={0.15} // Adjust gravity
               initialVelocityY={20}
           />
        )}

       <Card ref={cardRef} className="w-full shadow-lg border border-border rounded-lg min-h-[400px] flex flex-col relative overflow-hidden"> {/* Added relative overflow-hidden */}
        <CardHeader className="pt-6 pb-4 flex-shrink-0">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
             <span role="img" aria-label="Memo">📝</span> {/* Emoji in Title */}
             Lista de Tareas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-2 pb-6 flex-grow overflow-hidden">

           {/* Task Input & Templates */}
          <div className="flex space-x-2 flex-shrink-0 items-center">
            <Input
              id="new-task-input"
              type="text"
              placeholder="✨ Añadir nueva tarea mágica..." /* Playful placeholder */
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
                <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto"> {/* Added scroll for many templates */}
                    {taskTemplates.map((template, index) => (
                        <DropdownMenuItem key={index} onClick={() => handleTemplateSelect(template)} className="flex items-center gap-2">
                            {/* Displaying emoji from template string */}
                             <span>{template.split(' ')[0]}</span>
                             <span>{template.substring(template.indexOf(' ') + 1)}</span>
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
                <div className="text-center py-10 flex flex-col items-center gap-3">
                    <PartyPopper className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground italic">¡Todo listo! 🎉 Añade tu próxima tarea.</p>
                </div>
             ) : (
                <ul className="space-y-3">
                  {tasks.map((task, index) => ( // Added index for animation delay
                    <li
                      key={task.id}
                      className={cn(
                          "flex items-center space-x-3 p-2 rounded-md transition-all duration-300 ease-out group bg-card hover:bg-secondary/70", // Slower transition
                          task.completed ? "opacity-60" : "", // Slightly less dim for completed
                          "animate-task-appear" // Use animation class from globals.css
                       )}
                      style={{ '--animation-order': index } as React.CSSProperties} // Set custom property for stagger
                      >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) => {
                            // Prevent toggling back if animation is running (optional)
                            // if (showConfetti) return;
                            toggleTaskCompletion(task.id);
                         }}
                         aria-labelledby={`task-label-${task.id}`}
                        className="rounded shadow-sm transition-colors duration-200 flex-shrink-0 transform hover:scale-110 active:scale-95" // Checkbox animation
                      />
                      {/* Clickable Task Label Area */}
                      <div
                        className="flex-grow cursor-pointer group/label" // Added group for label hover effect
                        onClick={(e) => {
                            // Prevent triggering details sheet if clicking on interactive elements within
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
                            "text-sm break-words transition-all duration-200 group-hover/label:text-primary", // Highlight on label hover
                             task.completed ? "line-through text-muted-foreground italic" : "text-foreground"
                           )}
                        >
                          {task.text}
                           {/* Sparkle emoji for completed tasks */}
                           {task.completed && <Sparkles className="inline-block ml-2 h-4 w-4 text-yellow-400" />}
                        </span>
                         {/* Due Date Display */}
                         {task.dueDate && isValid(task.dueDate) && (
                            <span className={cn(
                                "ml-2 text-xs",
                                task.completed ? "text-muted-foreground/80" : "text-muted-foreground"
                                )}>
                                (🗓️ {format(task.dueDate, 'P', { locale: es })}) {/* Date emoji */}
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
                                      "opacity-0 group-hover:opacity-100 focus-visible:opacity-100", // Fade in on hover/focus
                                      "hover:scale-110 active:scale-95",
                                      task.completed && "hidden" // Hide calendar if completed
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
                                        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100", // Fade in
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
                                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100", // Fade in
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
