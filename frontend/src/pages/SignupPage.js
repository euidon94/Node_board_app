import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupPage.css'; // CSS 파일 import

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
    <div className="auth-container">
      <h2 className="auth-title">회원가입</h2>
      <form onSubmit={handleSignup}>
        <input
          className="auth-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="아이디"
        />
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        <button type="submit" className="auth-button">
          회원가입
        </button>
      </form>
      <div className="auth-bottom">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="auth-link"
        >
          로그인으로
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
