import React from 'react';
import '../styles/ProfileCard.css';

const ProfileCard = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        
        {/* 닫기 버튼 추가 */}
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>김동덕 ✏️</h2>
        <p className="nickname">솜솜잉 ✏️</p>
        <p className="email">doungduk@naver.com ✏️</p>
        <p className="id">ddong1234 ✏️</p>
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
