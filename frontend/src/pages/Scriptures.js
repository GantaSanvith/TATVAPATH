import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Scriptures.css';
import API_URL from '../config';
const Scriptures = () => {
  const [scriptures, setScriptures] = useState([]);
  const [selected, setSelected] = useState(null);
  const [adhyayas, setAdhyayas] = useState([]);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  axios.get(`${API_URL}/api/scriptures`)
    .then(res => setScriptures(res.data))
    .catch(err => console.error(err));
}, []);

  const selectScripture = async (scripture) => {
    if (!user) { navigate('/auth'); return; }
    setSelected(scripture);
    const res = await axios.get(
  `${API_URL}/api/scriptures/${scripture._id}/adhyayas`,
  { headers: { Authorization: `Bearer ${token}` } }
);
    setAdhyayas(res.data);
  };

  return (
    <div className="scriptures-page">
      <div className="page-hero">
        <div className="section-label">Sacred Library</div>
        <h1 className="section-title">The Scriptures</h1>
        <p className="page-hero-desc">Ancient wisdom, timeless teachings.</p>
      </div>

      {!selected ? (
        <div className="scripture-list">
          {scriptures.map(s => (
            <div key={s._id} className="scripture-list-item" onClick={() => selectScripture(s)}>
              <div className="sli-icon">{s.icon}</div>
              <div className="sli-info">
                <div className="sli-name">{s.title}</div>
                <div className="sli-desc">{s.description}</div>
              </div>
              <div className="sli-stats">
                <span className="sli-stat-num">{s.totalVerses}</span>
                <span className="sli-stat-label">Verses</span>
              </div>
              {!user && <span className="lock-badge">🔒 Login to Access</span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="adhyaya-list-page">
          <button className="back-btn" onClick={() => setSelected(null)}>← Back to Scriptures</button>
          <h2 className="adhyaya-title">{selected.title}</h2>
          <div className="adhyaya-grid">
            {adhyayas.map(a => (
              <div key={a._id} className="adhyaya-card" onClick={() => navigate(`/reader/${a._id}`)}>
                <div className="adhyaya-num">Chapter {a.number}</div>
                <div className="adhyaya-name">{a.title}</div>
                <div className="adhyaya-desc">{a.description}</div>
                <div className="adhyaya-verses">{a.totalVerses} verses</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scriptures;