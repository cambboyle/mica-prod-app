import { useState, useEffect } from 'react';
import { Todo } from '../types/todo.types';
import todoService from '../services/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos({});
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async (todoData: Partial<Todo>) => {
    try {
      await todoService.createTodo(todoData);
      fetchTodos();
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await todoService.toggleTodoStatus(id);
      fetchTodos();
    } catch (err) {
      console.error('Error toggling todo status:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  return {
    todos,
    loading,
    error,
    handleCreateTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    fetchTodos,
    setTodos,
  };
};

export default useTodos;
