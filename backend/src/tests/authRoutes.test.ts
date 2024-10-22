// tests/authRoutes.test.ts
import request from 'supertest';
import express from 'express';
import AuthRoutes from '../routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', AuthRoutes);

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'Admin',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 400 if registration fails', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'test@example.com',
        password: '123456',
        role: 'Admin',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: '123456',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
