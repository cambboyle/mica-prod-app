import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Project extends Model {}

Project.init(
  {
    name: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  { 
    sequelize, 
    modelName: 'project',
    timestamps: true
  }
);

export default Project;
