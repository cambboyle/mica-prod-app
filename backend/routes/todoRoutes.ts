import express from 'express';
import { getTodos, createTodo, toggleTodoStatus, deleteTodo } from '../controllers/todoController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

router.get('/', getTodos);
router.post('/', createTodo);
router.patch('/:id/toggle', toggleTodoStatus);
router.delete('/:id', deleteTodo);

export default router;
