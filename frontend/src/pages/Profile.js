import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './Profile.css';

const Profile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDays, setActiveDays] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(res.data.user);
        setActiveDays(res.data.activeDays);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => { logout(); navigate('/'); };

  // Calendar setup
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = now.getDate();
  const monthName = now.toLocaleString('default', { month: 'long' });

  // Check if a day was active
  const isActiveDay = (day) => {
    const key = `${year}-${month + 1}-${day}`;
    return activeDays.includes(key);
  };

  const displayUser = profileData || user;
  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',fontFamily:'Cinzel,serif'}}>
      Loading profile...
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-layout">

        {/* LEFT CARD */}
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {displayUser?.name?.charAt(0).toUpperCase()}
            </div>
            {displayUser?.currentStreak > 0 && (
              <div className="profile-streak-badge">🔥 {displayUser.currentStreak}</div>
            )}
          </div>
          <div className="profile-name">{displayUser?.name}</div>
          <div className="profile-email">{displayUser?.email}</div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-num">{displayUser?.totalPoints || 0}</span>
              <span className="profile-stat-label">Points</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-num">{displayUser?.currentStreak || 0}</span>
              <span className="profile-stat-label">Streak 🔥</span>
            </div>
          </div>

          <button className="profile-btn danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* RIGHT */}
        <div className="profile-right">

          {/* REAL STREAK CALENDAR */}
          <div className="calendar-section">
            <div className="calendar-header">
              <div className="calendar-title">
                {monthName} {year} — Activity Calendar
              </div>
            </div>

            <div className="calendar-grid">
              {dayLabels.map(d => (
                <div key={d} className="cal-day-label">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} className="cal-day empty"></div>
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <div
                  key={day}
                  className={`cal-day 
                    ${day === today ? 'today' : ''}
                    ${isActiveDay(day) && day !== today ? 'streak' : ''}
                  `}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="streak-info">
              <div className="streak-item">
                <span className="streak-num">{displayUser?.currentStreak || 0}</span>
                <span className="streak-label">Current Streak 🔥</span>
              </div>
              <div className="streak-item">
                <span className="streak-num">{displayUser?.longestStreak || 0}</span>
                <span className="streak-label">Longest Streak ⚡</span>
              </div>
              <div className="streak-item">
                <span className="streak-num">{activeDays.length}</span>
                <span className="streak-label">Total Active Days</span>
              </div>
            </div>
          </div>

          {/* POINTS */}
          <div className="points-card">
            <div className="points-card-title">✦ Total Points Earned</div>
            <div className="points-card-num">{displayUser?.totalPoints || 0}</div>
            <div className="points-card-sub">Keep completing verses to earn more!</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;