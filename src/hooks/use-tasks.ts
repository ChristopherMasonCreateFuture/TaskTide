'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '@/components/tasks/types';
import { taskApi, ApiError } from '@/lib/api';


export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load tasks from API on mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedTasks = await taskApi.getAllTasks();
                setTasks(fetchedTasks);
            } catch (err) {
                console.error('Failed to load tasks:', err);
                setError(err instanceof ApiError ? err.message : 'Failed to load tasks');
                // Fallback to empty array on error
                setTasks([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadTasks();
    }, []);

    const addTask = useCallback(async (title: string, dueDate?: string): Promise<void> => {
        try {
            setError(null);
            const newTask = await taskApi.createTask(title);
            // Add dueDate if provided (API doesn't handle it yet, so store locally for now)
            const taskWithDueDate = { ...newTask, dueDate: dueDate || null };
            setTasks((prev) => [taskWithDueDate, ...prev]);
        } catch (err) {
            console.error('Failed to add task:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to add task');
            throw err;
        }
    }, []);

    const updateTask = useCallback(async (id: number, newTitle: string, newDueDate?: string): Promise<void> => {
        try {
            setError(null);
            const updatedTask = await taskApi.updateTask(id, newTitle);
            // Update dueDate locally since API doesn't handle it yet
            const taskWithDueDate = { ...updatedTask, dueDate: newDueDate || null };
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? taskWithDueDate : task
                )
            );
        } catch (err) {
            console.error('Failed to update task:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to update task');
            throw err;
        }
    }, []);

    const updateTaskStatus = useCallback(async (id: number, newStatus: TaskStatus) => {
        try {
            setError(null);
            
            // If marking as done, use the API endpoint
            if (newStatus === 'done') {
                await taskApi.markTaskAsDone(id);
            }
            
            // Update local state for immediate feedback
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, status: newStatus, done: newStatus === 'done' } : task
                )
            );
        } catch (err) {
            console.error('Failed to update task status:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to update task status');
            throw err;
        }
    }, []);

    const deleteTask = useCallback(async (id: number) => {
        try {
            setError(null);
            await taskApi.deleteTask(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (err) {
            console.error('Failed to delete task:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to delete task');
            throw err;
        }
    }, []);

    const toggleTask = useCallback(async (id: number) => {
        try {
            setError(null);
            const currentTask = tasks.find(task => task.id === id);
            if (!currentTask) {
                throw new Error('Task not found');
            }

            const newDone = !currentTask.done;
            const newStatus = newDone ? 'done' : 'todo';

            // If marking as done, use the API endpoint
            if (newDone) {
                await taskApi.markTaskAsDone(id);
            }

            // Update local state for immediate feedback
            setTasks((prev) =>
                prev.map((task) => {
                    if (task.id === id) {
                        return { ...task, done: newDone, status: newStatus };
                    }
                    return task;
                })
            );
        } catch (err) {
            console.error('Failed to toggle task:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to toggle task');
            throw err;
        }
    }, [tasks]);

    return { 
        tasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        toggleTask, 
        isLoading, 
        updateTaskStatus, 
        error,
        clearError: () => setError(null)
    };
}
