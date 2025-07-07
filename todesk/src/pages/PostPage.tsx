import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/PostPage.css';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: { _id: string; nickname: string };
  views: number;
}

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<{ post: Post }>(
          `http://localhost:5003/api/posts/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPost(response.data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError((err as any).response?.data?.error || '게시물을 가져오는 데 실패했습니다.');
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (error) {
    return <div className="detail-error-message">{error}</div>;
  }

  if (!post) {
    return <div className="detail-loading">로딩 중...</div>;
  }

  return (
    <div className="detail-page">
      <div className="detail-container">
        <h1 className="detail-title">{post.title}</h1>
        <div className="detail-meta">
          <span className="detail-author">{post.userId.nickname}</span>
          <span className="detail-date">{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="detail-views">조회수 {post.views}</span>
        </div>
        <div className="detail-content">
          <p>{post.content}</p>
        </div>
        <div className="detail-comment-section">
          <h3>댓글</h3>
          {user && (
            <button className="detail-add-comment-button" onClick={() => alert('댓글 작성 기능 준비 중')}>
              댓글 작성
            </button>
          )}
        </div>

      </div>
      <button className="detail-back-button" onClick={() => navigate('/community')}>
          목록
      </button>
    </div>
  );
};

export default PostPage;

