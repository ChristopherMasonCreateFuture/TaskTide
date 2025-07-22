'use client';

import { Task, TaskStatus } from './types';
import { TaskItem } from './TaskItem';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (id: number, newTitle: string, newDueDate?: string) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
  onToggleTask: (id: number) => Promise<void>;
  onUpdateTaskStatus: (id: number, newStatus: TaskStatus) => Promise<void>;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export function KanbanBoard({ tasks, onUpdateTask, onDeleteTask, onToggleTask, onUpdateTaskStatus }: KanbanBoardProps) {
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const status = task.status || (task.done ? 'done' : 'todo');
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      try {
        await onUpdateTaskStatus(Number(taskId), status);
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
    setDraggedOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <Card
          key={col.id}
          className={cn(
            'transition-colors',
            draggedOverColumn === col.id ? 'bg-accent' : ''
          )}
          onDragOver={(e) => handleDragOver(e, col.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <CardHeader>
            <CardTitle>{col.title} ({groupedTasks[col.id]?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(groupedTasks[col.id] || []).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onToggle={onToggleTask}
                isDraggable={true}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
