import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class Note extends Model {}

Note.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    taskId: { type: DataTypes.INTEGER, allowNull: true }, // Optional link to Task
  },
  { sequelize, modelName: 'note' }
);

export default Note;
