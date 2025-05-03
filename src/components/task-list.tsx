"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  // Optional: Add date if you want to link tasks to dates
  // date?: Date | string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // State for selected date

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
      // Optional: Assign selected date
      // date: selectedDate?.toISOString().split('T')[0], // Store as YYYY-MM-DD string
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

  // Filter tasks based on selected date (optional, uncomment if needed)
  // const filteredTasks = tasks.filter(task => {
  //   if (!selectedDate) return true; // Show all if no date selected
  //   if (!task.date) return false; // Hide tasks without dates if a date is selected
  //   const taskDate = new Date(task.date + 'T00:00:00'); // Ensure comparison is date-only
  //   const selected = new Date(selectedDate.toDateString()); // Ensure comparison is date-only
  //   return taskDate.getTime() === selected.getTime();
  // });

  // Server-side rendering placeholder
  if (!isClient) {
    return (
       <Card className="w-full shadow-lg border border-border rounded-lg min-h-[400px]"> {/* Added min-height */}
        <CardHeader className="pt-6 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Lista de Tareas</CardTitle> {/* Adjusted title size */}
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          <div className="space-y-4">
            {/* Placeholder for Calendar */}
            <div className="flex justify-center mb-4">
               <div className="w-[280px] h-[310px] bg-muted rounded-md p-3 animate-pulse"></div>
            </div>
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
                {/* Add more skeleton items if desired */}
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
        <CardContent className="flex flex-col gap-6 pt-2 pb-6 flex-grow overflow-hidden"> {/* Increased gap */}
           {/* Calendar */}
           <div className="flex justify-center flex-shrink-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow-sm p-3 bg-card" // Added styling
              />
            </div>

           {/* Task Input */}
          <div className="flex space-x-2 flex-shrink-0">
            <Input
              type="text"
              placeholder="Añadir nueva tarea para hoy..." // Updated placeholder
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

          {/* Task List */}
          <ScrollArea className="flex-grow pr-4 -mr-4">
             {/* Use filteredTasks here if implementing date filtering */}
             {tasks.length === 0 ? (
               <p className="text-muted-foreground text-center py-10 italic">¡No hay tareas para hoy!</p> // Updated empty state
             ) : (
                <ul className="space-y-3">
                  {/* Use filteredTasks.map if implementing filtering */}
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
                        ) : null}
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
