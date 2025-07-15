import React, { useState } from "react";
import "../styles/ProfilePage.css";
import FeedSection from "../components/Section/FeedSection";
import InquirySection from "../components/Section/InquirySection";
import EditSection from "../components/Section/EditSection";
import WithdrawSection from "../components/Section/WithdrawSection";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("피드");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderSection = () => {
    switch (activeTab) {
      case "피드":
        return <FeedSection />;
      case "1:1 문의":
        return <InquirySection />;
      case "정보 수정":
        return <EditSection />;
      case "회원 탈퇴":
        return <WithdrawSection />;
      default:
        return <p>선택된 탭의 콘텐츠가 없습니다.</p>;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <div className="profile-placeholder"></div>
          <h2 className="sidebar-nickname">@nickname</h2>
        </div>
        <div className="menu-item" onClick={() => handleTabChange("피드")}>
          피드
        </div>
        <div className="menu-item" onClick={() => handleTabChange("정보 수정")}>
          정보 수정
        </div>
        <div className="menu-item" onClick={() => handleTabChange("1:1 문의")}>
          1:1 컨설팅
        </div>

        <div className="menu-item" onClick={() => handleTabChange("회원 탈퇴")}>
          회원 탈퇴
        </div>
      </div>
      <div className="profile-content">{renderSection()}</div>
    </div>
  );
};

export default ProfilePage;