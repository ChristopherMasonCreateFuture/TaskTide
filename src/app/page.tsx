'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/use-tasks';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const { tasks, addTask, updateTask, deleteTask, toggleTask, isLoading, updateTaskStatus, error, clearError } = useTasks();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      if (!authStatus) {
        router.replace('/login');
      }
    }
  }, [router]);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-3xl p-4 space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Add a new task</h1>
            <TaskForm onAddTask={addTask} />
          </section>
          <section>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="board">Board</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <div className="max-w-3xl mx-auto">
                  <TaskList
                    tasks={tasks}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                    onToggleTask={toggleTask}
                  />
                </div>
              </TabsContent>
              <TabsContent value="board">
                <KanbanBoard
                  tasks={tasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onToggleTask={toggleTask}
                  onUpdateTaskStatus={updateTaskStatus}
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}
