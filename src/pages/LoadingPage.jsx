import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

    useEffect(() => {
    // 프로그레스 바 증가
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5; // 부드럽게 증가
      });
    }, 50);

    // 3초 후 추천 페이지로 이동 (임시)
    const timeout = setTimeout(() => {
      navigate('/RecommendationPlan_noLogin');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]); 

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="earth-emoji">🌍</div>
        <div className="loading-text">
          <p>AI가 최적의 여행 일정을</p>
          <p>생성하고 있어요</p>
          <p>잠시만 기다려 주세요</p>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
