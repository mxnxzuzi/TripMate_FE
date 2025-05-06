import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoadingPage.css';
import { LoadScript } from '@react-google-maps/api';

const LoadingPage = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    const handleKakaoShare = () => {
        if (!window.Kakao) {
            console.error("Kakao SDK가 로드되지 않았습니다.");
            return;
        }

        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('49cc6290cf6b803a69b79c47a94528b5');
        }

        window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '친구와 여행 일정 공유하기',
                description: '같이 계획 세워요!',
                imageUrl: 'https://이미지주소', // 실제 이미지 주소로 교체
                link: {
                    mobileWebUrl: 'https://yourdomain.com', //도메인 교체
                    webUrl: 'https://yourdomain.com',
                },
            },
            buttons: [
                {
                    title: '일정보기',
                    link: {
                        mobileWebUrl: 'https://yourdomain.com', //도메인 교체
                        webUrl: 'https://yourdomain.com',
                    },
                },
            ],
        });
    };

    useEffect(() => {
        // 카카오 공유 자동 실행
        handleKakaoShare();

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 0.5;
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
                    <div className="earth-emoji">📲</div>
                    <div className="loading-text">
                        <p>여행 일정 방에</p>
                        <p>친구를 초대하고 있어요</p>
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
