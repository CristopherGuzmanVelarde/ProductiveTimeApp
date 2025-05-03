"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw } from 'lucide-react';
// Uncomment if allowing duration customization
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 minutes
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60); // 5 minutes
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60); // 15 minutes
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const longBreakInterval = 4; // Long break after 4 pomodoros
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);


  const intervalRef = useRef<NodeJS.Timeout | null>(null);

   // Load audio only on the client-side
   useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== "undefined") {
      setAudio(new Audio('/timer-end.mp3')); // Assuming you have an audio file in public/
    }
  }, []);


  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isActive]); // Only re-run if isActive changes

  useEffect(() => {
    // Update timer display and potentially document title
    document.title = `${formatTime(timeLeft)} - ${
      mode === 'work' ? 'Trabajo' : mode === 'shortBreak' ? 'Descanso Corto' : 'Descanso Largo'
    } | Tiempo Productivo`;

    // Reset timer when mode changes or durations change externally (though duration inputs are commented out)
    resetTimer(mode, false); // Don't reset pomodoro count on mode change alone
  }, [mode, workDuration, shortBreakDuration, longBreakDuration]); // Re-run if these change

   useEffect(() => {
    // This effect specifically handles the initial timer setting based on mode
    resetTimer(mode, false);
  }, [mode]); // Run only when mode changes


  const handleTimerEnd = () => {
    clearInterval(intervalRef.current!);
    setIsActive(false);

    // Play sound notification
    audio?.play().catch(err => console.error("Error playing sound:", err));


    let nextMode: TimerMode;
    if (mode === 'work') {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      if (newPomodoroCount % longBreakInterval === 0) {
        nextMode = 'longBreak';
      } else {
        nextMode = 'shortBreak';
      }
    } else {
       nextMode = 'work';
    }
     // Switch mode *after* current timer logic completes
     setMode(nextMode); // This triggers the useEffect for mode change
  };


  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = (newMode: TimerMode = mode, resetCount = true) => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    setMode(newMode); // Ensure mode is updated if called externally
    if (resetCount && newMode === 'work') {
        setPomodoroCount(0); // Reset count only when explicitly resetting to 'work'
    }
    switch (newMode) {
      case 'work':
        setTimeLeft(workDuration);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakDuration);
        break;
      case 'longBreak':
        setTimeLeft(longBreakDuration);
        break;
    }
  };


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getDurationForMode = (currentMode: TimerMode) => {
    switch (currentMode) {
      case 'work': return workDuration;
      case 'shortBreak': return shortBreakDuration;
      case 'longBreak': return longBreakDuration;
      default: return workDuration; // Fallback
    }
  };


  const progress = timeLeft > 0 ? ((getDurationForMode(mode) - timeLeft) / getDurationForMode(mode)) * 100 : 0;


  return (
    <TooltipProvider>
      <Card className="w-full max-w-md shadow-lg border border-border rounded-lg">
        <CardHeader className="items-center pt-6 pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">Temporizador Pomodoro</CardTitle>
          <div className="flex space-x-2 mt-4">
             <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant={mode === 'work' ? 'secondary' : 'ghost'} onClick={() => resetTimer('work')}>Trabajo</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de trabajo (25 min)</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant={mode === 'shortBreak' ? 'secondary' : 'ghost'} onClick={() => resetTimer('shortBreak')}>Descanso Corto</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de descanso corto (5 min)</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={mode === 'longBreak' ? 'secondary' : 'ghost'} onClick={() => resetTimer('longBreak')}>Descanso Largo</Button>
               </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de descanso largo (15 min)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4 pb-6">
          <div className="text-7xl font-mono font-bold text-accent">{formatTime(timeLeft)}</div>
          <Progress value={progress} className="w-full h-3 rounded-full" />
          <div className="flex space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleTimer} size="lg" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow">
                  {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? 'Pausar' : 'Iniciar'} Temporizador</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button onClick={() => resetTimer(mode)} size="lg" variant="outline" className="rounded-md shadow">
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reiniciar Temporizador Actual ({mode === 'work' ? 'Trabajo' : mode === 'shortBreak' ? 'Descanso Corto' : 'Descanso Largo'})</p>
              </TooltipContent>
            </Tooltip>
          </div>
           <p className="text-sm text-muted-foreground">Pomodoros completados: {pomodoroCount}</p>

          {/* Optional: Add inputs for customizing durations */}
          {/*
          <div className="flex flex-col space-y-2 w-full text-sm mt-4 pt-4 border-t border-border">
             <h3 className="text-center font-medium mb-2">Personalizar Duraciones</h3>
            <div className="flex items-center justify-between">
               <Label htmlFor="work-duration" className="flex-1">Trabajo (min):</Label>
               <Input id="work-duration" type="number" value={workDuration / 60} onChange={(e) => setWorkDuration(Math.max(1, parseInt(e.target.value) || 25) * 60)} min="1" className="w-20" />
            </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="short-break-duration" className="flex-1">Descanso Corto (min):</Label>
               <Input id="short-break-duration" type="number" value={shortBreakDuration / 60} onChange={(e) => setShortBreakDuration(Math.max(1, parseInt(e.target.value) || 5) * 60)} min="1" className="w-20" />
             </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="long-break-duration" className="flex-1">Descanso Largo (min):</Label>
              <Input id="long-break-duration" type="number" value={longBreakDuration / 60} onChange={(e) => setLongBreakDuration(Math.max(1, parseInt(e.target.value) || 15) * 60)} min="1" className="w-20" />
            </div>
           </div>
          */}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
