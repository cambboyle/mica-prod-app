import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';
import noteRoutes from './routes/noteRoutes';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';
import passport from 'passport';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/tasks', taskRoutes);
app.use('/notes', noteRoutes);
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);

// Default Route
app.get('/', (req, res) => res.send('API is running'));

export default app;
