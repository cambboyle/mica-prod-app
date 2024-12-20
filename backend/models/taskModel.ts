import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Task extends Model {}

Task.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    priority: { 
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'done'),
      defaultValue: 'todo'
    },
    projectId: { type: DataTypes.INTEGER, allowNull: true }, // Foreign key linking to Projects
  },
  { sequelize, modelName: 'task' }
);

export default Task;
