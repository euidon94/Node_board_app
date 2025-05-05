import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentList from '../components/CommentList';
import PostEditForm from '../components/PostEditForm';
import './PostDetailPage.css'; // CSS 파일 import

// 토큰에서 userId 추출 함수
function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const fetchPost = () => {
    axios.get(`http://localhost:5000/api/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        alert('게시글을 불러오지 못했습니다.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/posts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('게시글이 삭제되었습니다.');
      navigate('/');
    } catch (err) {
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>;
  if (!post) return <div style={{ padding: '2rem', textAlign: 'center' }}>게시글이 존재하지 않습니다.</div>;

  // 로그인한 사용자와 작성자 비교
  const userId = getUserIdFromToken();
  const authorId = post.author?._id || post.author; // populate 여부에 따라 다름

  return (
    <div className="post-detail-container">
      {editMode ? (
        <PostEditForm
          post={post}
          onCancel={() => setEditMode(false)}
          onSaved={() => {
            setEditMode(false);
            fetchPost();
          }}
        />
      ) : (
        <>
          <div className="post-detail-header">
            <h2 className="post-detail-title">{post.title}</h2>
            <div className="post-detail-meta">
              <span>작성자: <b>{post.author?.username || '익명'}</b></span>
              <span style={{ marginLeft: '1.5rem' }}>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="post-detail-content">
            {post.content}
          </div>
        </>
      )}
<div className="post-detail-btns">
  <div className="post-detail-btns-left">
    {Array.isArray(post.file) && post.file.length > 0 && post.file.some(f => f) ? (
      post.file
        .filter(f => f) // 빈 문자열/undefined/null 제거
        .map((file, idx) => (
          <a
            key={file + idx}
            href={`http://localhost:5000/api/posts/download/${file}`}
            download
            className="btn btn-download"
            style={{ marginRight: '8px' }}
          >
            첨부파일 다운로드{post.file.length > 1 ? ` (${idx + 1})` : ''}
          </a>
        ))
    ) : null}
  </div>
  <div className="post-detail-btns-right">
    <button onClick={() => navigate(-1)} className="btn btn-blue">목록으로</button>
    {!editMode && userId === String(authorId) && (
      <>
        <button onClick={() => setEditMode(true)} className="btn btn-yellow">수정</button>
        <button onClick={handleDelete} className="btn btn-red">삭제</button>
      </>
    )}
  </div>
</div>

      <CommentList postId={post._id} />
    </div>
  );
}

export default PostDetailPage;
