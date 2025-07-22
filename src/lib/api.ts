import { Task } from '@/components/tasks/types';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred');
  }
}

export const taskApi = {
  // GET /api/tasks - Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const tasks = await fetchApi<Task[]>('/tasks');
    // Transform the API response to match our client-side Task interface
    return tasks.map(task => ({
      ...task,
      status: task.done ? 'done' : 'todo', // Set default status based on done field
    }));
  },

  // GET /api/tasks/top?n=5 - Get top N tasks
  getTopTasks: async (n: number = 5): Promise<Task[]> => {
    const tasks = await fetchApi<Task[]>(`/tasks/top?n=${n}`);
    return tasks.map(task => ({
      ...task,
      status: task.done ? 'done' : 'todo',
    }));
  },

  // POST /api/tasks - Create a new task
  createTask: async (title: string): Promise<Task> => {
    const task = await fetchApi<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return {
      ...task,
      status: 'todo', // New tasks default to todo status
    };
  },

  // PUT /api/tasks/{id} - Update an existing task
  updateTask: async (id: number, title: string): Promise<Task> => {
    const task = await fetchApi<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
    return {
      ...task,
      status: task.done ? 'done' : 'todo',
    };
  },

  // DELETE /api/tasks/{id} - Delete a task
  deleteTask: async (id: number): Promise<void> => {
    await fetchApi<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // PATCH /api/tasks/{id}/done - Mark task as done
  markTaskAsDone: async (id: number): Promise<void> => {
    await fetchApi<void>(`/tasks/${id}/done`, {
      method: 'PATCH',
    });
  },
};

export { ApiError };
