import React from "react";
import '../styles/ProfilePage.css';

const ProfilePage: React.FC = () => {
    return (
        <div className="profile-page">
          <div className="profile-sidebar">
            <div className="sidebar-headerr">
              <h2 className="sidebar-nickname">@nickname</h2>
            </div>
    
            <div className="menu-itemm">피드</div>
            <div className="menu-itemm">1:1 문의</div>
            <div className="menu-itemm">정보 수정</div>
            <div className="menu-itemm">회원 탈퇴</div>
          </div>
    
          <div className="profile-content">
            {/* 기본 콘텐츠 예시 */}
            <p>여기에 선택된 탭의 콘텐츠가 표시됩니다.</p>
          </div>
        </div>
      );
};

export default ProfilePage;