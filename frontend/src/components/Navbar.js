import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo"><span>✦</span> TatvaPath</Link>

        <div className="nav-links desktop-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/scriptures" className={location.pathname === '/scriptures' ? 'active' : ''}>Scriptures</Link>
          {user ? (
            <>
              <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link>
              <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
              <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>Settings</Link>
              <button className="nav-btn danger" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/auth" state={{ signup: false }} className="nav-btn">Sign In</Link>
              <Link to="/auth" state={{ signup: true }} className="nav-btn nav-btn-fill">Sign Up</Link>
            </>
          )}
        </div>

        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-inner">
          <Link to="/">Home</Link>
          <Link to="/scriptures">Scriptures</Link>
          {user ? (
            <>
              <Link to="/leaderboard">Leaderboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <div className="mobile-divider" />
              <div className="mobile-user">
                <span className="mobile-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <div>
                  <div className="mobile-user-name">{user.name}</div>
                  <div className="mobile-user-pts">✦ {user.totalPoints || 0} points</div>
                </div>
              </div>
              <button className="mobile-signout" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <div className="mobile-divider" />
              <Link to="/auth" state={{ signup: false }} className="mobile-cta">Sign In</Link>
              <Link to="/auth" state={{ signup: true }} className="mobile-cta filled">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;