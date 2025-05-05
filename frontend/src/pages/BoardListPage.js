import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardList from '../components/BoardList';
import './BoardListPage.css';

function BoardListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="board-list-page-container">
      <div className="board-list-page-header">
        <button className="btn btn-gray" onClick={handleLogout}>로그아웃</button>
      </div>
      <h1 className="board-list-page-title">게시판</h1>
      <BoardList search={search} />
      <div className="board-list-page-actions">
        <input
          type="text"
          className="board-list-page-input"
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-blue" type="button" onClick={() => navigate('/write')}>글작성</button>
      </div>
    </div>
  );
}

export default BoardListPage;
