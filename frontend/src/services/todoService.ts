import api from './api';
import { Todo, TodoSearchParams } from '../types/todo.types';

const BASE_URL = '/api/todos';

export const todoService = {
  getTodos: async (params: TodoSearchParams = {}): Promise<Todo[]> => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  createTodo: async (todo: Partial<Todo>): Promise<Todo> => {
    const response = await api.post(BASE_URL, todo);
    return response.data;
  },

  updateTodo: async (id: string, todo: Partial<Todo>): Promise<Todo> => {
    const response = await api.patch(`${BASE_URL}/${id}`, todo);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  toggleTodoStatus: async (id: string): Promise<Todo> => {
    const response = await api.patch(`${BASE_URL}/${id}/toggle`);
    return response.data;
  }
};

export default todoService;
