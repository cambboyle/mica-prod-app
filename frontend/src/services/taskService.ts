import api from './api';
import { Task, TaskSearchParams, TaskFilters } from '../types/task.types';

const API_ENDPOINT = '/api/tasks';

class TaskService {
  async getTasks(params: TaskSearchParams = {}) {
    try {
      const response = await api.get<Task[]>(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTask(taskId: string) {
    try {
      const response = await api.get<Task>(`${API_ENDPOINT}/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async createTask(data: Partial<Task>) {
    // Validate required fields
    if (!data.title) {
      throw new Error('Task title is required');
    }
    if (!data.priority) {
      throw new Error('Task priority is required');
    }
    if (!data.category) {
      throw new Error('Task category is required');
    }
    if (data.dueDate && new Date(data.dueDate) < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    // Set default values
    const taskData = {
      ...data,
      tags: data.tags || [],
      status: data.status || 'pending'
    };

    try {
      const response = await api.post<Task>(API_ENDPOINT, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, data: Partial<Task>) {
    // Validate updates
    if (data.title === '') {
      throw new Error('Task title cannot be empty');
    }
    if (data.dueDate && new Date(data.dueDate) < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    try {
      const response = await api.put<Task>(`${API_ENDPOINT}/${taskId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string) {
    try {
      await api.delete(`${API_ENDPOINT}/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async toggleTaskStatus(taskId: string) {
    try {
      const task = await this.getTask(taskId);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await api.put<Task>(`${API_ENDPOINT}/${taskId}`, {
        status: newStatus
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  }

  async searchTasks(filters: TaskFilters) {
    try {
      // Convert filters to search params
      const params: TaskSearchParams = {
        searchTerm: filters.searchTerm
      };
      
      // Get tasks with search params
      const response = await api.get<Task[]>(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }

  // Helper method to validate task data
  validateTask(data: Partial<Task>): string[] {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Title is required');
    }

    if (!data.priority) {
      errors.push('Priority is required');
    }

    if (!data.category) {
      errors.push('Category is required');
    }

    if (data.dueDate && new Date(data.dueDate) < new Date()) {
      errors.push('Due date cannot be in the past');
    }

    return errors;
  }

  // Helper method to get available categories
  getCategories() {
    return [
      'work',
      'personal',
      'shopping',
      'health',
      'finance',
      'other'
    ] as const;
  }

  // Helper method to get task priorities
  getPriorities() {
    return ['low', 'medium', 'high'] as const;
  }

  // Helper method to get task statuses
  getStatuses() {
    return ['pending', 'in-progress', 'completed'] as const;
  }
}

const taskService = new TaskService();
export default taskService;
