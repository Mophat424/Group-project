import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import AuthRoutes from './routes/authRoutes';
import ProjectRoutes from './routes/projectRoutes'
import TeamRoutes from './routes/teamRoutes'

const app = express();
const port = 8000;


app.use(express.json());  

// Use the auth routes
app.use('/api/auth', AuthRoutes);

// Use the project routes
app.use('/api/project', ProjectRoutes);

// // Use the team routes
app.use('/api/teams', TeamRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 