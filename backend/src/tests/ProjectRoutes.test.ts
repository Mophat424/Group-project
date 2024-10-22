// tests/projectRoutes.test.ts
import request from 'supertest';
import express from 'express';
import ProjectRoutes from '../routes/projectRoutes';
import { authMiddleware } from '../middlewares/authMiddleware';

const app = express();
app.use(express.json());
app.use('/api/project', authMiddleware, ProjectRoutes);

// Mock a user authentication middleware
jest.mock('../middlewares/authMiddleware', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: '123', role: 'Admin' }; // Mock user data
    next();
  },
}));

describe('Project Routes', () => {
  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/project')
      .send({
        name: 'New Project',
        description: 'Project description',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('project');
  });

  it('should update an existing project', async () => {
    const response = await request(app)
      .put('/api/project/1') // Replace with actual project ID
      .send({
        name: 'Updated Project',
        description: 'Updated description',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('project');
  });
});
