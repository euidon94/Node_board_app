import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserIdFromToken, getUsernameFromToken } from '../utils/auth';

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const username = getUsernameFromToken();
  const userId = getUserIdFromToken();

  const fetchComments = () => {
    axios.get(`http://localhost:5000/api/comments/${postId}`)
      .then(res => setComments(res.data));
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:5000/api/comments/${postId}`,
      { content, author: username },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setContent('');
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(
      `http://localhost:5000/api/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchComments();
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditingContent(comment.content);
  };

  const handleEdit = async (commentId) => {
    if (!editingContent.trim()) return;
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/comments/${commentId}`,
      { content: editingContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingId(null);
    setEditingContent('');
    fetchComments();
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>댓글</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ flex: 1 }}
          required
        />
        <button type="submit">댓글 작성</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map(comment => {
          // 댓글 작성자 또는 게시글 작성자만 삭제 가능
          const canDelete = userId === comment.authorId || userId === comment.postAuthorId;
          return (
            <li key={comment._id} style={{ borderBottom: '1px solid #eee', marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.95rem' }}>
                <strong>{comment.author || '익명'}</strong> | <span style={{ color: '#888' }}>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              {editingId === comment._id ? (
                <div>
                  <input
                    type="text"
                    value={editingContent}
                    onChange={e => setEditingContent(e.target.value)}
                    style={{ width: '70%' }}
                  />
                  <button onClick={() => handleEdit(comment._id)}>저장</button>
                  <button onClick={() => setEditingId(null)}>취소</button>
                </div>
              ) : (
                <div>
                  {comment.content}
                  <span style={{ marginLeft: '1rem' }}>
                    <button onClick={() => startEdit(comment)}>수정</button>
                    {canDelete && (
                      <button onClick={() => handleDelete(comment._id)} style={{ marginLeft: '0.5rem' }}>삭제</button>
                    )}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CommentList;
