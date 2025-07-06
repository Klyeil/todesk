import React, { useState } from 'react';
import '../styles/SignUpPage.css';
import axios from 'axios';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    birthdate: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5003/api/user/signup', formData);
      localStorage.setItem('token', response.data.token); // 토큰 저장
      alert(response.data.message);
      window.location.href = '/'; // 회원가입 후 홈으로 리다이렉트
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  return (
    <div className="signup-content">
      <h2 className="signup-title">기본정보</h2>
      <p className="signup-subtitle">회원가입에 필요한 기본정보를 입력해주세요.</p>

      <form onSubmit={handleSubmit}>
        <div className="signup-form-group">
          <label className="label">이메일</label>
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="honggildong@todesk.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="signup-form-group">
          <label className="label">닉네임</label>
          <div className="input-with-button">
            <input
              type="text"
              name="nickname"
              className="input-field"
              placeholder="닉네임"
              value={formData.nickname}
              onChange={handleChange}
            />
            <button type="button" className="check-button">중복확인</button>
          </div>
        </div>
        <div className="signup-form-group">
          <label className="label">비밀번호</label>
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="8~16자의 영문 대/소문자, 숫자, 특수문자"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="signup-form-group">
          <label className="label">비밀번호 확인</label>
          <input
            type="password"
            className="input-field error"
            placeholder="비밀번호를 다시 입력해 주세요."
            value={formData.password}
            onChange={handleChange}
          />
          <p className="error-message">비밀번호가 일치하지 않습니다!</p>
        </div>
        <div className="signup-form-group">
          <label className="label">이름</label>
          <input
            type="text"
            name="name"
            className="input-field"
            placeholder="홍길동"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="signup-form-group">
          <label className="label">생년월일</label>
          <input
            type="date"
            name="birthdate"
            className="input-field"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </div>
        <div className="signup-form-group">
          <label className="label">전화번호</label>
          <input
            type="tel"
            name="phone"
            className="input-field"
            placeholder="010-1234-5678"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="signup-form-group">
          <label className="label">주소</label>
          <input
            type="text"
            name="address"
            className="input-field"
            placeholder="주소 입력"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">회원가입</button>
      </form>
    </div>
  );
};

export default SignUpPage;