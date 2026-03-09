import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-om">ॐ</div>
        <div className="hero-eyebrow">Begin Your Sacred Journey</div>
        <h1 className="hero-title">TatvaPath</h1>
        <div className="hero-subtitle">तत्त्वपथ — The Path of Truth</div>
        <p className="hero-desc">
          Immerse yourself in the timeless wisdom of sacred scriptures.
          Read, listen, understand, and earn your place among the enlightened.
        </p>

        <div className="hero-ctas">
          {user ? (
            // ── LOGGED IN buttons ──
            <>
              <Link to="/scriptures" className="btn-primary">Continue Reading</Link>
              <Link to="/leaderboard" className="btn-secondary">View Leaderboard →</Link>
            </>
          ) : (
            // ── LOGGED OUT buttons ──
            <>
              <Link to="/scriptures" className="btn-primary">Explore Scriptures</Link>
              <Link to="/auth" state={{ signup: true }} className="btn-secondary">Begin Journey →</Link>
            </>
          )}
        </div>

        {user && (
          <div className="welcome-back">
            🙏 Welcome back, <span>{user.name}</span>! You have <span>{user.totalPoints || 0} points</span>
          </div>
        )}
      </div>

      {/* ── LOGGED IN — personal stats strip ── */}
      {user && (
        <div className="home-stats-strip">
          <div className="home-stat">
            <span className="home-stat-num">{user.totalPoints || 0}</span>
            <span className="home-stat-label">Points Earned</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <span className="home-stat-num">{user.currentStreak || 0} 🔥</span>
            <span className="home-stat-label">Day Streak</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <Link to="/profile" className="home-stat-link">View Full Profile →</Link>
          </div>
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      <div className="steps-section">
        <div className="section-label">Your Path</div>
        <h2 className="section-title">How TatvaPath Works</h2>
        <div className="steps">
          {[
            { num:'01', icon:'📖', title:'Choose a Scripture', desc:'Select your sacred text and navigate through chapters and verses.' },
            { num:'02', icon:'🎧', title:'Read or Listen', desc:'Hear the original Sanskrit and read the meaning in your language.' },
            { num:'03', icon:'✅', title:'Complete the Task', desc:'Answer MCQs to mark the verse complete and earn sacred points.' },
            { num:'04', icon:'🏆', title:'Climb the Leaderboard', desc:'Compete with seekers worldwide and build your daily streak.' },
          ].map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{s.num}</div>
              <span className="step-icon">{s.icon}</span>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;