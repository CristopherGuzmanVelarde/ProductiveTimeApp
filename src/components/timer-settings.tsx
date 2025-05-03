
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const TimerDurationsSchema = z.object({
  work: z.coerce.number().min(1, "El tiempo de trabajo debe ser al menos 1 minuto.").max(120, "El tiempo de trabajo no puede exceder 120 minutos."),
  shortBreak: z.coerce.number().min(1, "El descanso corto debe ser al menos 1 minuto.").max(30, "El descanso corto no puede exceder 30 minutos."),
  longBreak: z.coerce.number().min(1, "El descanso largo debe ser al menos 1 minuto.").max(60, "El descanso largo no puede exceder 60 minutos."),
});

export type TimerDurations = z.infer<typeof TimerDurationsSchema>;

interface TimerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDurations: TimerDurations;
  onSave: (newDurations: TimerDurations) => void;
}

export function TimerSettingsModal({
  isOpen,
  onClose,
  initialDurations,
  onSave,
}: TimerSettingsModalProps) {
  const form = useForm<TimerDurations>({
    resolver: zodResolver(TimerDurationsSchema),
    defaultValues: initialDurations,
  });

   // Reset form values when initialDurations change (e.g., opening modal again)
   useEffect(() => {
    form.reset(initialDurations);
  }, [initialDurations, form]);

  const onSubmit: SubmitHandler<TimerDurations> = (data) => {
    onSave(data);
  };

  // Prevent closing modal when interacting with the form overlay
   const handleInteractOutside = (event: Event) => {
     event.preventDefault();
   };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={handleInteractOutside} // Keep modal open on background click
        >
        <DialogHeader>
          <DialogTitle>Configuración del Temporizador</DialogTitle>
          <DialogDescription>
            Ajusta la duración de los ciclos de trabajo y descanso (en minutos).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
                control={form.control}
                name="work"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right col-span-1">Trabajo</FormLabel>
                    <FormControl className="col-span-3">
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" /> {/* Position message correctly */}
                  </FormItem>
                )}
             />
             <FormField
                control={form.control}
                name="shortBreak"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right col-span-1">Descanso Corto</FormLabel>
                    <FormControl className="col-span-3">
                      <Input type="number" {...field} />
                    </FormControl>
                     <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
             />
             <FormField
                control={form.control}
                name="longBreak"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right col-span-1">Descanso Largo</FormLabel>
                    <FormControl className="col-span-3">
                      <Input type="number" {...field} />
                    </FormControl>
                     <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
             />
             <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
