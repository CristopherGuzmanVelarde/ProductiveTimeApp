
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
import { CalendarIcon, Save } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Task } from './task-list'; // Import Task type

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

  // Update local state if the task prop changes (e.g., opening sheet with a different task)
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
     setEditedTask(prev => ({ ...prev, dueDate: date ?? null }));
  };

  const handleSaveChanges = () => {
    onSave(editedTask);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col">
        <SheetHeader>
          <SheetTitle>Detalles de la Tarea</SheetTitle>
          <SheetDescription>
            Edita el nombre, añade notas o asigna una fecha límite.
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

           {/* Due Date */}
          <div className="grid gap-2">
             <Label>Fecha Límite</Label>
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
                      ? format(editedTask.dueDate, 'PPP', { locale: es })
                     : <span>Seleccionar fecha</span>}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                 <Calendar
                   mode="single"
                   selected={editedTask.dueDate ?? undefined}
                   onSelect={handleDateChange}
                   initialFocus
                   locale={es}
                 />
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

    