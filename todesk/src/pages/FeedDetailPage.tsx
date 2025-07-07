import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedDetailPage.css';

interface Feed {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: { _id: string; nickname: string };
  views: number;
  image?: string; // 이미지 필드 추가
}

const FeedDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<{ feed: Feed }>(
          `http://localhost:5003/api/feeds/${id}`, // FeedRoutes.ts와 일치
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFeed(response.data.feed);
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError((err as any).response?.data?.error || '피드를 가져오는 데 실패했습니다.');
      }
    };
    if (id) fetchFeed();
  }, [id]);

  if (error) {
    return <div className="feed-detail-error-message">{error}</div>;
  }

  if (!feed) {
    return <div className="feed-detail-loading">로딩 중...</div>;
  }

  return (
    <div className="feed-detail-page">
      <div className="feed-detail-container">
        <h1 className="feed-detail-title">{feed.title}</h1>
        <div className="feed-detail-meta">
          <span className="feed-detail-author">{feed.userId.nickname}</span>
          <span className="feed-detail-date">{new Date(feed.createdAt).toLocaleDateString()}</span>
          <span className="feed-detail-views">조회수 {feed.views}</span>
        </div>
        {feed.image && (
          <div className="feed-detail-image">
            <img src={`http://localhost:5003/${feed.image}`} alt={feed.title} />
          </div>
        )}
        <div className="feed-detail-content">
          <p>{feed.content}</p>
        </div>
        <div className="feed-detail-comment-section">
          <h3>댓글</h3>
          {user && (
            <button className="feed-detail-add-comment-button" onClick={() => alert('댓글 작성 기능 준비 중')}>
              댓글 작성
            </button>
          )}
        </div>
      </div>
      <button className="feed-detail-back-button" onClick={() => navigate('/feed')}>
        목록
      </button>
    </div>
  );
};

export default FeedDetailPage;