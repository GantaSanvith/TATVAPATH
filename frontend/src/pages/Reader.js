import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Reader.css';
import API_URL from '../config';
const Reader = () => {
  const { adhyayaId } = useParams();
  const { token, updatePoints } = useAuth();

  const [verses, setVerses] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch verses when page loads
  useEffect(() => {
    const fetchVerses = async () => {
      try {
        const res = await axios.get(
  `${API_URL}/api/scriptures/adhyaya/${adhyayaId}/verses`,
  { headers: { Authorization: `Bearer ${token}` } }
);
        setVerses(res.data);
        if (res.data.length > 0) selectVerse(res.data[0]);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchVerses();
  }, [adhyayaId]);

  // When user picks a verse, fetch its quiz questions
  const selectVerse = async (verse) => {
    setSelectedVerse(verse);
    setAnswered(false);
    setResult(null);
    setQuestions([]);
    setQuizLoading(true);
    try {
     const res = await axios.get(
  `${API_URL}/api/quiz/${verse._id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
    setQuizLoading(false);
  };

  // Submit quiz answer
  const submitAnswer = async (question, selectedOption) => {
    if (answered) return;
    setAnswered(true);

    try {
      const res = await axios.post(
  `${API_URL}/api/quiz/submit`,
  { questionId: question._id, selectedOption, verseId: selectedVerse._id },
  { headers: { Authorization: `Bearer ${token}` } }
);

      setResult({ ...res.data, selectedOption, correctOption: null });

      if (res.data.correct) {
        if (res.data.pointsEarned > 0) {
          updatePoints(res.data.pointsEarned);
          setShowSuccess(true);
        } else {
          showToast('✅ Already completed this verse!');
        }
        // Mark verse as completed in sidebar
        setVerses(prev => prev.map(v =>
          v._id === selectedVerse._id ? { ...v, completed: true } : v
        ));
      } else {
        showToast('❌ Incorrect! Try different questions.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load new set of questions
  const tryNewQuestions = async () => {
    setAnswered(false);
    setResult(null);
    setQuizLoading(true);
    try {
      const res = await axios.get(
  `${API_URL}/api/quiz/${selectedVerse._id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
    setQuizLoading(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const goNextVerse = () => {
    const idx = verses.findIndex(v => v._id === selectedVerse._id);
    if (idx < verses.length - 1) selectVerse(verses[idx + 1]);
  };

  const goPrevVerse = () => {
    const idx = verses.findIndex(v => v._id === selectedVerse._id);
    if (idx > 0) selectVerse(verses[idx - 1]);
  };

  if (loading) return (
    <div className="reader-loading">
      <div className="loading-om">ॐ</div>
      <p>Loading verses...</p>
    </div>
  );

  return (
    <div className="reader-page">

      {/* TOAST */}
      {toast && <div className="toast show">{toast}</div>}

      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-icon">🎉</div>
          <div className="success-title">Verse Completed!</div>
          <div className="success-pts">+{result?.pointsEarned} Points Earned</div>
          <button className="btn-primary" onClick={() => setShowSuccess(false)}>
            Continue Journey
          </button>
        </div>
      )}

      <div className="reader-layout">

        {/* SIDEBAR */}
        <div className="reader-sidebar">
          <div className="sidebar-title">Verses</div>
          <div className="verse-list">
            {verses.map((verse, idx) => (
              <div
                key={verse._id}
                className={`verse-list-item ${selectedVerse?._id === verse._id ? 'active' : ''} ${verse.completed ? 'completed' : ''}`}
                onClick={() => selectVerse(verse)}
              >
                {verse.completed ? '✅' : selectedVerse?._id === verse._id ? '▶' : '○'}
                &nbsp; Verse {verse.verseNumber}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        {selectedVerse && (
          <div className="reader-main">

            {/* BREADCRUMB */}
            <div className="verse-breadcrumb">
              Bhagavad Gita <span>›</span> Chapter <span>›</span>
              <span>Verse {selectedVerse.verseNumber}</span>
            </div>

            {/* VERSE NUMBER */}
            <div className="verse-number-display">
              {selectedVerse.verseNumber}
            </div>

            {/* SANSKRIT */}
            <div className="verse-sanskrit">
              {selectedVerse.sanskrit}
            </div>

            {/* TRANSLITERATION */}
            {selectedVerse.transliteration && (
              <div className="verse-transliteration">
                {selectedVerse.transliteration}
              </div>
            )}

            {/* MEANING */}
            <div className="verse-meaning-label">Meaning</div>
            <div className="verse-meaning">
              {selectedVerse.meaning}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="verse-nav-btns">
              <button className="btn-secondary" onClick={goPrevVerse}>
                ← Previous Verse
              </button>
              <button className="btn-secondary" onClick={goNextVerse}>
                Next Verse →
              </button>
            </div>

            {/* QUIZ SECTION */}
            <div className="task-section">
              <div className="task-label">KNOWLEDGE CHECK</div>

              {selectedVerse.completed && (
                <div className="already-completed">
                  ✅ You have already completed this verse!
                </div>
              )}

              {quizLoading && (
                <div className="quiz-loading">Loading questions...</div>
              )}

              {!quizLoading && questions.length > 0 && (
                <>
                  <div className="task-question">
                    {questions[0].question}
                  </div>

                  <div className="task-options">
                    {['A', 'B', 'C', 'D'].map(letter => (
                      <div
                        key={letter}
                        className={`task-option 
                          ${answered && result?.selectedOption === letter && result?.correct ? 'correct' : ''}
                          ${answered && result?.selectedOption === letter && !result?.correct ? 'wrong' : ''}
                          ${answered ? 'disabled' : ''}
                        `}
                        onClick={() => !answered && submitAnswer(questions[0], letter)}
                      >
                        <div className="task-option-letter">{letter}</div>
                        {questions[0][`option${letter}`]}
                      </div>
                    ))}
                  </div>

                  <div className="task-footer">
                    <div className="points-badge">✦ +{questions[0].points} Points</div>
                    {answered && !result?.correct && (
                      <button className="btn-secondary small" onClick={tryNewQuestions}>
                        Try Different Questions
                      </button>
                    )}
                  </div>
                </>
              )}

              {!quizLoading && questions.length === 0 && (
                <div className="no-questions">
                  No questions available for this verse yet.
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Reader;