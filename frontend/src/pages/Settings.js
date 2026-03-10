import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import './Settings.css';

const Settings = () => {
  const { user, token, login } = useAuth();

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passMsg, setPassMsg] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const updateProfile = async () => {
    if (!name.trim()) return setProfileMsg('Name cannot be empty');
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const res = await axios.put(
        `${API_URL}/api/auth/update-profile`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(res.data, token); // update user in context
      setProfileMsg('✅ Name updated successfully!');
    } catch (err) {
      setProfileMsg('❌ ' + (err.response?.data?.message || 'Error updating profile'));
    }
    setProfileLoading(false);
  };

  const changePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword)
      return setPassMsg('All fields are required');
    if (passwords.newPassword !== passwords.confirmPassword)
      return setPassMsg('New passwords do not match');
    if (passwords.newPassword.length < 6)
      return setPassMsg('New password must be at least 6 characters');

    setPassLoading(true);
    setPassMsg('');
    try {
      await axios.put(
        `${API_URL}/api/auth/change-password`,
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMsg('✅ Password changed successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg('❌ ' + (err.response?.data?.message || 'Error changing password'));
    }
    setPassLoading(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-wrap">

        <div className="settings-header">
          <div className="settings-title">Account Settings</div>
          <div className="settings-subtitle">Manage your profile and security</div>
        </div>

        {/* Edit Name */}
        <div className="settings-card">
          <div className="settings-card-title">Edit Profile</div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input disabled"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <div className="form-hint">Email cannot be changed</div>
          </div>

          {profileMsg && (
            <div className={`settings-msg ${profileMsg.startsWith('✅') ? 'success' : 'error'}`}>
              {profileMsg}
            </div>
          )}

          <button className="settings-btn" onClick={updateProfile} disabled={profileLoading}>
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <div className="settings-card-title">Change Password</div>

          {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div className="form-group" key={field}>
              <label className="form-label">
                {field === 'oldPassword' ? 'Current Password'
                  : field === 'newPassword' ? 'New Password'
                  : 'Confirm New Password'}
              </label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={passwords[field]}
                onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
              />
            </div>
          ))}

          {passMsg && (
            <div className={`settings-msg ${passMsg.startsWith('✅') ? 'success' : 'error'}`}>
              {passMsg}
            </div>
          )}

          <button className="settings-btn" onClick={changePassword} disabled={passLoading}>
            {passLoading ? 'Updating...' : 'Change Password'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;