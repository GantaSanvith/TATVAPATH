import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';
import API_URL from '../config';
const Leaderboard = () => {
  const [data, setData] = useState({ leaderboard: [], myRank: null });
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
  axios.get(`${API_URL}/api/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => { setData(res.data); setLoading(false); })
  .catch(err => { console.error(err); setLoading(false); });
}, [token]); // ← add token here

  const top3 = data.leaderboard.slice(0, 3);
  const rest = data.leaderboard.slice(3);

  const medals = ['👑', '🥈', '🥉'];
  const podiumOrder = [1, 0, 2]; // Silver, Gold, Bronze order visually

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',fontFamily:'Cinzel,serif'}}>
      Loading leaderboard...
    </div>
  );

  return (
    <div className="leaderboard-page">
      <div className="page-hero">
        <div className="section-label">Hall of the Enlightened</div>
        <h1 className="section-title">Leaderboard</h1>
        {data.myRank && (
          <div className="my-rank-badge">
            Your Rank: <span>#{data.myRank}</span>
          </div>
        )}
      </div>

      <div className="leaderboard-section">
        {/* PODIUM */}
        {top3.length >= 3 && (
          <div className="lb-podium">
            {podiumOrder.map(idx => (
              <div key={idx} className={`lb-podium-item ${idx === 0 ? 'first' : ''}`}>
                <span className="lb-rank-icon">{medals[idx]}</span>
                <div className={`lb-avatar ${idx === 0 ? 'large' : ''}`}>
                  {top3[idx]?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="lb-name">{top3[idx]?.name}</div>
                <div className="lb-points">{top3[idx]?.totalPoints}</div>
                <div className="lb-streak">🔥 {top3[idx]?.currentStreak} day streak</div>
              </div>
            ))}
          </div>
        )}

        {/* REST OF TABLE */}
        <table className="lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Seeker</th>
              <th>Streak</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {rest.map(u => (
              <tr key={u.rank} className={u.name === user?.name ? 'lb-you' : ''}>
                <td>{u.rank}</td>
                <td>{u.name} {u.name === user?.name ? '(You) ✦' : ''}</td>
                <td>🔥 {u.currentStreak}</td>
                <td>{u.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;