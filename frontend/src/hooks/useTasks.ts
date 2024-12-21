import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { Task, TaskSearchParams } from '../types/task.types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (params?: TaskSearchParams) => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(params);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Failed to create task');
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Failed to delete task');
    }
  };

  const searchTasks = async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await taskService.searchTasks({
        searchTerm,
        status: undefined,
        priority: undefined,
        category: undefined,
        tags: undefined
      });
      setTasks(results);
      setError(null);
    } catch (err) {
      setError('Failed to search tasks');
      console.error('Error searching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecentTasks = (limit: number) => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  };

  const getUpcomingTasks = (limit: number) => {
    return [...tasks]
      .filter(task => task.status !== 'completed' && task.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, limit);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    searchTasks,
    getRecentTasks,
    getUpcomingTasks
  };
};
