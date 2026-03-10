import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import './Admin.css';

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

  // Audio states
  const [audioFile, setAudioFile] = useState(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [selectedVerseForAudio, setSelectedVerseForAudio] = useState('');

  // CSV Bulk Upload states
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);

  // Form states
  const [scriptureForm, setScriptureForm] = useState({
    title: '', description: '', icon: '📖', totalAdhyayas: 0, totalVerses: 0
  });
  const [adhyayaForm, setAdhyayaForm] = useState({
    scriptureId: '', number: '', title: '', description: '', totalVerses: 0
  });
  const [verseForm, setVerseForm] = useState({
    scriptureId: '', adhyayaId: '', verseNumber: '',
    sanskrit: '', transliteration: '', meaning: '', meaningHindi: ''
  });
  const [questionForm, setQuestionForm] = useState({
    verseId: '', question: '', optionA: '', optionB: '',
    optionC: '', optionD: '', correctOption: 'A', points: 50
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    loadAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const submit = async (url, data, resetFn) => {
    try {
      await axios.post(`${API}/${url}`, data, { headers });
      showMsg('✅ Added successfully!');
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

  const uploadAudio = async () => {
    if (!selectedVerseForAudio || !audioFile) {
      showMsg('Please select a verse and audio file', 'error'); return;
    }
    setAudioUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      await axios.post(`${API}/audio/${selectedVerseForAudio}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      showMsg('🎧 Audio uploaded successfully!');
      setAudioFile(null);
      setSelectedVerseForAudio('');
      loadAll();
    } catch (err) {
      showMsg('Audio upload failed', 'error');
    }
    setAudioUploading(false);
  };

  const deleteAudio = async (verseId) => {
    if (!window.confirm('Delete audio for this verse?')) return;
    try {
      await axios.delete(`${API}/audio/${verseId}`, { headers });
      showMsg('🗑️ Audio deleted!');
      loadAll();
    } catch (err) {
      showMsg('Delete failed', 'error');
    }
  };

  const uploadCSV = async () => {
    if (!csvFile) { showMsg('Please select a CSV file', 'error'); return; }
    setCsvUploading(true);
    setCsvResult(null);
    try {
      const formData = new FormData();
      formData.append('csvfile', csvFile);
      const res = await axios.post(`${API}/bulk-upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setCsvResult(res.data);
      showMsg(`✅ Upload complete! ${res.data.versesCreated} verses, ${res.data.questionsCreated} questions added.`);
      setCsvFile(null);
      loadAll();
    } catch (err) {
      showMsg(err.response?.data?.message || 'CSV upload failed', 'error');
    }
    setCsvUploading(false);
  };

  const downloadTemplate = () => {
    const header = 'scriptureId,adhyayaId,verseNumber,sanskrit,transliteration,meaning,meaningHindi,question,optionA,optionB,optionC,optionD,correctOption,points';
    const example = `${scriptures[0]?._id || 'SCRIPTURE_ID'},${adhyayas[0]?._id || 'ADHYAYA_ID'},1,ॐ तत् सत्,Om Tat Sat,That is the Truth,वह सत्य है,What does Om represent?,The Absolute,A greeting,A prayer,A salutation,A,50`;
    const blob = new Blob([header + '\n' + example], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tatvapath_bulk_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = ['dashboard', 'scripture', 'adhyaya', 'verse', 'question', 'audio', 'bulk', 'manage'];

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">⚙️ Admin Panel</div>
        {tabs.map(t => (
          <div key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'dashboard' && '📊 Dashboard'}
            {t === 'scripture' && '📖 Add Scripture'}
            {t === 'adhyaya' && '📚 Add Adhyaya'}
            {t === 'verse' && '📜 Add Verse'}
            {t === 'question' && '❓ Add Question'}
            {t === 'audio' && '🎧 Upload Audio'}
            {t === 'bulk' && '📂 Bulk Upload'}
            {t === 'manage' && '🗑️ Manage Content'}
          </div>
        ))}
        <div className="admin-tab" onClick={() => navigate('/')}>← Back to Site</div>
      </div>

      <div className="admin-main">

        {msg.text && <div className={`admin-msg ${msg.type}`}>{msg.text}</div>}

        {/* ===== DASHBOARD ===== */}
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

        {/* ===== ADD SCRIPTURE ===== */}
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
                  <input className="form-input" type={f.type || 'text'} placeholder={f.placeholder}
                    value={scriptureForm[f.key]}
                    onChange={e => setScriptureForm({ ...scriptureForm, [f.key]: e.target.value })} />
                </div>
              ))}
              <button className="admin-btn" onClick={() =>
                submit('scripture', scriptureForm, () =>
                  setScriptureForm({ title: '', description: '', icon: '📖', totalAdhyayas: 0, totalVerses: 0 }))}>
                Add Scripture
              </button>
            </div>
          </div>
        )}

        {/* ===== ADD ADHYAYA ===== */}
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
                  <input className="form-input" type={f.type || 'text'} placeholder={f.placeholder}
                    value={adhyayaForm[f.key]}
                    onChange={e => setAdhyayaForm({ ...adhyayaForm, [f.key]: e.target.value })} />
                </div>
              ))}
              <button className="admin-btn" onClick={() =>
                submit('adhyaya', adhyayaForm, () =>
                  setAdhyayaForm({ scriptureId: '', number: '', title: '', description: '', totalVerses: 0 }))}>
                Add Adhyaya
              </button>
            </div>
          </div>
        )}

        {/* ===== ADD VERSE ===== */}
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
                  {adhyayas.filter(a => a.scriptureId?._id === verseForm.scriptureId).map(a => (
                    <option key={a._id} value={a._id}>Chapter {a.number} — {a.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Verse Number</label>
                <input className="form-input" type="number" placeholder="1"
                  value={verseForm.verseNumber}
                  onChange={e => setVerseForm({ ...verseForm, verseNumber: e.target.value })} />
              </div>
              {[
                { label: 'Sanskrit Text', key: 'sanskrit', placeholder: 'Sanskrit verse...' },
                { label: 'Transliteration', key: 'transliteration', placeholder: 'Roman script...' },
                { label: 'English Meaning', key: 'meaning', placeholder: 'English translation...' },
                { label: 'Hindi Meaning (Optional)', key: 'meaningHindi', placeholder: 'Hindi translation...' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <textarea className="form-input form-textarea" placeholder={f.placeholder}
                    value={verseForm[f.key]}
                    onChange={e => setVerseForm({ ...verseForm, [f.key]: e.target.value })} />
                </div>
              ))}
              <button className="admin-btn" onClick={() =>
                submit('verse', verseForm, () =>
                  setVerseForm({ scriptureId: '', adhyayaId: '', verseNumber: '', sanskrit: '', transliteration: '', meaning: '', meaningHindi: '' }))}>
                Add Verse
              </button>
            </div>
          </div>
        )}

        {/* ===== ADD QUESTION ===== */}
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
                  setQuestionForm({ verseId: '', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', points: 50 }))}>
                Add Question
              </button>
            </div>
          </div>
        )}

        {/* ===== UPLOAD AUDIO ===== */}
        {tab === 'audio' && (
          <div>
            <h2 className="admin-title">🎧 Upload Verse Audio</h2>
            <div className="admin-form">
              <div className="form-group">
                <label className="form-label">Select Verse</label>
                <select className="form-input" value={selectedVerseForAudio}
                  onChange={e => setSelectedVerseForAudio(e.target.value)}>
                  <option value="">Select Verse</option>
                  {verses.map(v => (
                    <option key={v._id} value={v._id}>
                      {v.scriptureId?.title} — Ch.{v.adhyayaId?.number} Verse {v.verseNumber}
                      {v.audioUrl ? ' 🎧' : ' ❌'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Audio File (MP3 / WAV / OGG)</label>
                <input className="form-input" type="file" accept="audio/*"
                  style={{ padding: '0.5rem' }}
                  onChange={e => setAudioFile(e.target.files[0])} />
              </div>
              {audioFile && (
                <div style={{ marginBottom: '1rem', color: 'var(--gold)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              <button className="admin-btn" onClick={uploadAudio}
                disabled={!selectedVerseForAudio || !audioFile || audioUploading}>
                {audioUploading ? '⏳ Uploading...' : '⬆ Upload Audio'}
              </button>
            </div>

            <h3 className="manage-subtitle" style={{ marginTop: '3rem' }}>📜 All Verses — Audio Status</h3>
            <div className="manage-list">
              {verses.map(v => (
                <div key={v._id} className="manage-item">
                  <div className="manage-item-info">
                    <span className="manage-item-title">
                      {v.scriptureId?.title} — Ch.{v.adhyayaId?.number} Verse {v.verseNumber}
                    </span>
                    <span className="manage-item-sub">
                      {v.audioUrl ? '🎧 Audio available' : '❌ No audio uploaded yet'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    {v.audioUrl && (
                      <>
                        <audio controls style={{ height: '32px' }}><source src={v.audioUrl} /></audio>
                        <button className="delete-btn" onClick={() => deleteAudio(v._id)}>🗑️</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== BULK UPLOAD CSV ===== */}
        {tab === 'bulk' && (
          <div>
            <h2 className="admin-title">📂 Bulk Upload via CSV</h2>

            <div className="bulk-info-box">
              <h3 style={{ color: 'var(--gold2)', marginBottom: '0.8rem' }}>📋 How it works</h3>
              <p>Upload a CSV file to add multiple verses and quiz questions at once. Each row = one verse + one optional quiz question.</p>
              <ul style={{ marginTop: '0.7rem', paddingLeft: '1.2rem', lineHeight: '1.9' }}>
                <li>Existing <code>adhyayaId + verseNumber</code> combos are skipped (no duplicates)</li>
                <li>Quiz fields are optional — leave blank if no question for that verse</li>
                <li>Use the MongoDB IDs from the reference table below</li>
              </ul>
            </div>

            <div className="bulk-info-box" style={{ marginTop: '1.2rem' }}>
              <h3 style={{ color: 'var(--gold2)', marginBottom: '0.8rem' }}>🗂️ CSV Columns</h3>
              <div className="csv-columns-grid">
                {[
                  { col: 'scriptureId', desc: 'MongoDB _id of the scripture' },
                  { col: 'adhyayaId', desc: 'MongoDB _id of the adhyaya' },
                  { col: 'verseNumber', desc: 'Verse number (integer)' },
                  { col: 'sanskrit', desc: 'Sanskrit text of the verse' },
                  { col: 'transliteration', desc: 'Roman transliteration' },
                  { col: 'meaning', desc: 'English meaning' },
                  { col: 'meaningHindi', desc: 'Hindi meaning (optional)' },
                  { col: 'question', desc: 'Quiz question (optional)' },
                  { col: 'optionA', desc: 'Option A' },
                  { col: 'optionB', desc: 'Option B' },
                  { col: 'optionC', desc: 'Option C' },
                  { col: 'optionD', desc: 'Option D' },
                  { col: 'correctOption', desc: 'A / B / C / D' },
                  { col: 'points', desc: 'Points for correct answer (default: 50)' },
                ].map(({ col, desc }) => (
                  <div key={col} className="csv-col-row">
                    <code className="csv-col-name">{col}</code>
                    <span className="csv-col-desc">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {scriptures.length > 0 && (
              <div className="bulk-info-box" style={{ marginTop: '1.2rem' }}>
                <h3 style={{ color: 'var(--gold2)', marginBottom: '0.8rem' }}>🔑 Your IDs Reference</h3>
                <p style={{ marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Copy these into your CSV:</p>
                {scriptures.map(s => (
                  <div key={s._id} style={{ marginBottom: '0.8rem' }}>
                    <div className="id-ref-row">
                      <span className="id-ref-label">📖 {s.title}</span>
                      <code className="id-ref-value">{s._id}</code>
                    </div>
                    {adhyayas.filter(a => a.scriptureId?._id === s._id).map(a => (
                      <div key={a._id} className="id-ref-row" style={{ paddingLeft: '1.5rem' }}>
                        <span className="id-ref-label">📚 Ch.{a.number} — {a.title}</span>
                        <code className="id-ref-value">{a._id}</code>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <button className="admin-btn-outline" onClick={downloadTemplate}>
                ⬇ Download CSV Template
              </button>
            </div>

            <div className="admin-form" style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Select CSV File</label>
                <input className="form-input" type="file" accept=".csv,text/csv"
                  style={{ padding: '0.5rem' }}
                  onChange={e => { setCsvFile(e.target.files[0]); setCsvResult(null); }} />
              </div>
              {csvFile && (
                <div style={{ marginBottom: '1rem', color: 'var(--gold)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
              <button className="admin-btn" onClick={uploadCSV} disabled={!csvFile || csvUploading}>
                {csvUploading ? '⏳ Uploading...' : '📤 Upload CSV'}
              </button>
            </div>

            {csvResult && (
              <div className="csv-result-box" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ color: 'var(--gold2)', marginBottom: '1rem' }}>📊 Upload Results</h3>
                <div className="csv-result-stats">
                  <div className="csv-stat">
                    <span className="csv-stat-num" style={{ color: '#4ade80' }}>{csvResult.versesCreated}</span>
                    <span className="csv-stat-label">Verses Created</span>
                  </div>
                  <div className="csv-stat">
                    <span className="csv-stat-num" style={{ color: '#60a5fa' }}>{csvResult.questionsCreated}</span>
                    <span className="csv-stat-label">Questions Created</span>
                  </div>
                  <div className="csv-stat">
                    <span className="csv-stat-num" style={{ color: csvResult.errors?.length ? '#f87171' : '#4ade80' }}>
                      {csvResult.errors?.length || 0}
                    </span>
                    <span className="csv-stat-label">Errors</span>
                  </div>
                </div>
                {csvResult.errors?.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ color: '#f87171', marginBottom: '0.5rem', fontWeight: '600' }}>⚠️ Row Errors:</p>
                    <div className="csv-error-list">
                      {csvResult.errors.map((e, i) => (
                        <div key={i} className="csv-error-item">{e}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== MANAGE CONTENT ===== */}
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