
"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null); // Assuming no seconds for simplicity, but can be added

  const handleHourChange = (value: number) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(value);
    setDate(newDate);
  };

  const handleMinuteChange = (value: number) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setMinutes(value);
    setDate(newDate);
  };

  return (
    <div className={cn("flex items-end gap-2", className)}>
       <div className="grid gap-1 text-center">
         <Label htmlFor="hours" className="text-xs">
           Horas
         </Label>
         <TimePickerInput
           picker="hours"
           date={date}
           setDate={setDate}
           ref={hourRef}
           onRightFocus={() => minuteRef.current?.focus()}
         />
       </div>
       <div className="grid gap-1 text-center">
         <Label htmlFor="minutes" className="text-xs">
           Minutos
         </Label>
         <TimePickerInput
           picker="minutes"
           date={date}
           setDate={setDate}
           ref={minuteRef}
           onLeftFocus={() => hourRef.current?.focus()}
           // onRightFocus={() => secondRef.current?.focus()} // If seconds were included
         />
       </div>
      {/* Separator - can be styled or just a simple div */}
      <div className="flex h-10 items-center text-lg text-muted-foreground pb-1">:</div>
      {/* Seconds picker can be added here if needed */}
    </div>
  );
}
