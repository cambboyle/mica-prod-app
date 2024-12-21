import app from './app';
import { syncDatabase } from './models';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Import models to ensure they are registered with Sequelize
import './models/taskModel';

const start = async () => {
  try {
    // Sync database
    await syncDatabase();
    console.log('Database synced successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

start();
