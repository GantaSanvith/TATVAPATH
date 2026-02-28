import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import API_URL from '../config';

const API = `${API_URL}/api/admin`;

const Admin = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [scriptures, setScriptures] = useState([]);
  const [adhyayas, setAdhyayas] = useState([]);
  const [verses, setVerses] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Form states
  const [scriptureForm, setScriptureForm] = useState({ title: '', description: '', icon: '📖', totalAdhyayas: 0, totalVerses: 0 });
  const [adhyayaForm, setAdhyayaForm] = useState({ scriptureId: '', number: '', title: '', description: '', totalVerses: 0 });
  const [verseForm, setVerseForm] = useState({ scriptureId: '', adhyayaId: '', verseNumber: '', sanskrit: '', transliteration: '', meaning: '', meaningHindi: '' });
  const [questionForm, setQuestionForm] = useState({ verseId: '', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', points: 50 });

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [s, a, v, st] = await Promise.all([
        axios.get(`${API}/scriptures`, { headers }),
        axios.get(`${API}/adhyayas`, { headers }),
        axios.get(`${API}/verses`, { headers }),
        axios.get(`${API}/stats`, { headers }),
      ]);
      setScriptures(s.data);
      setAdhyayas(a.data);
      setVerses(v.data);
      setStats(st.data);
    } catch (err) {
      showMsg('Failed to load data', 'error');
    }
  };

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const submit = async (url, data, resetFn) => {
    try {
      await axios.post(`${API}/${url}`, data, { headers });
      showMsg(`✅ ${url} added successfully!`);
      resetFn();
      loadAll();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error occurred', 'error');
    }
  };

  const deleteItem = async (url, id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/${url}/${id}`, { headers });
      showMsg('🗑️ Deleted successfully!');
      loadAll();
    } catch (err) {
      showMsg('Delete failed', 'error');
    }
  };

  const tabs = ['dashboard', 'scripture', 'adhyaya', 'verse', 'question', 'manage'];

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">⚙️ Admin Panel</div>
        {tabs.map(t => (
          <div
            key={t}
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'dashboard' && '📊 Dashboard'}
            {t === 'scripture' && '📖 Add Scripture'}
            {t === 'adhyaya' && '📚 Add Adhyaya'}
            {t === 'verse' && '📜 Add Verse'}
            {t === 'question' && '❓ Add Question'}
            {t === 'manage' && '🗑️ Manage Content'}
          </div>
        ))}
        <div className="admin-tab" onClick={() => navigate('/')}>← Back to Site</div>
      </div>

      <div className="admin-main">

        {/* MESSAGE */}
        {msg.text && (
          <div className={`admin-msg ${msg.type}`}>{msg.text}</div>
        )}

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="admin-title">📊 Dashboard</h2>
            <div className="stats-grid">
              {[
                { label: 'Scriptures', value: stats.scriptures, icon: '📖' },
                { label: 'Adhyayas', value: stats.adhyayas, icon: '📚' },
                { label: 'Verses', value: stats.verses, icon: '📜' },
                { label: 'Questions', value: stats.questions, icon: '❓' },
                { label: 'Users', value: stats.users, icon: '👤' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-num">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD SCRIPTURE */}
        {tab === 'scripture' && (
          <div>
            <h2 className="admin-title">📖 Add New Scripture</h2>
            <div className="admin-form">
              {[
                { label: 'Title', key: 'title', placeholder: 'e.g. Bhagavad Gita' },
                { label: 'Description', key: 'description', placeholder: 'Short description' },
                { label: 'Icon (emoji)', key: 'icon', placeholder: '🕉️' },
                { label: 'Total Adhyayas', key: 'totalAdhyayas', placeholder: '18', type: 'number' },
                { label: 'Total Verses', key: 'totalVerses', placeholder: '700', type: 'number' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-input"
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={scriptureForm[f.key]}
                    onChange={e => setScriptureForm({ ...scriptureForm, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <button className="admin-btn" onClick={() =>
                submit('scripture', scriptureForm, () =>
                  setScriptureForm({ title: '', description: '', icon: '📖', totalAdhyayas: 0, totalVerses: 0 }))
              }>
                Add Scripture
              </button>
            </div>
          </div>
        )}

        {/* ADD ADHYAYA */}
        {tab === 'adhyaya' && (
          <div>
            <h2 className="admin-title">📚 Add New Adhyaya</h2>
            <div className="admin-form">
              <div className="form-group">
                <label className="form-label">Scripture</label>
                <select className="form-input" value={adhyayaForm.scriptureId}
                  onChange={e => setAdhyayaForm({ ...adhyayaForm, scriptureId: e.target.value })}>
                  <option value="">Select Scripture</option>
                  {scriptures.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>
              {[
                { label: 'Chapter Number', key: 'number', placeholder: '1', type: 'number' },
                { label: 'Title', key: 'title', placeholder: 'e.g. Arjuna Vishada Yoga' },
                { label: 'Description', key: 'description', placeholder: 'Brief description' },
                { label: 'Total Verses', key: 'totalVerses', placeholder: '47', type: 'number' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-input"
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={adhyayaForm[f.key]}
                    onChange={e => setAdhyayaForm({ ...adhyayaForm, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <button className="admin-btn" onClick={() =>
                submit('adhyaya', adhyayaForm, () =>
                  setAdhyayaForm({ scriptureId: '', number: '', title: '', description: '', totalVerses: 0 }))
              }>
                Add Adhyaya
              </button>
            </div>
          </div>
        )}

        {/* ADD VERSE */}
        {tab === 'verse' && (
          <div>
            <h2 className="admin-title">📜 Add New Verse</h2>
            <div className="admin-form">
              <div className="form-group">
                <label className="form-label">Scripture</label>
                <select className="form-input" value={verseForm.scriptureId}
                  onChange={e => setVerseForm({ ...verseForm, scriptureId: e.target.value, adhyayaId: '' })}>
                  <option value="">Select Scripture</option>
                  {scriptures.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Adhyaya / Chapter</label>
                <select className="form-input" value={verseForm.adhyayaId}
                  onChange={e => setVerseForm({ ...verseForm, adhyayaId: e.target.value })}>
                  <option value="">Select Adhyaya</option>
                  {adhyayas
                    .filter(a => a.scriptureId?._id === verseForm.scriptureId)
                    .map(a => <option key={a._id} value={a._id}>Chapter {a.number} — {a.title}</option>)
                  }
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Verse Number</label>
                <input className="form-input" type="number" placeholder="1"
                  value={verseForm.verseNumber}
                  onChange={e => setVerseForm({ ...verseForm, verseNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Sanskrit Text</label>
                <textarea className="form-input form-textarea" placeholder="Sanskrit verse..."
                  value={verseForm.sanskrit}
                  onChange={e => setVerseForm({ ...verseForm, sanskrit: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Transliteration</label>
                <textarea className="form-input form-textarea" placeholder="Roman script..."
                  value={verseForm.transliteration}
                  onChange={e => setVerseForm({ ...verseForm, transliteration: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">English Meaning</label>
                <textarea className="form-input form-textarea" placeholder="English translation..."
                  value={verseForm.meaning}
                  onChange={e => setVerseForm({ ...verseForm, meaning: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Hindi Meaning (Optional)</label>
                <textarea className="form-input form-textarea" placeholder="Hindi translation..."
                  value={verseForm.meaningHindi}
                  onChange={e => setVerseForm({ ...verseForm, meaningHindi: e.target.value })} />
              </div>
              <button className="admin-btn" onClick={() =>
                submit('verse', verseForm, () =>
                  setVerseForm({ scriptureId: '', adhyayaId: '', verseNumber: '', sanskrit: '', transliteration: '', meaning: '', meaningHindi: '' }))
              }>
                Add Verse
              </button>
            </div>
          </div>
        )}

        {/* ADD QUESTION */}
        {tab === 'question' && (
          <div>
            <h2 className="admin-title">❓ Add Quiz Question</h2>
            <div className="admin-form">
              <div className="form-group">
                <label className="form-label">Select Verse</label>
                <select className="form-input" value={questionForm.verseId}
                  onChange={e => setQuestionForm({ ...questionForm, verseId: e.target.value })}>
                  <option value="">Select Verse</option>
                  {verses.map(v => (
                    <option key={v._id} value={v._id}>
                      {v.scriptureId?.title} — Ch.{v.adhyayaId?.number} Verse {v.verseNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Question</label>
                <textarea className="form-input form-textarea" placeholder="Enter your question..."
                  value={questionForm.question}
                  onChange={e => setQuestionForm({ ...questionForm, question: e.target.value })} />
              </div>
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt} className="form-group">
                  <label className="form-label">Option {opt}</label>
                  <input className="form-input" placeholder={`Option ${opt}`}
                    value={questionForm[`option${opt}`]}
                    onChange={e => setQuestionForm({ ...questionForm, [`option${opt}`]: e.target.value })} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Correct Option</label>
                <select className="form-input" value={questionForm.correctOption}
                  onChange={e => setQuestionForm({ ...questionForm, correctOption: e.target.value })}>
                  {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o}>Option {o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Points</label>
                <input className="form-input" type="number" value={questionForm.points}
                  onChange={e => setQuestionForm({ ...questionForm, points: e.target.value })} />
              </div>
              <button className="admin-btn" onClick={() =>
                submit('question', questionForm, () =>
                  setQuestionForm({ verseId: '', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', points: 50 }))
              }>
                Add Question
              </button>
            </div>
          </div>
        )}

        {/* MANAGE */}
        {tab === 'manage' && (
          <div>
            <h2 className="admin-title">🗑️ Manage Content</h2>

            <h3 className="manage-subtitle">📜 Verses ({verses.length})</h3>
            <div className="manage-list">
              {verses.map(v => (
                <div key={v._id} className="manage-item">
                  <div className="manage-item-info">
                    <span className="manage-item-title">
                      {v.scriptureId?.title} — Ch.{v.adhyayaId?.number} Verse {v.verseNumber}
                    </span>
                    <span className="manage-item-sub">{v.sanskrit?.slice(0, 60)}...</span>
                  </div>
                  <button className="delete-btn" onClick={() => deleteItem('verse', v._id)}>
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;