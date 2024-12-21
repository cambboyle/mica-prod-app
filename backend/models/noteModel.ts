import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Note extends Model {}

Note.init(
  {
    title: { 
      type: DataTypes.STRING(255), 
      allowNull: true 
    },
    content: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    taskId: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    projectId: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    }
  },
  { 
    sequelize, 
    modelName: 'note',
    timestamps: true
  }
);

export default Note;
