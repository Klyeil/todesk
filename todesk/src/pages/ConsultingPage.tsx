import React from 'react';
import '../styles/ConsultingPage.css';
import { IoCheckmark } from "react-icons/io5";

const ConsultingPage: React.FC = () => {
  return (
    <div className="consulting-page">
      <header className="consulting-header">
        <h1>데스크 셋업 플랜</h1>
        <p>당신의 데스크에 맞춘 최적의 셋업을 제공합니다.</p>
      </header>
      <div className="consulting-box">
        <div className="consulting-plans">
          <div className="plan-card1">
            <h2>견적 Plan</h2>
            <div className="plan-subtitle">
              <p className="plan-price">₩50,000</p>
              <p className="plan-price-sub">
                / 프로젝트당
              </p>
            </div>
            <ul className="plan-features">
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>
            </ul>
            <button className="plan-button2">신청하기</button>
          </div>
          <div className="plan-card2">
            <h2>견적 & 출장 Plan</h2>
            <div className="plan-subtitle">
              <p className="plan-price">₩150,000</p>
              <p className="plan-price-sub">
                / 프로젝트당
              </p>
            </div>
            <ul className="plan-features">
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>
              <li><IoCheckmark className='plan-check'/> 고객 맞춤형 견적 제공</li>              
            </ul>
            <button className="plan-button">신청하기</button>
          </div>
        </div>
        <div className="sub-description">
          <p>· 결제 후 7일 이내 서비스를 이용하지 않으신 경우 환불이 가능합니다.</p>
          <p>· Plan 결재 이후 마이페이지 혹은 현재 페이지에서 꼭 견적 작성 부탁드립니다.</p>
          <p>· 결제 이후 3일 이내 서비스를 이용하지 않으신 경우 환불이 가능합니다.</p>
          <p>· 결제 이후 3일 이내 서비스를 이용하지 않으신 경우 환불이 가능합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultingPage;

