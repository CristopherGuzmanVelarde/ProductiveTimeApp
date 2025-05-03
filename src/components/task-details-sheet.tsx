
'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Clock } from 'lucide-react'; // Added Clock
import { cn } from "@/lib/utils";
import { format, isValid, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Task } from './task-list'; // Import Task type
import { TimePicker } from './time-picker'; // Import TimePicker

interface TaskDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: Task;
  onSave: (updatedTask: Task) => void;
}

export function TaskDetailsSheet({
  isOpen,
  onOpenChange,
  task,
  onSave,
}: TaskDetailsSheetProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isClient, setIsClient] = useState(false); // State for client-side rendering

  useEffect(() => {
    setIsClient(true); // Mark as client-side after mount
  }, []);

  // Update local state if the task prop changes (e.g., opening sheet with a different task)
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
     // Keep existing time when date is selected or changed
     let newDueDate = date ? new Date(date) : null;
     if (newDueDate && editedTask.dueDate) {
         newDueDate = setHours(newDueDate, editedTask.dueDate.getHours());
         newDueDate = setMinutes(newDueDate, editedTask.dueDate.getMinutes());
     }
     setEditedTask(prev => ({ ...prev, dueDate: newDueDate }));
  };

  const handleTimeChange = (date: Date | undefined) => {
     // Update only the time part of the existing date or set new if no date
     let newDueDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date(); // Use today if no date exists
     if (date) {
         newDueDate = setHours(newDueDate, date.getHours());
         newDueDate = setMinutes(newDueDate, date.getMinutes());
     } else {
         // If time is cleared, maybe reset time? Or handle as needed.
         // For now, let's just update the state with null or the existing date without time changes if 'date' is undefined.
         newDueDate = editedTask.dueDate; // Keep existing date/time
     }
     setEditedTask(prev => ({ ...prev, dueDate: newDueDate ?? null }));
  };


  const handleSaveChanges = () => {
    onSave(editedTask);
  };

  // Prevent rendering potentially mismatching HTML on server
  if (!isClient) {
      return null; // Or a basic loading state
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col">
        <SheetHeader>
          <SheetTitle>Detalles de la Tarea</SheetTitle>
          <SheetDescription>
            Edita el nombre, añade notas o asigna una fecha y hora límite.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-6 -mr-6"> {/* Add scroll and padding */}
           {/* Task Name */}
          <div className="grid gap-2">
             <Label htmlFor="task-name">Nombre de la tarea</Label>
             <Input
               id="task-name"
               name="text"
               value={editedTask.text}
               onChange={handleInputChange}
               className="text-base"
             />
           </div>

           {/* Task Notes */}
          <div className="grid gap-2">
             <Label htmlFor="task-notes">Notas</Label>
             <Textarea
               id="task-notes"
               name="notes"
               value={editedTask.notes ?? ''}
               onChange={handleInputChange}
               placeholder="Añade notas o detalles adicionales..."
               rows={4}
               className="text-base"
             />
           </div>

           {/* Due Date & Time */}
           <div className="grid gap-2">
                <Label>Fecha y Hora Límite</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !editedTask.dueDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editedTask.dueDate && isValid(editedTask.dueDate)
                                ? format(editedTask.dueDate, 'PPP p', { locale: es }) // Format with date and time
                                : <span>Seleccionar fecha y hora</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={editedTask.dueDate ?? undefined}
                            onSelect={handleDateChange} // Updates the date part
                            initialFocus
                            locale={es}
                        />
                        {/* Time Picker shown below the calendar */}
                        <div className="p-3 border-t border-border">
                            <TimePicker
                                setDate={handleTimeChange} // Updates the time part
                                date={editedTask.dueDate ?? undefined}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
           </div>
        </div>

        <SheetFooter className="mt-auto pt-4 border-t"> {/* Ensure footer is at bottom */}
          <SheetClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </SheetClose>
          <Button type="button" onClick={handleSaveChanges}>
             <Save className="mr-2 h-4 w-4" /> Guardar Cambios
           </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
