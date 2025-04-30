import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import ProfileCard from './ProfileCard';
import '../styles/ProfileCard.css';

const HeaderAfterLogin = ({ setIsLoggedIn, userInfo }) => {
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert('로그아웃 되었습니다!');
        navigate('/');
    };

    return (
    <header className="header">
        <Link to="/" className="logo">TripMate</Link>
        <div className="auth-links">
        <button className="mypage" onClick={() => setShowProfile(true)}>마이페이지</button>
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        </div>
        {showProfile && <ProfileCard onClose={() => setShowProfile(false)} userInfo={userInfo} />}
    </header>
  );
};

export default HeaderAfterLogin;
