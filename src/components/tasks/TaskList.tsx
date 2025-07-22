'use client';

import { Task } from './types';
import { TaskItem } from './TaskItem';
import { Separator } from '@/components/ui/separator';
import { ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: number, newTitle: string, newDueDate?: string) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
  onToggleTask: (id: number) => Promise<void>;
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask, onToggleTask }: TaskListProps) {
  const incompleteTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ListTodo className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">All clear!</h3>
        <p>You have no tasks left. Time for a break!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {incompleteTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">To Do ({incompleteTasks.length})</h2>
          <div className="space-y-2">
            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onToggle={onToggleTask}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && incompleteTasks.length > 0 && <Separator />}

      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Completed ({completedTasks.length})</h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onToggle={onToggleTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
