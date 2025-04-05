import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import ProfileCard from './ProfileCard';
import '../styles/ProfileCard.css';

const HeaderAfterLogin = () => {
    const [showProfile, setShowProfile] = useState(false);
    return (
        <header className="header">
        <Link to="/" className="logo">TripMate</Link>
        <div className="auth-links">
            <button className="mypage" onClick={() => setShowProfile(true)}>마이페이지</button>
            <button className="logout-button" onClick={() => {
            // 로그아웃 처리 로직 (예: localStorage 삭제 후 리다이렉트)
            localStorage.removeItem('token'); 
            window.location.href = '/'; 
            }}>
            로그아웃
            </button>
        </div>
        {showProfile && <ProfileCard onClose={() => setShowProfile(false)} />}
        </header>
    );
};

export default HeaderAfterLogin;
