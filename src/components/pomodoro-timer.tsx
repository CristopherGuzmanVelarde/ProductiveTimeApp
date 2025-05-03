"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw } from 'lucide-react';

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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [isActive]);

  useEffect(() => {
    resetTimer(mode); // Reset timer when mode changes or durations change
  }, [mode, workDuration, shortBreakDuration, longBreakDuration]);

  const handleTimerEnd = () => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    // Play sound or notification here if desired

    if (mode === 'work') {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      if (newPomodoroCount % longBreakInterval === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = (newMode: TimerMode = mode) => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    setMode(newMode);
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
    }
  };

  const progress = ((getDurationForMode(mode) - timeLeft) / getDurationForMode(mode)) * 100;

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center">
          <CardTitle className="text-2xl">Temporizador Pomodoro</CardTitle>
          <div className="flex space-x-2 mt-4">
            <Button variant={mode === 'work' ? 'secondary' : 'ghost'} onClick={() => resetTimer('work')}>Trabajo</Button>
            <Button variant={mode === 'shortBreak' ? 'secondary' : 'ghost'} onClick={() => resetTimer('shortBreak')}>Descanso Corto</Button>
            <Button variant={mode === 'longBreak' ? 'secondary' : 'ghost'} onClick={() => resetTimer('longBreak')}>Descanso Largo</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="text-7xl font-mono font-bold text-accent">{formatTime(timeLeft)}</div>
          <Progress value={progress} className="w-full h-3" />
          <div className="flex space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleTimer} size="lg" variant="default" className="bg-primary hover:bg-primary/90">
                  {isActive ? <Pause /> : <Play />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? 'Pausar' : 'Iniciar'} Temporizador</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => resetTimer()} size="lg" variant="outline">
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reiniciar Temporizador</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {/* Optional: Add inputs for customizing durations */}
          {/*
          <div className="flex flex-col space-y-2 w-full text-sm mt-4">
            <Label htmlFor="work-duration">Duración Trabajo (min):</Label>
            <Input id="work-duration" type="number" value={workDuration / 60} onChange={(e) => setWorkDuration(parseInt(e.target.value) * 60)} min="1" />
            <Label htmlFor="short-break-duration">Descanso Corto (min):</Label>
            <Input id="short-break-duration" type="number" value={shortBreakDuration / 60} onChange={(e) => setShortBreakDuration(parseInt(e.target.value) * 60)} min="1" />
            <Label htmlFor="long-break-duration">Descanso Largo (min):</Label>
            <Input id="long-break-duration" type="number" value={longBreakDuration / 60} onChange={(e) => setLongBreakDuration(parseInt(e.target.value) * 60)} min="1" />
          </div>
          */}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
