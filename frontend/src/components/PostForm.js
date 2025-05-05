import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 글 작성 완료 시 게시글 리스트로 이동
  const handleList = () => navigate('/board');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (file) formData.append('file', file);

      await axios.post(
        'http://localhost:5000/api/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setTitle('');
      setContent('');
      setFile(null);
      alert('글작성이 완료되었습니다!');
      navigate('/board');
    } catch (err) {
      alert('게시글 작성에 실패했습니다.\n' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>

      <div className="post-form-group">
        <input
          className="post-form-input"
          type="text"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="post-form-group">
        <textarea
          className="post-form-textarea"
          placeholder="내용"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={6}
        />
      </div>
      <div className="post-form-group post-form-file-row">
        <label className="post-form-file-label">첨부파일</label>
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="post-form-file"
        />
      </div>
      <div className="post-form-btns">
        <button type="submit" className="btn btn-blue" disabled={loading}>
          {loading ? '작성 중...' : '글 작성'}
        </button>
        <button
          type="button"
          className="btn btn-gray"
          onClick={handleList}
          style={{ marginLeft: '10px' }}
        >
          목록으로
        </button>
      </div>
    </form>
  );
}

export default PostForm;
