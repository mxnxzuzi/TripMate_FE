import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoadingPage.css';
import { LoadScript } from '@react-google-maps/api';

const kakaoKey = process.env.REACT_APP_KAKAO_KEY;

const LoadingPage = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Kakao SDK 로드 함수
        const loadKakaoSdk = () => {
            return new Promise((resolve, reject) => {
                if (window.Kakao && window.Kakao.isInitialized()) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
                script.async = true;

                script.onload = () => {
                    if (!window.Kakao.isInitialized()) {
                        window.Kakao.init(kakaoKey);
                    }
                    resolve(); // SDK 초기화 후 resolve
                };

                script.onerror = (e) => {
                    console.error("Kakao SDK 로드 실패", e);
                    reject(e); // SDK 로딩 실패 시 reject
                };

                document.head.appendChild(script);
            });
        };

        // Kakao SDK 로드 후 실행
        loadKakaoSdk()
            .then(() => {
                window.Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: '친구와 여행 일정 공유하기',
                        description: '같이 계획 세워요!',
                        imageUrl: 'https://via.placeholder.com/400x300.png', // 실제 이미지 주소로 교체
                        link: {
                            mobileWebUrl: 'http://localhost:3000',
                            webUrl: 'http://localhost:3000',
                        },
                    },
                    buttons: [
                        {
                            title: '일정보기',
                            link: {
                                mobileWebUrl: 'http://localhost:3000',
                                webUrl: 'http://localhost:3000',
                            },
                        },
                    ],
                });
            })
            .catch((error) => {
                console.error('Kakao SDK 로드 실패:', error);
            });

        // 프로그레스 바 증가
        const interval = setInterval(() => {
            setProgress((prev) => {
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
