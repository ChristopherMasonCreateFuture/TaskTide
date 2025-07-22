export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: number;
  title: string;
  done: boolean;
  dueDate?: string | null;
  status: TaskStatus;
}
