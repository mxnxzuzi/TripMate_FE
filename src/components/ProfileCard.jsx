import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfileCard.css';

const ProfileCard = ({ onClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/consumers/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUserInfo(res.data);
    })
    .catch((err) => {
      console.error("❌ 사용자 정보 가져오기 실패", err);
    });
  }, []);

  
  if (!userInfo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{userInfo.nickname}</h2>
        <p className="email">{userInfo.email}</p>
        <p className="nickname">{userInfo.name}</p>

        <button className='selectBtn'>계정수정</button>
        <hr />
        <div className="button-group">
          <button>내 코스</button>
          <button>좋아요 누른 게시물</button>
          <button>내 글</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
