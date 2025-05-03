
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw, Settings, RefreshCw } from 'lucide-react';
import { TimerSettingsModal, type TimerDurations } from './timer-settings';
import { cn } from '@/lib/utils';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

// Default durations in seconds
const DEFAULT_WORK_DURATION = 25 * 60;
const DEFAULT_SHORT_BREAK_DURATION = 5 * 60;
const DEFAULT_LONG_BREAK_DURATION = 15 * 60;

export function PomodoroTimer() {
  const [isClient, setIsClient] = useState(false);
  const [workDuration, setWorkDuration] = useState(DEFAULT_WORK_DURATION);
  const [shortBreakDuration, setShortBreakDuration] = useState(DEFAULT_SHORT_BREAK_DURATION);
  const [longBreakDuration, setLongBreakDuration] = useState(DEFAULT_LONG_BREAK_DURATION);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const longBreakInterval = 4; // Long break after 4 pomodoros
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings and audio only on the client-side
  useEffect(() => {
    setIsClient(true);
    // Load saved durations from localStorage
    const savedWork = localStorage.getItem('pomodoroWorkDuration');
    const savedShort = localStorage.getItem('pomodoroShortBreakDuration');
    const savedLong = localStorage.getItem('pomodoroLongBreakDuration');
    const savedCount = localStorage.getItem('pomodoroCount');


    setWorkDuration(savedWork ? parseInt(savedWork, 10) : DEFAULT_WORK_DURATION);
    setShortBreakDuration(savedShort ? parseInt(savedShort, 10) : DEFAULT_SHORT_BREAK_DURATION);
    setLongBreakDuration(savedLong ? parseInt(savedLong, 10) : DEFAULT_LONG_BREAK_DURATION);
    setPomodoroCount(savedCount ? parseInt(savedCount, 10) : 0);


    // Ensure this runs only in the browser for audio
    if (typeof window !== "undefined") {
      setAudio(new Audio('/timer-end.mp3')); // Assuming you have an audio file in public/
    }
  }, []);

   // Update timeLeft when durations change externally (from settings or initial load)
   useEffect(() => {
       // Update timeLeft only if the timer is not active or if the mode matches the changed duration
       if (!isActive && mode === 'work') {
         setTimeLeft(workDuration);
       }
   }, [workDuration, mode, isActive]); // Rerun if workDuration, mode or isActive changes

   useEffect(() => {
       if (!isActive && mode === 'shortBreak') {
          setTimeLeft(shortBreakDuration);
       }
    }, [shortBreakDuration, mode, isActive]); // Rerun if shortBreakDuration, mode or isActive changes

    useEffect(() => {
        if (!isActive && mode === 'longBreak') {
            setTimeLeft(longBreakDuration);
        }
    }, [longBreakDuration, mode, isActive]); // Rerun if longBreakDuration, mode or isActive changes


  useEffect(() => {
    if (isActive && timeLeft > 0) { // Only run interval if time is left
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer will end, prepare for transition
            return 0; // Set to 0, let the next effect handle the end logic
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
       // Time reached 0 while active, trigger end logic
       handleTimerEnd();
    } else { // Paused or already at 0 and inactive
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isActive, timeLeft]); // Re-run if isActive or timeLeft changes

  // Effect to handle saving pomodoro count to localStorage
  useEffect(() => {
      if (isClient) {
          localStorage.setItem('pomodoroCount', pomodoroCount.toString());
      }
  }, [pomodoroCount, isClient]);


  useEffect(() => {
    // Update document title only on client
    if (isClient) {
        document.title = `${formatTime(timeLeft)} - ${
          mode === 'work' ? 'Trabajo' : mode === 'shortBreak' ? 'Descanso Corto' : 'Descanso Largo'
        } | Tiempo Productivo`;
    }
  }, [timeLeft, mode, isClient]);

  // Reset timer display when mode changes (and timer not active)
  useEffect(() => {
    if (!isActive) {
      resetTimerDisplay(mode);
    }
  }, [mode, isActive]); // Run when mode or isActive changes


  const resetTimerDisplay = (newMode: TimerMode) => {
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
  }


  const handleTimerEnd = () => {
    clearInterval(intervalRef.current!);
    setIsActive(false);

    // Play sound notification only on client
    audio?.play().catch(err => console.error("Error playing sound:", err));

    let nextMode: TimerMode;
    if (mode === 'work') {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      nextMode = newPomodoroCount % longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
    } else {
       nextMode = 'work';
    }
    // Switch mode and reset the timer display for the new mode
    setMode(nextMode);
    // No need to call resetTimerDisplay here, the mode change effect will handle it
  };


  const toggleTimer = () => {
     // If timer reached 0 and we press play again on the same mode, reset it first
    if (timeLeft <= 0 && !isActive) {
      resetTimerDisplay(mode);
    }
    setIsActive(!isActive);
  };

  // Resets the current timer segment
  const resetCurrentTimer = () => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    resetTimerDisplay(mode); // Reset time based on current mode and duration
  };

  // Resets the pomodoro count
   const resetPomodoroCount = () => {
       setPomodoroCount(0);
   };


   // Switches mode and resets the timer
   const switchModeAndReset = (newMode: TimerMode) => {
    // No need to switch if already in the mode
    if (newMode === mode && !isActive) return;

    clearInterval(intervalRef.current!);
    setIsActive(false);
    setMode(newMode);
    // The mode change effect will handle resetting the display
  };


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDurationForMode = (currentMode: TimerMode) => {
    switch (currentMode) {
      case 'work': return workDuration;
      case 'shortBreak': return shortBreakDuration;
      case 'longBreak': return longBreakDuration;
      default: return workDuration; // Fallback
    }
  };

  const handleSaveSettings = (newDurations: TimerDurations) => {
     const newWorkSec = newDurations.work * 60;
     const newShortSec = newDurations.shortBreak * 60;
     const newLongSec = newDurations.longBreak * 60;

     setWorkDuration(newWorkSec);
     setShortBreakDuration(newShortSec);
     setLongBreakDuration(newLongSec);

     // Save to localStorage
     if (isClient) {
       localStorage.setItem('pomodoroWorkDuration', newWorkSec.toString());
       localStorage.setItem('pomodoroShortBreakDuration', newShortSec.toString());
       localStorage.setItem('pomodoroLongBreakDuration', newLongSec.toString());
     }

     // If the timer is not active, update timeLeft immediately for the current mode
     if (!isActive) {
         if (mode === 'work') setTimeLeft(newWorkSec);
         else if (mode === 'shortBreak') setTimeLeft(newShortSec);
         else if (mode === 'longBreak') setTimeLeft(newLongSec);
     } else {
       // Optional: Could provide feedback that changes will apply next cycle
       console.log("Timer activo, los cambios de duración se aplicarán en el próximo ciclo de este tipo o cambio de modo.");
     }

     setIsSettingsOpen(false);
   };


   const totalDuration = getDurationForMode(mode);
   const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : (isActive ? 100 : 0); // Ensure progress is calculated correctly


  return (
    <TooltipProvider delayDuration={100}>
       <Card className="w-full max-w-md shadow-lg border border-border rounded-lg relative overflow-hidden transition-all duration-300">
         <Tooltip>
          <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Configuración del temporizador"
              >
                <Settings className="h-5 w-5" />
              </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Configurar duraciones</p>
          </TooltipContent>
        </Tooltip>

        <CardHeader className="items-center pt-6 pb-4">
           {/* Mode Buttons */}
          <div className="flex space-x-2">
             <Tooltip>
              <TooltipTrigger asChild>
                 <Button
                   variant={mode === 'work' ? 'secondary' : 'ghost'}
                   onClick={() => switchModeAndReset('work')}
                   className={cn("transition-colors duration-200", mode === 'work' && "font-semibold")}
                   aria-pressed={mode === 'work'}
                 >
                   Trabajo
                 </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de trabajo ({workDuration / 60} min)</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                 <Button
                   variant={mode === 'shortBreak' ? 'secondary' : 'ghost'}
                   onClick={() => switchModeAndReset('shortBreak')}
                   className={cn("transition-colors duration-200", mode === 'shortBreak' && "font-semibold")}
                   aria-pressed={mode === 'shortBreak'}
                  >
                   Descanso Corto
                 </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de descanso corto ({shortBreakDuration / 60} min)</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={mode === 'longBreak' ? 'secondary' : 'ghost'}
                  onClick={() => switchModeAndReset('longBreak')}
                  className={cn("transition-colors duration-200", mode === 'longBreak' && "font-semibold")}
                  aria-pressed={mode === 'longBreak'}
                 >
                   Descanso Largo
                </Button>
               </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de descanso largo ({longBreakDuration / 60} min)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4 pb-6">
           {/* Timer Display */}
           <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center border-4 border-border shadow-inner bg-background">
              <div
                 className="absolute inset-0 rounded-full transition-colors duration-500"
                 style={{
                   background: `conic-gradient(hsl(var(--primary)) ${progress}%, transparent ${progress}%)`,
                   opacity: 0.2, // Softer background progress
                 }}
               />
             <div className="text-5xl sm:text-6xl font-mono font-bold text-accent z-10">{formatTime(timeLeft)}</div>
           </div>

           {/* Action Buttons */}
          <div className="flex space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button
                   onClick={toggleTimer}
                   size="lg"
                   variant="default"
                   className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow w-[72px] transition-transform duration-150 ease-in-out active:scale-95"
                   aria-label={isActive ? 'Pausar temporizador' : 'Iniciar temporizador'}
                 >
                   <span className={cn("transition-opacity duration-200", isActive ? "opacity-100" : "opacity-0 absolute")}>
                      <Pause className="h-6 w-6" />
                   </span>
                    <span className={cn("transition-opacity duration-200", !isActive ? "opacity-100" : "opacity-0 absolute")}>
                     <Play className="h-6 w-6" />
                   </span>
                 </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? 'Pausar' : 'Iniciar'} Temporizador</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button
                   onClick={resetCurrentTimer}
                   size="lg"
                   variant="outline"
                   className="rounded-md shadow w-[72px] transition-transform duration-150 ease-in-out active:scale-95"
                   aria-label="Reiniciar temporizador actual"
                  >
                   <RotateCcw className="h-6 w-6 transition-transform duration-300 group-hover:rotate-[-45deg]" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>
                <p>Reiniciar Temporizador Actual</p>
              </TooltipContent>
            </Tooltip>
          </div>
           {/* Pomodoro Count and Reset */}
          <div className="flex items-center space-x-2 pt-2">
            <p className="text-sm text-muted-foreground">Pomodoros completados: {pomodoroCount}</p>
             {pomodoroCount > 0 && (
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button
                     onClick={resetPomodoroCount}
                     variant="ghost"
                     size="icon"
                     className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors duration-200"
                     aria-label="Reiniciar contador de pomodoros"
                   >
                     <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="right">
                   <p>Reiniciar contador</p>
                 </TooltipContent>
               </Tooltip>
             )}
           </div>

        </CardContent>
       </Card>

       {/* Settings Modal */}
       {isClient && ( // Only render modal on client
         <TimerSettingsModal
           isOpen={isSettingsOpen}
           onClose={() => setIsSettingsOpen(false)}
           initialDurations={{
             work: workDuration / 60,
             shortBreak: shortBreakDuration / 60,
             longBreak: longBreakDuration / 60,
           }}
           onSave={handleSaveSettings}
         />
       )}
     </TooltipProvider>
   );
}

