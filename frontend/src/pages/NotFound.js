import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem'
  }}>
    <div style={{fontSize:'6rem', marginBottom:'1rem'}}>ॐ</div>
    <h1 style={{
      fontFamily:'Cinzel Decorative, cursive',
      fontSize:'3rem',
      background:'linear-gradient(135deg, #e8b84b, #e05c1a)',
      WebkitBackgroundClip:'text',
      WebkitTextFillColor:'transparent',
      marginBottom:'1rem'
    }}>
      404
    </h1>
    <p style={{color:'var(--text-muted)', fontStyle:'italic', marginBottom:'2rem', fontSize:'1.1rem'}}>
      This path does not exist. Return to the sacred journey.
    </p>
    <Link to="/" style={{
      fontFamily:'Cinzel, serif',
      fontSize:'0.8rem',
      letterSpacing:'0.2em',
      textTransform:'uppercase',
      padding:'1rem 2.5rem',
      background:'linear-gradient(135deg, #c9922a, #e05c1a)',
      color:'#0a0805',
      textDecoration:'none',
      fontWeight:'600'
    }}>
      Return Home
    </Link>
  </div>
);

export default NotFound;