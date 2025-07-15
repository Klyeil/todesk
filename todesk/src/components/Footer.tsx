import React from 'react';
import '../styles/Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>회사 정보</h3>
          <p>Todesk</p>
          <p>서울특별시 강남구 테헤란로 123</p>
          <p>이메일: info@todesk.today</p>
          <p>전화: 02-1234-5678</p>
        </div>
        <div className="footer-section">
          <h3>빠른 링크</h3>
          <ul>
            <li><a href="/terms">이용 약관</a></li>
            <li><a href="/privacy">개인정보 처리방침</a></li>
            <li><a href="/contact">문의하기</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>소셜 미디어</h3>
          <div className="social-icons">
            <a href="https://facebook.com"><FaFacebookF /></a>
            <a href="https://twitter.com"><FaTwitter /></a>
            <a href="https://instagram.com"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Todesk All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;