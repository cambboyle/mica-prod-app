export enum TodoStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoSearchParams {
  status?: TodoStatus[];
  searchTerm?: string;
}
