export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  SHOPPING = 'shopping',
  HEALTH = 'health',
  FINANCE = 'finance',
  OTHER = 'other'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  category: TaskCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskSearchParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: 'dueDate' | 'priority' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  tags?: string[];
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
