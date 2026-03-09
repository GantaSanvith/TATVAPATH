import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* LEFT — Branding */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span>✦</span> TatvaPath
          </div>
          <div className="footer-tagline">तत्त्वपथ — The Path of Truth</div>
          <p className="footer-desc">
            A sacred space to read, listen and learn the timeless wisdom of Hindu scriptures. One verse at a time.
          </p>
        </div>

        {/* MIDDLE — Links */}
        <div className="footer-col">
          <div className="footer-col-title">Navigate</div>
          <Link to="/">Home</Link>
          <Link to="/scriptures">Scriptures</Link>
          {user && <Link to="/leaderboard">Leaderboard</Link>}
          {user && <Link to="/profile">Profile</Link>}
          {!user && <Link to="/auth">Login / Sign Up</Link>}
        </div>

        {/* RIGHT — About */}
        <div className="footer-col">
          <div className="footer-col-title">About</div>
          <p className="footer-about">
            TatvaPath is a gamified scripture learning platform built to make ancient Hindu wisdom accessible, engaging and rewarding for modern seekers.
          </p>
          <div className="footer-badge">
            <span>🔥</span> Built with devotion
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-quote">
          "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः" — Where there is Krishna, there is victory.
        </div>
        <div className="footer-copy">
          © 2026 TatvaPath. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;