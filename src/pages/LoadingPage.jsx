import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import PlanContext from '../context/PlanContext';
import axios from 'axios';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
  const { planData } = useContext(PlanContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // 로딩바 증가
  useEffect(() => {
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

  const handleLoad = async () => {
    try {
      const response = await axios.post('http://localhost:8080/plans', planData);
      setTimeout(() => {
        navigate('/RecommendationPlan', { state: { plan: response.data.result } });
      }, 3000);
    } catch (error) {
      console.error('추천 실패:', error);
      alert('계획을 생성하던 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} onLoad={handleLoad}>
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