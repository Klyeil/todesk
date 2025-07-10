import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import '../styles/MainPage.css';

interface Feed {
  _id: string;
  image: string;
  title: string;
  author: {
    nickname: string;
  };
}

function MainPage() {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState<Feed[]>([]);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/feeds/main');
        setFeeds(response.data);
      } catch (error) {
        console.error('피드 불러오기 실패:', error);
        setFeeds([]);
      }
    };

    fetchFeeds();
  }, []);

  const visibleFeeds = feeds.slice(0, 3);

  const handleFeedClick = (feedId: string) => {
    navigate(`/desk/${feedId}`);
  };

  return (
    <div className="main-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">나만의 완벽한 데스크셋업</h1>
          <p className="hero-subtitle">
            최고의 제품으로 만드는 당신만의 특별한 작업·공간
          </p>
          <button className="hero-button">공유하기</button>
        </div>
      </section>

      <section className="gallery-section">
        <h2 className="section-title">
          데스크 셋업
          <FaChevronRight
            onClick={() => navigate('/desk')}
            style={{ cursor: 'pointer', marginLeft: '8px', fontSize: '15px' }}
          />
        </h2>
        <div className="gallery-grid">
          {visibleFeeds.length > 0 ? (
            visibleFeeds.map((feed) => (
              <div
                key={feed._id}
                className="gallery-item"
                onClick={() => handleFeedClick(feed._id)}
              >
                <img src={`http://localhost:5003/${feed.image}`} alt={feed.title} />
                <p className="gallery-name">
                  {feed.title} <span>@{feed.author?.nickname || 'unknown'}</span>
                </p>
              </div>
            ))
          ) : (
            <p>갤러리에 표시할 피드가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default MainPage;