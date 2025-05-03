
'use client'; // Add 'use client' directive

import { PomodoroTimer } from "@/components/pomodoro-timer";
import { TaskList } from "@/components/task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ListChecks } from "lucide-react";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 lg:p-24 bg-background transition-colors duration-300">
      <div className="text-center mb-10">
         <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground animate-fade-in">Tiempo Productivo</h1>
         <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in animation-delay-200">
             Maximiza tu enfoque con el temporizador Pomodoro y gestiona tus tareas eficientemente.
         </p>
      </div>

      <Tabs defaultValue="timer" className="w-full max-w-2xl animate-fade-in animation-delay-400">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/60 backdrop-blur-sm">
          <TabsTrigger value="timer" className="group gap-2 transition-colors duration-200"> {/* Added group class */}
             <Clock className="h-5 w-5 transition-transform duration-200 group-data-[state=active]:rotate-[15deg]" />
             Temporizador
          </TabsTrigger>
          <TabsTrigger value="tasks" className="group gap-2 transition-colors duration-200"> {/* Added group class */}
             <ListChecks className="h-5 w-5 transition-transform duration-200 group-data-[state=active]:scale-110" />
             Tareas
           </TabsTrigger>
        </TabsList>
        <TabsContent value="timer">
           {/* Centering the Pomodoro Timer within its tab */}
          <div className="flex justify-center">
             <PomodoroTimer />
           </div>
        </TabsContent>
        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>
      </Tabs>
       {/* Remove styled-jsx and use Tailwind animation utilities defined in globals.css */}
       <style jsx>{`
         @keyframes fadeIn {
           from { opacity: 0; transform: translateY(10px); }
           to { opacity: 1; transform: translateY(0); }
         }
         .animate-fade-in {
           animation: fadeIn 0.5s ease-out forwards;
           opacity: 0; /* Start hidden */
         }
         .animation-delay-200 { animation-delay: 0.2s; }
         .animation-delay-400 { animation-delay: 0.4s; }
       `}</style>
    </main>
  );
}
