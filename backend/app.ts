import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import './utils/passportConfig'; // Import passport configuration

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL!, 'http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public')); // Add this line to serve static files

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/tasks', taskRoutes);

// Auth routes - keep only one route for auth
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Default Route
app.get('/', (req, res) => res.send('Mica API is running'));

export default app;
