import { PomodoroTimer } from "@/components/pomodoro-timer";
import { TaskList } from "@/components/task-list";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
      <h1 className="text-4xl font-bold mb-12 text-foreground">Tiempo Productivo</h1>
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex flex-col items-center">
          <PomodoroTimer />
        </div>
        <div className="flex-1 flex flex-col">
          <TaskList />
        </div>
      </div>
    </main>
  );
}
