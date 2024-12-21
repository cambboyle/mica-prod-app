import Task from '../models/taskModel';
import { Op } from 'sequelize';

interface TaskCreateData {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  projectId?: number;
}

interface TaskUpdateData extends Partial<TaskCreateData> {}

interface TaskSearchParams {
  status?: string;
  priority?: string;
  search?: string;
  projectId?: number;
  startDate?: Date;
  endDate?: Date;
}

class TaskService {
  async createTask(userId: number, data: TaskCreateData) {
    return await Task.create({
      ...data,
      userId,
    });
  }

  async updateTask(taskId: number, userId: number, data: TaskUpdateData) {
    const task = await Task.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    return await task.update(data);
  }

  async deleteTask(taskId: number, userId: number) {
    const task = await Task.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    await task.destroy();
    return true;
  }

  async getTask(taskId: number, userId: number) {
    const task = await Task.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    return task;
  }

  async searchTasks(userId: number, params: TaskSearchParams) {
    const where: any = { userId };

    // Status filter
    if (params.status && params.status !== 'all') {
      where.status = params.status;
    }

    // Priority filter
    if (params.priority && params.priority !== 'all') {
      where.priority = params.priority;
    }

    // Project filter
    if (params.projectId) {
      where.projectId = params.projectId;
    }

    // Date range filter
    if (params.startDate || params.endDate) {
      where.dueDate = {};
      if (params.startDate) {
        where.dueDate[Op.gte] = params.startDate;
      }
      if (params.endDate) {
        where.dueDate[Op.lte] = params.endDate;
      }
    }

    // Text search
    if (params.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${params.search}%` } },
        { description: { [Op.iLike]: `%${params.search}%` } },
      ];
    }

    return await Task.findAll({
      where,
      order: [['dueDate', 'ASC'], ['createdAt', 'DESC']],
    });
  }

  async toggleTaskStatus(taskId: number, userId: number) {
    const task = await Task.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    return await task.update({ status: newStatus });
  }
}

export default new TaskService();
