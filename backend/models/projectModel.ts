import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Project extends Model {}

Project.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: 'project' }
);

export default Project;
