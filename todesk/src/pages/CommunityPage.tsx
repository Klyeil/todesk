import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/CommunityPage.css';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: { _id: string; nickname: string };
  views?: number; // 조회수 (선택적, 기본값 0으로 가정)
  category: string; // 카테고리 추가
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchPosts = async (pageNum: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ posts: Post[] }>(
        `http://localhost:5003/api/posts?page=${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newPosts = response.data.posts || [];
      setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(newPosts.length >= 10);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError((err as any).response?.data?.error || '게시물을 가져오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handlePostClick = (id: string) => {
    navigate(`/community/${id}`);
  };

  const handleCreateClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/community/post');
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
      fetchPosts(page + 1);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // 공지사항과 일반 게시물 분리
  const noticePosts = posts.filter(post => post.category === '공지');
  const regularPosts = posts.filter(post => post.category !== '공지');

  // 일반 게시물 정렬 (오래된 순)
  const sortedRegularPosts = [...regularPosts].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="community-page">
      <div className="community-container">
        <div className="title">
          <div className="title-text">
            <h1 className="community-main-title">커뮤니티</h1>
            <p className="community-subtitle">데스크 셋업과 관련된 이야기를 나눠보세요.</p>
          </div>
          <button className="create-button" onClick={handleCreateClick}>
            글쓰기
          </button>
        </div>
        <div className="post-table">
          <div className="post-header">
            <span className="header-no">번호</span>
            <span className="header-title">제목</span>
            <span className="header-author">작성자</span>
            <span className="header-date">작성일</span>
            <span className="header-views">조회</span>
          </div>
          {/* 공지사항 표시 */}
          {noticePosts.length > 0 && (
            noticePosts.map((post) => (
              <div key={post._id} className="post-item notice" onClick={() => handlePostClick(post._id)}>
                <span className="post-no">[공지]</span>
                <span className="post-title">{post.title}</span>
                <span className="post-author">{post.userId.nickname}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="post-views">{post.views || 0}</span>
              </div>
            ))
          )}
          {/* 일반 게시물 표시 (최신 순으로 렌더링, 번호는 오래된 순) */}
          {sortedRegularPosts.length > 0 || noticePosts.length === 0 ? (
            [...sortedRegularPosts].reverse().map((post, index) => (
              <div key={post._id} className="post-item" onClick={() => handlePostClick(post._id)}>
                <span className="post-no">{sortedRegularPosts.length - 1 - index}</span> {/* 오래된 순 번호 (0부터) */}
                <span className="post-title">{post.title}</span>
                <span className="post-author">{post.userId.nickname}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="post-views">{post.views || 0}</span>
              </div>
            ))
          ) : (
            <div className="post-item empty">
              <span className="post-no"></span>
              <span className="post-title">게시물이 없습니다.</span>
              <span className="post-author"></span>
              <span className="post-date"></span>
              <span className="post-views"></span>
            </div>
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

export default CommunityPage;