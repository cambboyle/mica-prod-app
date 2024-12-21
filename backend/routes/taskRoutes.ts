import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use((req, res, next) => {
  isAuthenticated(req, res, next);
});

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
