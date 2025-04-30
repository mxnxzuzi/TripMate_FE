import React from 'react';
import '../styles/ProfileCard.css';

const ProfileCard = ({ onClose, userInfo }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        
        {/* 닫기 버튼 추가 */}
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{userInfo.nickname} ✏️</h2>
        <p className="email">{userInfo.email} ✏️</p>
        <p className="nickname">{userInfo.name}  ✏️</p>
        {/*<p className="id">식별자 id: {userInfo.id} ✏️</p> */}
      
        <button className='deleteBtn'>계정삭제</button>
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
