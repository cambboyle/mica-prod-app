import { Request, Response } from 'express';
import todoService from '../services/todoService';

export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const todos = await todoService.getTodos(userId);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await todoService.createTodo(userId, title);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error });
  }
};

export const toggleTodoStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const todoId = parseInt(req.params.id);
    const todo = await todoService.toggleTodoStatus(todoId, userId);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling todo status', error });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const todoId = parseInt(req.params.id);
    const todo = await todoService.deleteTodo(todoId, userId);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const todo = await todoService.updateTodo(parseInt(id), userId, updates);
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};
