import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BoardListPage from './pages/BoardListPage';
import PostFormPage from './pages/PostFormPage';
import PostDetailPage from './pages/PostDetailPage'; // 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/board" element={<BoardListPage />} />
        <Route path="/write" element={<PostFormPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
