import { Request, Response } from 'express';
import Task from '../models/taskModel';
import taskService from '../services/taskService';

// Get all tasks with filters and search
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { status, priority, search, projectId, startDate, endDate } = req.query;
    
    const tasks = await taskService.searchTasks(userId, {
      status: status as string,
      priority: priority as string,
      search: search as string,
      projectId: projectId ? Number(projectId) : undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const task = await taskService.createTask(userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const task = await taskService.updateTask(Number(id), userId, req.body);
    res.json(task);
  } catch (error) {
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: 'Error updating task', error });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await taskService.deleteTask(Number(id), userId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

// Toggle task status
export const toggleTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const task = await taskService.toggleTaskStatus(Number(id), userId);
    res.json(task);
  } catch (error) {
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: 'Error toggling task status', error });
  }
};