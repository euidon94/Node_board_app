import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', { username, password });
      // JWT 토큰을 localStorage에 저장
      localStorage.setItem('token', res.data.token); // [6][8][9]
      alert('로그인 성공');
      if (onLogin) onLogin();
    } catch {
      alert('로그인 실패');
    }
  };

  const token = localStorage.getItem('token');
axios.get('http://localhost:5000/api/protected', {
  headers: { Authorization: `Bearer ${token}` }
});

localStorage.removeItem('token');



  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="아이디" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" />
      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;
