import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OAuthCallback from './components/auth/OAuthCallback';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import TaskView from './pages/TaskView';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Layout from './components/layout/Layout';
import Todos from './pages/Todos';

import './styles/auth.css';
import './styles/layout.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:taskId" element={<TaskView />} />
            <Route path="todos" element={<Todos />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
