import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

interface Feed {
  _id: string;
  image: string;
  title: string;
  userId: {
    nickname: string;
  };
  createdAt: string;
}

const FeedSection: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      if (loading || !user || !user.id) {
        if (!user || !user.id)
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5003/api/feeds/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeeds(response.data.feeds || []);
      } catch (err) {
        console.error('피드 불러오기 실패:', err);
        setError('피드를 불러오는 데 실패했습니다.');
      }
    };

    fetchFeeds();
  }, [user, loading]);

  if (loading) {
    return <p>피드를 불러오는 중...</p>;
  }

  return (
    <div className="my-feed-section">
      {error && <div className="error-message">{error}</div>}
      {feeds.length > 0 ? (
        <div className="my-feed-grid">
          {feeds.map((feed) => (
            <div key={feed._id} className="my-feed-item">
              <img
                src={`http://localhost:5003/${feed.image}`} // uploads/ 경로 확인
                alt={feed.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; // 이미지 로드 실패 시 대체 이미지
                }}
              />
              <h3>{feed.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>작성된 피드가 없습니다.</p>
      )}
    </div>
  );
};

export default FeedSection;