import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="settings-content">
        <section className="profile-section">
          <h2>Profile</h2>
          <div className="profile-info">
            <div className="profile-picture">
              <img src={user?.profilePic || '/default-avatar.png'} alt="Profile" />
              <button className="change-photo-btn">Change Photo</button>
            </div>
            <div className="profile-details">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={user?.displayName || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
            </div>
          </div>
        </section>

        <section className="preferences-section">
          <h2>Preferences</h2>
          <p>Preferences settings coming soon!</p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
