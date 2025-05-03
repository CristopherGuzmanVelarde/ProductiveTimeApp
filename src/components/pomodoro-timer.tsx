"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { TimerSettingsModal, type TimerDurations } from './timer-settings';

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

    setWorkDuration(savedWork ? parseInt(savedWork, 10) : DEFAULT_WORK_DURATION);
    setShortBreakDuration(savedShort ? parseInt(savedShort, 10) : DEFAULT_SHORT_BREAK_DURATION);
    setLongBreakDuration(savedLong ? parseInt(savedLong, 10) : DEFAULT_LONG_BREAK_DURATION);

    // Ensure this runs only in the browser for audio
    if (typeof window !== "undefined") {
      setAudio(new Audio('/timer-end.mp3')); // Assuming you have an audio file in public/
    }
  }, []);

   // Update timeLeft when durations change externally (from settings or initial load)
   useEffect(() => {
       // Update timeLeft only if the timer is not active or if the mode matches the changed duration
       if (!isActive || mode === 'work') {
         setTimeLeft(workDuration);
       }
   }, [workDuration]); // Rerun only if workDuration changes

   useEffect(() => {
       if (!isActive || mode === 'shortBreak') {
          setTimeLeft(shortBreakDuration);
       }
    }, [shortBreakDuration]); // Rerun only if shortBreakDuration changes

    useEffect(() => {
        if (!isActive || mode === 'longBreak') {
            setTimeLeft(longBreakDuration);
        }
    }, [longBreakDuration]); // Rerun only if longBreakDuration changes


  useEffect(() => {
    if (isActive && timeLeft > 0) { // Only run interval if time is left
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isActive || timeLeft <= 0) { // Clear interval if paused or time runs out
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isActive, timeLeft]); // Re-run if isActive or timeLeft changes

  useEffect(() => {
    // Update document title only on client
    if (isClient) {
        document.title = `${formatTime(timeLeft)} - ${
          mode === 'work' ? 'Trabajo' : mode === 'shortBreak' ? 'Descanso Corto' : 'Descanso Largo'
        } | Tiempo Productivo`;
    }
  }, [timeLeft, mode, isClient]);

  useEffect(() => {
    // Reset timer display when mode changes, but only if not active
    // If active, the timer continues until completion before mode switch effects take place
    if (!isActive) {
      resetTimerDisplay(mode);
    }
  }, [mode]); // Run only when mode changes

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
    resetTimerDisplay(nextMode); // Explicitly set time for the next mode
  };


  const toggleTimer = () => {
     // If timer reached 0 and we press play again on the same mode, reset it first
    if (timeLeft <= 0 && !isActive) {
      resetTimerDisplay(mode);
    }
    setIsActive(!isActive);
  };

  // Resets the current timer segment and optionally the pomodoro count
  const resetCurrentTimer = (resetCount = false) => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    resetTimerDisplay(mode); // Reset time based on current mode and duration
    if (resetCount && mode === 'work') {
        setPomodoroCount(0); // Reset count only when explicitly asked during work mode reset
    }
  };

   // Switches mode and resets the timer
   const switchModeAndReset = (newMode: TimerMode) => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    setMode(newMode);
    resetTimerDisplay(newMode);
    // Optionally reset pomodoro count if switching back to work manually
    // if (newMode === 'work') setPomodoroCount(0);
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


     // If the current mode's duration changed, update timeLeft immediately IF timer is not active
     if (!isActive) {
       if (mode === 'work') setTimeLeft(newWorkSec);
       else if (mode === 'shortBreak') setTimeLeft(newShortSec);
       else if (mode === 'longBreak') setTimeLeft(newLongSec);
     } else {
       // If timer is active, let it finish the current cycle, duration change will apply on next cycle
       // Or, optionally, ask the user if they want to restart the current cycle with the new duration
       // For simplicity, we let it finish. The progress bar might look odd briefly.
       console.log("Timer active, duration change will apply on the next cycle of this type or mode switch.");
     }


     setIsSettingsOpen(false);
   };


   const progress = timeLeft > 0 ? ((getDurationForMode(mode) - timeLeft) / getDurationForMode(mode)) * 100 : (isActive ? 100 : 0); // Show 100% briefly when timer ends


  return (
    <TooltipProvider>
       <Card className="w-full max-w-md shadow-lg border border-border rounded-lg relative">
         <Tooltip>
          <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Configuración del temporizador"
              >
                <Settings className="h-5 w-5" />
              </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Configurar duraciones</p>
          </TooltipContent>
        </Tooltip>

        <CardHeader className="items-center pt-6 pb-4">
          {/* <CardTitle className="text-2xl font-semibold text-foreground">Temporizador Pomodoro</CardTitle> */}
           {/* Mode Buttons */}
          <div className="flex space-x-2 mt-4">
             <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant={mode === 'work' ? 'secondary' : 'ghost'} onClick={() => switchModeAndReset('work')}>Trabajo</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de trabajo ({workDuration / 60} min)</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant={mode === 'shortBreak' ? 'secondary' : 'ghost'} onClick={() => switchModeAndReset('shortBreak')}>Descanso Corto</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de descanso corto ({shortBreakDuration / 60} min)</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={mode === 'longBreak' ? 'secondary' : 'ghost'} onClick={() => switchModeAndReset('longBreak')}>Descanso Largo</Button>
               </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar a modo de descanso largo ({longBreakDuration / 60} min)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4 pb-6">
          <div className="text-7xl font-mono font-bold text-accent">{formatTime(timeLeft)}</div>
          <Progress value={progress} className="w-full h-3 rounded-full" />
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleTimer} size="lg" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow w-[72px]">
                   {/* Give button fixed width to prevent layout shift */}
                  {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? 'Pausar' : 'Iniciar'} Temporizador</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button onClick={() => resetCurrentTimer()} size="lg" variant="outline" className="rounded-md shadow w-[72px]">
                   {/* Give button fixed width */}
                   <RotateCcw className="h-6 w-6" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>
                <p>Reiniciar Temporizador Actual</p>
              </TooltipContent>
            </Tooltip>
          </div>
           <p className="text-sm text-muted-foreground pt-2">Pomodoros completados: {pomodoroCount}</p>
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
