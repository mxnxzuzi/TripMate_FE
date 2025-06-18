import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import ProfileCard from './ProfileCard';
import '../styles/ProfileCard.css';
import axios from 'axios';

const HeaderAfterLogin = ({ setIsLoggedIn, userInfo }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [showRoomForm, setShowRoomForm] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleCommunityClick = () => {
        navigate('/posts');
    };

    const handleJoinRoomSubmit = async (event) => {
        event.preventDefault();
        if (!roomId) {
            alert("방 번호를 입력해주세요.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/rooms/${roomId}/members`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("참여 완료:", response.data);
            alert("방에 입장했습니다!");
            setRoomId('');
            setShowRoomForm(false);
            navigate(`/rooms/${roomId}`);
        } catch (error) {
            console.error("방 참여 실패:", error);
            alert("방 입장에 실패했습니다.");
        }
    };

    const token = localStorage.getItem('token');

    return (
        <header className="header">
            <div className="nav-links">
                <Link to="/" className="logo">TripMate</Link>
            </div>

            <div className="auth-links" style={{display: 'flex', alignItems: 'center', gap: '40px'}}>
                {/* 로그인 상태일 때만 방 입장 보이게 */}
                {token && (
                    <>
                        {!showRoomForm ? (
                            <button className="comm" onClick={() => setShowRoomForm(true)}>방 입장</button>
                        ) : (
                            <form
                                onSubmit={handleJoinRoomSubmit}
                                style={{display: 'flex', alignItems: 'center', gap: '4px'}}
                            >
                                <input
                                    type="text"
                                    placeholder="방 번호"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    style={{height: '30px', padding: '4px 8px'}}
                                />
                                <button type="submit" style={{height: '30px', padding: '4px 8px'}}>입장</button>
                            </form>
                        )}
                    </>
                )}

                <button className="comm" onClick={handleCommunityClick}>커뮤니티</button>
                <button className="mypage" onClick={() => setShowProfile(true)}>마이페이지</button>
                <button className="logout-button" onClick={handleLogout}>로그아웃</button>
            </div>

            {showProfile && <ProfileCard onClose={() => setShowProfile(false)} userInfo={userInfo}/>}
        </header>

    );
};

export default HeaderAfterLogin;
