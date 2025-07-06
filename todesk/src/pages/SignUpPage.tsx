import React, { useState, useEffect } from 'react';
import '../styles/SignUpPage.css';
import axios from 'axios';

// Daum 주소 API 타입 정의
declare global {
  interface Window {
    daum: any;
  }
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    birthdate: '',
    phone: '',
    address: '', // 기본 주소
    detailAddress: '', // 상세 주소
  });
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 컴포넌트 마운트 시 스크립트 미리 로딩
  useEffect(() => {
    const loadDaumScript = () => {
      // 이미 로드되어 있는지 확인
      if (window.daum && window.daum.Postcode) {
        setIsScriptLoaded(true);
        return;
      }

      // 기존 스크립트 태그가 있는지 확인
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setIsScriptLoaded(true));
        return;
      }

      // 새로운 스크립트 태그 생성
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => console.error('Daum Postcode script loading failed');
      document.head.appendChild(script);
    };

    loadDaumScript();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(formData.password === value);
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.post('http://localhost:5003/api/user/check-nickname', {
        nickname: formData.nickname,
      });
      alert(response.data.message);
      setIsNicknameChecked(true);
    } catch (error) {
      alert(((error as any).response?.data?.error || '서버 오류'));
      setIsNicknameChecked(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인이 필요합니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5003/api/user/signup', {
        ...formData,
        address: `${formData.address} ${formData.detailAddress}`,
      });
      localStorage.setItem('token', response.data.token);
      alert(response.data.message);
      window.location.href = '/';
    } catch (error) {
      alert('회원가입 실패: ' + ((error as any).response?.data?.error || '서버 오류'));
    }
  };

  // 주소 검색 완료 시 호출될 함수
  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setFormData((prev) => ({ ...prev, address: fullAddress }));
    setShowAddressModal(false); // 모달 닫기
  };

  // 주소 검색 버튼 클릭 핸들러
  const handleAddressClick = () => {
    if (!isScriptLoaded) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setShowAddressModal(true);
  };

  // 모달 내부에서 주소 검색 실행
  const executeAddressSearch = (element: HTMLElement) => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: handleComplete,
        width: '100%',
        height: '100%',
      }).embed(element);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setShowAddressModal(false);
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
            <button type="button" className="check-button" onClick={handleNicknameCheck}>
              중복확인
            </button>
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
            name="confirmPassword"
            className={`input-field ${!passwordMatch ? 'error' : ''}`}
            placeholder="비밀번호를 다시 입력해 주세요."
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {!passwordMatch && <p className="error-message">비밀번호가 일치하지 않습니다!</p>}
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
            placeholder="주소 검색"
            value={formData.address}
            onClick={handleAddressClick}
            readOnly
          />
          <input
            type="text"
            name="detailAddress"
            className="input-field"
            placeholder="상세 주소"
            value={formData.detailAddress}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button" disabled={!passwordMatch || !isNicknameChecked}>
          회원가입
        </button>
      </form>

      {/* 주소 검색 모달 */}
      {showAddressModal && (
        <div className="address-modal-overlay" onClick={closeModal}>
          <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-header">
              <h3>주소 검색</h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div 
              className="address-search-container"
              ref={(element) => {
                if (element && showAddressModal) {
                  executeAddressSearch(element);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;