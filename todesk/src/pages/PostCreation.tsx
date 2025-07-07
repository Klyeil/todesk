import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/PostCreation.css';

const PostCreation: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('자유'); // 기본 카테고리
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!title || !content) {
      setError('제목과 내용은 필수입니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5003/api/posts',
        { title, content, category }, // 카테고리 포함
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        alert('게시물이 성공적으로 작성되었습니다!');
        navigate('/community');
      }
    } catch (err) {
      console.error('Post creation error:', err);
      setError((err as any).response?.data?.error || '게시물 작성에 실패했습니다.');
    }
  };

  return (
    <div className="post-creation-page">
      <div className="post-creation-container">
        <div className="post-creation-header">
        <h1 className="creation-main-title">게시물 작성</h1>
        <select
              className="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
        >
            <option value="공지">공지사항</option>
            <option value="자유">자유게시판</option>
            <option value="질문">질문게시판</option>
        </select>

      </div>

        <form className="creation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              required
            />
          </div>
          <div className="button-group">
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">
              작성 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreation;