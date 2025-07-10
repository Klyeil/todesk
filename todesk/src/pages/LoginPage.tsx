import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5003/api/user/login', formData);
      localStorage.setItem('token', response.data.token); // 토큰 저장
      alert(response.data.message);
      window.location.href = '/'; // 로그인 후 홈으로 리다이렉트
    } catch (error) {
      alert('로그인 실패');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">이메일과 비밀번호를 입력하세요</p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="label">이메일</label>
            <input
              type="email"
              name="email"
              className="login-input-field"
              placeholder="honggildong@todesk.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="login-form-group">
            <label className="label">비밀번호</label>
            <input
              type="password"
              name="password"
              className="login-input-field"
              placeholder="8~16자의 영문 대/소문자, 숫자, 특수문자"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="login-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" /> 이메일 정보 저장
            </label>
            <Link to="/find" className="find-link">이메일/비밀번호 찾기</Link>
          </div>

          <button type="submit" className="login-submit-button">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;