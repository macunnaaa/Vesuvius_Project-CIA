import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });

  const handleAuth = async () => {
    const url = isRegister ? 'register' : 'login';
    try {
      const res = await axios.post(`http://127.0.0.1:8000/${url}`, form);
      if (!isRegister) {
        setUsername(form.username);
        setIsLoggedIn(true);
      } else {
        alert("Registration Successful! Please Login.");
        setIsRegister(false);
      }
    } catch {
      alert("Invalid Credentials or Connection Error!");
    }
  };

  if (isLoggedIn) return <Dashboard username={username} />;

  // UI Styles matching Dashboard
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2f3', // Dashboard background color
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '50px',
    borderRadius: '25px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    width: '400px',
    textAlign: 'center',
    border: '1px solid #d1d9e6'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    margin: '10px 0',
    borderRadius: '10px',
    border: '1px solid #d1d9e6',
    backgroundColor: '#f8f9fa',
    fontSize: '14px',
    outline: 'none'
  };

  const primaryButtonStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: '#E50914',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.2)',
    transition: '0.3s'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a' }}>
          Vesuvius Ai  <span style={{ color: '#E50914' }}>2.0</span>
        </h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
          {isRegister ? 'Create Research Account' : 'Vesuvius AI Portal Access'}
        </p>

        <input 
          type="text" 
          placeholder="Username" 
          style={inputStyle} 
          onChange={e => setForm({ ...form, username: e.target.value })} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={inputStyle} 
          onChange={e => setForm({ ...form, password: e.target.value })} 
        />

        <button 
          onClick={handleAuth} 
          style={primaryButtonStyle}
          onMouseOver={e => e.target.style.backgroundColor = '#b20710'}
          onMouseOut={e => e.target.style.backgroundColor = '#E50914'}
        >
          {isRegister ? 'JOIN RESEARCH' : 'ACCESS PORTAL'}
        </button>

        <p 
          onClick={() => setIsRegister(!isRegister)} 
          style={{ marginTop: '25px', color: '#666', cursor: 'pointer', fontSize: '13px' }}
        >
          {isRegister ? 'Already have an account? Login' : "New researcher? Create Account"}
        </p>
      </div>
    </div>
  );
}

export default App;