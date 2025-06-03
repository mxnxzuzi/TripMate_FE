import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanContext from '../context/PlanContext';
import axios from 'axios';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
  const { planData } = useContext(PlanContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // 로딩바 증가
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.3; 
      });
    }, 100); 

    return () => clearInterval(interval);
  }, []);



  // 컴포넌트 마운트 시 handleLoad 호출
  useEffect(() => {
    handleLoad();
  }, []);

  const handleLoad = async () => {

  try {
    const response = await axios.post('http://localhost:8080/plans', planData);
    setTimeout(() => {
      navigate('/RecommendationPlan', { state: { plan: response.data.result } });
    }, 3000);
  } catch (error) {
    console.error('추천 실패:', error);
    setHasError(true);
    alert('계획을 생성하던 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

  if (hasError) {
    return (
      <div className="loading-container">
        <div className="error-text">여행 일정 생성 중 오류가 발생했습니다 😢</div>
        <br/>
        <button className="error-button" onClick={() => navigate('/select-destination')}>뒤로가기</button>
      </div>
    );
  }

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