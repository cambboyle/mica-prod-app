import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

class User extends Model {}

User.init(
  {
    googleId: { type: DataTypes.STRING, allowNull: false, unique: true },
    displayName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    profilePic: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'user' }
);

export default User;
