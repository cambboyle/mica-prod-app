# Mica Productivity App

A modern productivity application built with the MERN stack (PostgreSQL, Express, React, Node.js) and TypeScript.

## Features

- User authentication (Email/Password and Google OAuth)
- Task management
- Modern, responsive UI with Material-UI
- TypeScript for enhanced type safety
- Secure backend with JWT authentication

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mica-productivity
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Fill in your environment variables:
     - Database credentials
     - JWT secret
     - Google OAuth credentials
     - Session secret

4. Start both servers:
   ```bash
   npm start
   ```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

## Development

- Backend: `npm run backend`
- Frontend: `npm run frontend`
- Both: `npm start`

## Tech Stack

- **Frontend:**
  - React with TypeScript
  - Material-UI
  - React Router
  - Axios
  - Context API for state management

- **Backend:**
  - Node.js with Express
  - TypeScript
  - PostgreSQL with Sequelize
  - Passport.js for authentication
  - JWT for session management

## Project Structure

```
mica-productivity/
├── backend/              # Express backend
│   ├── controllers/     # Route controllers
│   ├── models/         # Sequelize models
│   ├── routes/         # Express routes
│   ├── utils/          # Utilities and configs
│   └── types/          # TypeScript types
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript types
│   └── public/         # Static files
└── package.json        # Root package.json for scripts