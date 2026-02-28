import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span>✦</span> TatvaPath
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/scriptures">Scriptures</Link>

        {user ? (
          <>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
            <button className="nav-btn" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/auth" className="nav-btn">Login</Link>
            {/* <Link to="/auth" className="nav-btn nav-btn-fill">Sign Up</Link> */}
            <Link to="/auth" state={{ signup: true }} className="nav-btn nav-btn-fill">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;