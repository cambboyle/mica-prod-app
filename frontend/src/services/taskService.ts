import api from './api';

const API_ENDPOINT = '/api/tasks';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  projectId?: number;
}

export interface TaskCreateData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  projectId?: number;
}

export interface TaskSearchParams {
  status?: string;
  priority?: string;
  search?: string;
  projectId?: number;
  startDate?: Date;
  endDate?: Date;
}

class TaskService {
  async getTasks(params: TaskSearchParams = {}) {
    try {
      const response = await api.get(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(data: TaskCreateData) {
    try {
      const response = await api.post(API_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, data: Partial<TaskCreateData>) {
    try {
      const response = await api.put(`${API_ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      const response = await api.delete(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async toggleTaskStatus(id: string) {
    try {
      const response = await api.patch(`${API_ENDPOINT}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  }

  async searchTasks(searchTerm: string) {
    try {
      const response = await api.get(API_ENDPOINT, {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }
}

export default new TaskService();
