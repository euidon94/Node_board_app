import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', { username, password });
      localStorage.setItem('token', res.data.token);
      alert('로그인 성공');
      navigate('/board');
    } catch {
      alert('로그인 실패');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="아이디"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="login-input"
        />
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>
      <div className="signup-link">
        <button onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
