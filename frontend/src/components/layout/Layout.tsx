import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="layout">
      <header className="top-bar">
        <div className="user-profile">
          <img 
            src={user?.profilePic || '/default-avatar.png'} 
            alt="Profile" 
            className="profile-pic"
          />
          <span className="user-name">{user?.displayName}</span>
        </div>
        <div className="top-bar-actions">
          <button 
            className="settings-button"
            onClick={() => navigate('/settings')}
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="main-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
