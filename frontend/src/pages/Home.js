import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';
// import API_URL from '../config';
const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
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
          <Link to="/scriptures" className="btn-primary">Explore Scriptures</Link>
          {!user && <Link to="/auth" className="btn-secondary">Begin Journey →</Link>}
          {user && <Link to="/scriptures" className="btn-secondary">Continue Reading →</Link>}
        </div>
        {user && (
          <div className="welcome-back">
            🙏 Welcome back, <span>{user.name}</span>! 
            You have <span>{user.totalPoints} points</span>
          </div>
        )}
      </div>

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