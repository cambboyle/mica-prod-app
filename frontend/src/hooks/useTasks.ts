import { useState, useEffect } from 'react';
import taskService, { Task, TaskSearchParams } from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await taskService.getTasks();
        setTasks(fetchedTasks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getRecentTasks = (limit: number) => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  };

  const getUpcomingTasks = (limit: number) => {
    const now = new Date();
    return [...tasks]
      .filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return task.status !== 'completed' && dueDate >= now;
      })
      .sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, limit);
  };

  return {
    tasks,
    loading,
    error,
    getRecentTasks,
    getUpcomingTasks
  };
};
