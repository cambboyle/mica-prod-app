import sequelize from '../utils/sequelize';
import User from './userModel';
import Task from './taskModel';
import Note from './noteModel';
import Project from './projectModel';

// User -> Task relationship
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks'
});
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Project -> Task relationship (one-to-many)
Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
  onDelete: 'SET NULL'
});
Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// Project -> Note relationship (one-to-many)
Project.hasMany(Note, {
  foreignKey: 'projectId',
  as: 'notes',
  onDelete: 'SET NULL'
});
Note.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// Task -> Note relationship (one-to-many)
Task.hasMany(Note, {
  foreignKey: 'taskId',
  as: 'notes',
  onDelete: 'SET NULL'
});
Note.belongsTo(Task, {
  foreignKey: 'taskId',
  as: 'task'
});

// Function to sync all models with the database
export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

export { User, Task, Note, Project };
