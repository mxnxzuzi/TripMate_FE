import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfileCard.css';

const ProfileCard = ({ onClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nickname: '', email: '', profileImage: null });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/consumers/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUserInfo(res.data);
      setFormData({
        nickname: res.data.nickname || '',
        email: res.data.email || '',
        profileImage: null,
      });
      setPreviewImage(res.data.profile); 
    })
    .catch((err) => {
      console.error("❌ 사용자 정보 가져오기 실패", err);
    });
  }, []);

  const handleEditClick = () => setEditMode(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };
  const handleSave = async () => {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("nickname", formData.nickname);
      data.append("email", formData.email);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      try {
        await axios.patch("http://localhost:8080/consumers/me", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setUserInfo(prev => ({
          ...prev,
          nickname: formData.nickname,
          email: formData.email,
          profile: previewImage,
        }));
        setEditMode(false);
      } catch (err) {
        console.error("❌ 사용자 정보 수정 실패", err);
        alert("수정 중 문제가 발생했습니다.");
      }
  };

  if (!userInfo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" onClick={onClose}>×</button>

        {editMode ? (
          <>
            {previewImage && (
              <img src={previewImage} alt="미리보기" className="profile-image" />
            )}
            <input className="p-file" type="file" accept="image/*" onChange={handleImageChange} />
            <input
              className="p-edit"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임"
            />
            <input
              className="p-edit"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
            />
            <button className="editSaveBtn" onClick={handleSave}>저장</button>
          </>
        ) : (
          <>
            <div className="p-box">
              <img src={userInfo.profile} alt="프로필 이미지" className="profile-image" />
              <h2>{userInfo.nickname}</h2>
            </div>
            <p className="email">{userInfo.email}</p>
            <p className="nickname">{userInfo.name}</p>
            <button className='selectBtn' onClick={handleEditClick}>계정수정</button>
          </>
        )}

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
