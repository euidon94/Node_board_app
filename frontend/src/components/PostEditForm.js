import React, { useState } from 'react';
import axios from 'axios';

function PostEditForm({ post, onCancel, onSaved }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/posts/${post._id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('게시글이 성공적으로 수정되었습니다!');
      onSaved(); // 저장 후 상세페이지 새로고침
    } catch (err) {
      alert('게시글 수정에 실패했습니다.\n' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: '100%', fontSize: '1.2rem', padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={8}
          style={{ width: '100%', fontSize: '1rem', padding: '0.5rem' }}
        />
      </div>
      <button type="submit" disabled={loading} style={{ marginRight: '0.5rem' }}>
        {loading ? '수정 중...' : '저장'}
      </button>
      <button type="button" onClick={onCancel}>취소</button>
    </form>
  );
}

export default PostEditForm;
