import { PomodoroTimer } from "@/components/pomodoro-timer";
import { TaskList } from "@/components/task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ListChecks } from "lucide-react";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 lg:p-24 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Tiempo Productivo</h1>
      <Tabs defaultValue="timer" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="timer" className="gap-2">
             <Clock className="h-5 w-5" />
             Temporizador
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
             <ListChecks className="h-5 w-5" />
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
    </main>
  );
}
