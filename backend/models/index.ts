import sequelize from '../utils/sequelize';
import User from './userModel';
import Task from './taskModel';

// Define associations
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks'
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Function to sync all models with the database
export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // In development, use alter: true to automatically update tables
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
}

export { User, Task };
