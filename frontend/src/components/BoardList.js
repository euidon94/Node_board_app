import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 10;

function BoardList({ reload, search }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
        setPage(1); // 검색/새로고침 시 첫 페이지로 이동
      })
      .catch(err => {
        alert('게시글을 불러오지 못했습니다.');
        setLoading(false);
      });
  }, [reload]);

  // 검색 필터
  const filteredPosts = search
    ? posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  // 페이지네이션 계산
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIdx = (page - 1) * POSTS_PER_PAGE;
  const endIdx = startIdx + POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(startIdx, endIdx);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <table className="board-table">
        <thead>
          <tr>
            <th style={{ width: '44px' }}>No</th>
            <th>글제목</th>
            <th style={{ width: '80px' }}>작성자</th>
            <th style={{ width: '90px' }}>시간</th>
          </tr>
        </thead>
        <tbody>
          {pagePosts.length === 0 ? (
            <tr>
              <td colSpan="4">게시글이 없습니다.</td>
            </tr>
          ) : (
            pagePosts.map((post, idx) => (
              <tr key={post._id}>
                <td>{totalPosts - (startIdx + idx)}</td>
                <td style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <Link to={`/post/${post._id}`} className="board-title-link">
                    {post.title}
                  </Link>
                </td>
                <td>{post.author?.username || '익명'}</td>
                <td>
                  <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                  <div className="post-time">{new Date(post.createdAt).toTimeString().slice(0, 8)}</div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="board-pagination">
          <button
            className="btn"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              className={`btn ${page === idx + 1 ? 'btn-blue' : ''}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="btn"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default BoardList;
