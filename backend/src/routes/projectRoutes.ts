import { Router } from 'express';
import { createProject, updateProject } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createProject);
router.put('/:projectId', authMiddleware, updateProject);

export default router;