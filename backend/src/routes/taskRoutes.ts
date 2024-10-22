import { Router } from 'express';
import { createTask, updateTask, addComment } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Task Routes
router.post('/', authMiddleware, createTask);
router.put('/:taskId', authMiddleware, updateTask);
router.post('/:taskId/comments', authMiddleware, addComment);