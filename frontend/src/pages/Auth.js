import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import API_URL from '../config';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const url = isLogin
  ? `${API_URL}/api/auth/login`
  : `${API_URL}/api/auth/register`;

      const res = await axios.post(url, formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const quotes = [
    { text: "Yoga is the journey of the self, through the self, to the self.", source: "Bhagavad Gita 6.20" },
    { text: "The soul is never born nor dies at any time.", source: "Bhagavad Gita 2.20" },
    { text: "You have the right to perform your duties, but not to the fruits.", source: "Bhagavad Gita 2.47" }
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-om">ॐ</div>
        <div className="auth-left-content">
          <p className="auth-quote">"{quote.text}"</p>
          <div className="auth-quote-source">— {quote.source}</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-title">
            {isLogin ? 'Welcome Back' : 'Begin Journey'}
          </div>
          <p className="auth-form-subtitle">
            {isLogin ? 'Continue your sacred journey' : 'Join thousands of seekers on TatvaPath'}
          </p>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Your name"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="your@email.com"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            className="form-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Enter the Path' : 'Start My Journey'}
          </button>

          <div className="form-switch">
            {isLogin ? "New seeker? " : "Already a seeker? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Create account →' : 'Sign in →'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;