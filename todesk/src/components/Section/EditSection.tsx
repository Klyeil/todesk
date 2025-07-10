
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/EditSection.css'; // 새로 만든 CSS 파일을 임포트합니다.

// Daum 주소 API 타입 정의
declare global {
  interface Window {
    daum: any;
  }
}

interface EditFormData {
  email: string;
  password?: string; // 선택적 필드로 변경
  confirmPassword?: string; // 선택적 필드로 변경
  name: string;
  nickname: string;
  birthdate: string;
  phone: string;
  address: string;
  detailAddress?: string; // 선택적 필드로 변경
}

const EditSection: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState<EditFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    birthdate: '',
    phone: '',
    address: '',
    detailAddress: '',
  });
  const [isNicknameChecked, setIsNicknameChecked] = useState(true); // 닉네임은 처음엔 유효한 상태
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Daum 주소 스크립트 로딩
  useEffect(() => {
    const loadDaumScript = () => {
      if (window.daum && window.daum.Postcode) {
        setIsScriptLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    };
    loadDaumScript();
  }, []);

  // 사용자 정보 불러오기
  useEffect(() => {
    if (user && !loading) {
      const userBirthdate = user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '';
      setFormData({
        email: user.email || '',
        nickname: user.nickname || '',
        name: user.name || '',
        birthdate: userBirthdate,
        phone: user.phone || '',
        address: user.address || '',
        detailAddress: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'nickname' && value !== user?.nickname) {
      setIsNicknameChecked(false); // 원래 닉네임에서 변경되면 중복확인 필요
    }

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(formData.password === value);
    }
  };

  const handleNicknameCheck = async () => {
    if (formData.nickname === user?.nickname) {
      alert('현재 닉네임과 동일합니다.');
      setIsNicknameChecked(true);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5003/api/user/check-nickname', {
        nickname: formData.nickname,
      });
      alert(response.data.message);
      setIsNicknameChecked(true);
    } catch (error) {
      alert((error as any).response?.data?.error || '서버 오류');
      setIsNicknameChecked(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && !passwordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인이 필요합니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updatedData: Partial<EditFormData> = {
        ...formData,
        address: `${formData.address} ${formData.detailAddress || ''}`.trim(),
      };

      // detailAddress는 백엔드 User 모델에 없으므로, updatedData에서 제거
      delete updatedData.detailAddress;

      // 비밀번호가 비어있으면 보내지 않음
      if (!formData.password) {
        delete updatedData.password;
      }
      // confirmPassword도 백엔드에 보내지 않음
      delete updatedData.confirmPassword;

      const response = await axios.put('http://localhost:5003/api/user/update', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Update response:', response.data); // response 사용
      alert('회원정보가 성공적으로 수정되었습니다.');
      // 필요하다면 페이지를 새로고침하거나 상태를 업데이트합니다.
    } catch (error) {
      alert('정보 수정 실패: ' + ((error as any).response?.data?.error || '서버 오류'));
    }
  };

  const handleComplete = (data: any) => {
    setFormData((prev) => ({ ...prev, address: data.address }));
    setShowAddressModal(false);
  };

  const executeAddressSearch = (element: HTMLElement) => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: handleComplete,
        width: '100%',
        height: '100%',
      }).embed(element);
    }
  };

  if (loading) {
    return <p>사용자 정보를 불러오는 중...</p>;
  }

  return (
    <div className="edit-section-content">
      <h2 className="edit-section-title">회원정보 수정</h2>
      <p className="edit-section-subtitle">기본정보를 수정할 수 있습니다.</p>

      <form onSubmit={handleSubmit}>
        <div className="edit-section-form-group">
          <label className="label">이메일</label>
          <input
            type="email"
            name="email"
            className="input-field"
            value={formData.email}
            disabled // 이메일은 수정 불가
          />
        </div>
        <div className="edit-section-form-group">
          <label className="label">닉네임</label>
          <div className="input-with-button">
            <input
              type="text"
              name="nickname"
              className="input-field"
              value={formData.nickname}
              onChange={handleChange}
            />
            <button type="button" className="check-button" onClick={handleNicknameCheck}>
              중복확인
            </button>
          </div>
        </div>
        <div className="edit-section-form-group">
          <label className="label">새 비밀번호</label>
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="변경할 경우에만 입력 (8~16자)"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="edit-section-form-group">
          <label className="label">새 비밀번호 확인</label>
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
        <div className="edit-section-form-group">
          <label className="label">이름</label>
          <input
            type="text"
            name="name"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="edit-section-form-group">
          <label className="label">생년월일</label>
          <input
            type="date"
            name="birthdate"
            className="input-field"
            value={formData.birthdate}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="edit-section-form-group">
          <label className="label">전화번호</label>
          <input
            type="tel"
            name="phone"
            className="input-field"
            value={formData.phone}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="edit-section-form-group">
          <label className="label">주소</label>
          <input
            type="text"
            name="address"
            className="input-field"
            placeholder="주소 검색"
            value={formData.address}
            onClick={() => {
              if (!isScriptLoaded) {
                alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
                return;
              }
              setShowAddressModal(true);
            }}
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
        <button type="submit" className="edit-section-button" disabled={!isNicknameChecked}>
          수정하기
        </button>
      </form>

      {showAddressModal && (
        <div className="address-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-header">
              <h3>주소 검색</h3>
              <button className="close-button" onClick={() => setShowAddressModal(false)}>×</button>
            </div>
            <div
              className="address-search-container"
              ref={(element) => {
                if (element) executeAddressSearch(element);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSection;
