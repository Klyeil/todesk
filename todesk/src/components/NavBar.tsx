import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';
import axios from 'axios';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 토큰 확인
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰 유효성 검증 (선택적: 서버에 요청)
      axios.get('http://localhost:5003/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => setIsLoggedIn(true))
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav_logo">
        <img src={logo} alt="Todesk Logo" className="logo-image" />
      </Link>

      <ul className="center-menu">
        <li>
          <Link to="/consult">1:1 컨설팅</Link>
        </li>
        <li>
          <Link to="/community">커뮤니티</Link>
        </li>
        <li>
          <Link to="/desk">데스크 셋업</Link>
        </li>
      </ul>

      <div className="nav-right">
        {isLoggedIn ? (
          <>
            <ul className="right-signup">
              <li>
                <Link to="/profile">마이페이지</Link>
              </li>
            </ul>
            <Link to="/" className="nav-button login-link" onClick={handleLogout}>
              로그아웃
            </Link>
          </>
        ) : (
          <>
            <ul className="right-signup">
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
            </ul>
            <Link to="/login" className="nav-button login-link">
              로그인
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;