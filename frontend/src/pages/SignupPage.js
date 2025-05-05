import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, password });
      alert('회원가입 성공! 로그인 해주세요.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || '회원가입 실패');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '5rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center' }}>회원가입</h2>
      <form onSubmit={handleSignup}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="아이디"
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', fontSize: '1rem' }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', fontSize: '1rem' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', background: '#0074d9', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          회원가입
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', color: '#0074d9', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem' }}
        >
          로그인으로
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
