'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, Trash2, CalendarIcon } from 'lucide-react';
import { Task } from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, newTitle: string, newDueDate?: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
  isDraggable?: boolean;
}

const taskFormSchema = z.object({
  title: z.string().min(1, 'Task description is required.'),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TaskItem({ task, onUpdate, onDelete, onToggle, isDraggable = false }: TaskItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      dueDate: task.dueDate || '',
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setIsLoading(true);
      await onUpdate(task.id, data.title, data.dueDate);
      setIsEditDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook level
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await onToggle(task.id);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", task.id.toString());
  };

  return (
    <Card 
      className="p-3 flex items-center gap-3 transition-all hover:shadow-md"
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      id={`task-card-${task.id}`}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.done}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        aria-label={`Mark task ${task.done ? 'incomplete' : 'complete'}`}
      />
      <div className="flex-grow">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'font-medium transition-colors',
            task.done && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </label>
         {task.dueDate && (
          <Badge variant="outline" className="ml-2">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Task</span>
            </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Task</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
