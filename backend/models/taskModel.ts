import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Task extends Model {}

Task.init(
  {
    title: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    status: { 
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      defaultValue: 'pending'
    },
    priority: { 
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: true
    },
    dueDate: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    projectId: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    }
  },
  { 
    sequelize, 
    modelName: 'task',
    timestamps: true
  }
);

export default Task;
