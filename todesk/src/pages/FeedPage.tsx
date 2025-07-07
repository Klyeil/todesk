import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedPage.css';

interface Feed {
  _id: string;
  image: string;
  title?: string;
  content?: string;
  createdAt: string;
  userId: { _id: string; nickname: string };
}

const FeedPage: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchFeeds = async (pageNum: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ feeds: Feed[] }>(
        `http://localhost:5003/api/feeds?page=${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newFeeds = response.data.feeds || [];
      setFeeds((prev) => (pageNum === 1 ? newFeeds : [...prev, ...newFeeds]));
      setHasMore(newFeeds.length >= 9);
    } catch (err) {
      console.error('Error fetching feeds:', err);
      setError((err as any).response?.data?.error || '피드를 가져오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchFeeds(1);
  }, []);

  const handleImageClick = (id: string) => {
    navigate(`/desk/${id}`);
  };

  const handleUploadClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/desk/upload');
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
      fetchFeeds(page + 1);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="feed-page">
      <div className="feed-container">
        <div className="title">
          <div className="title-text">
            <h1 className="feed-main-title">데스크셋업</h1>
            <p className="feed-subtitle">여러분의 데스크셋업을 공유해보세요</p>
          </div>
          <button className="upload-button" onClick={handleUploadClick}>
            업로드
          </button>
        </div>
        <div className="feed-grid">
          {feeds.length > 0 ? (
            feeds.map((feed) => (
              <div
                key={feed._id}
                className="feed-item"
                onClick={() => handleImageClick(feed._id)}
              >
                <img
                  src={`http://localhost:5003/${feed.image}`}
                  alt={feed.title || '피드 이미지'}
                  className="feed-image"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg';
                  }}
                />
              </div>
            ))
          ) : (
            <p>피드가 없습니다.</p>
          )}
        </div>
      </div>
      {hasMore && (
        <button className="load-more-button" onClick={handleLoadMore}>
          더 보기
        </button>
      )}
    </div>
  );
};

export default FeedPage;