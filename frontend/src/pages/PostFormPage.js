import React from 'react';
import PostForm from '../components/PostForm';
import './PostFormPage.css'; // CSS 파일 import

function PostFormPage() {
  return (
    <div className="post-form-page-container">
      <div className="post-form-card">
        <h1 className="post-form-title">글 작성</h1>
        <PostForm />
      </div>
    </div>
  );
}

export default PostFormPage;
