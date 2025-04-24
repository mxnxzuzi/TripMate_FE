import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoadingPage.css';
import { LoadScript } from '@react-google-maps/api';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // 로딩바 증가
  useState(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onLoad={() => {
        setTimeout(() => navigate('/RecommendationPlan_noLogin'), 3000);
      }}
    >
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
    </LoadScript>
  );
};

export default LoadingPage;
