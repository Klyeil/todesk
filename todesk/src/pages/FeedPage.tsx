import React from 'react';
import '../styles/FeedPage.css';

const FeedPage: React.FC = () => {
  return (
    <div className="feed-page">
      <h2 className="feed-title">Desk Setup Feed</h2>
      <p className="feed-description">Explore the latest desk setup inspirations.</p>
      {/* MongoDB 데이터를 가져와 피드를 렌더링하는 로직 추가 예정 */}
    </div>
  );
};

export default FeedPage;