import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';
import User from './userModel';

class Todo extends Model {
  public id!: number;
  public title!: string;
  public status!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED'),
      defaultValue: 'PENDING',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Todo',
    tableName: 'todos',
  }
);

// Define association with User
Todo.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Todo, { foreignKey: 'userId' });

export default Todo;
