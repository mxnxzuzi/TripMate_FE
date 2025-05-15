import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import '../styles/RoomPage.css';

// 더미데이터
const initialDummyData = {
    1: [
        { time: '09:00', name: '롯데월드', type: '관광 명소', desc: '대한민국 대표 테마파크' },
        { time: '11:00', name: '고도식', type: '음식점', desc: '프리미엄 한식당' },
        { time: '13:00', name: '시그니엘 서울', type: '전망대', desc: '서울 전경을 한눈에 볼 수 있는 곳' },
        { time: '15:00', name: '커피빈', type: '카페', desc: '휴식 시간' },
        { time: '17:00', name: '서울숲', type: '자연경관', desc: '자연과 함께 힐링' },
    ],
    2: [
        { time: '09:30', name: '남산타워', type: '전망대', desc: '서울의 전경을 감상할 수 있는 대표적인 랜드마크' },
        { time: '11:30', name: '이태원 브런치 카페', type: '맛집/카페', desc: '감성 가득한 분위기에서 여유로운 브런치를 즐길 수 있는 곳' },
        { time: '13:30', name: '서울역사박물관', type: '전시/문화', desc: '서울의 과거와 현재를 한눈에 볼 수 있는 문화 공간' },
        { time: '15:30', name: '한강공원 반포지구', type: '자연/레저', desc: '시원한 강바람과 함께 자전거 타기와 산책을 즐길 수 있는 명소' },
        { time: '18:00', name: '더현대 서울', type: '쇼핑몰', desc: '최신 트렌드의 패션과 푸드를 한곳에서 경험할 수 있는 핫플레이스' },
    ],
};

const roomId = "123";
const nickname = "사용자";
const profileImg = "/images/profile.jpeg";

const mapContainerStyle = {
    width: '100%',
    height: '290px',
};

const center = {
    lat: 37.5665,
    lng: 126.9780,
};

const RoomPage = () => {
    const [dummyData, setDummyData] = useState(initialDummyData);
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedPlace, setSelectedPlace] = useState(dummyData[1][0]);
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newPlace, setNewPlace] = useState({ ...dummyData[1][0] });
    const navigate = useNavigate();
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const placeName = selectedPlace.name;
        const newCommentObj = {
            nickname: nickname,
            profileImg: profileImg,
            text: newComment.trim(),
        };

        const updatedComments = {
            ...comments,
            [placeName]: [...(comments[placeName] || []), newCommentObj],
        };

        setComments(updatedComments);
        setNewComment('');
    };


    const handleClose = () => setIsVisible(false);

    const handleSelectPlace = (item) => {
        setSelectedPlace(item);
        setNewPlace(item);
        setIsVisible(true);
        setIsEditing(false);
    };

    const handleEdit = () => setIsEditing(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPlace((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveChanges = () => {
        const updatedList = dummyData[selectedDay].map((place) =>
            place.name === selectedPlace.name ? newPlace : place
        );

        const updatedData = {
            ...dummyData,
            [selectedDay]: updatedList,
        };

        setDummyData(updatedData);
        setSelectedPlace(newPlace);
        setIsEditing(false);
    };

    const deletePlace = () => {
        const updatedPlaces = dummyData[selectedDay].filter(
            (place) => place.name !== selectedPlace.name
        );

        const updatedData = {
            ...dummyData,
            [selectedDay]: updatedPlaces,
        };

        setDummyData(updatedData);
        setSelectedPlace(updatedPlaces[0] || null);
        setIsVisible(false);
    };

    return (
        <div className="plan-page">
            <div className="plan-title-box">
                <h2 className="title">서울 여행</h2>
                <p className="info">
                    2025.3.26 ~ 2025.3.29<br/>
                    친구와 | SNS 핫플레이스 외 3
                </p>
            </div>

            <div className="map-box">
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                    />
                </LoadScript>
            </div>

            <div className="day-tabs">
                {Object.keys(dummyData).map((day) => (
                    <button
                        key={day}
                        className={`tab ${selectedDay === Number(day) ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedDay(Number(day));
                            setSelectedPlace(dummyData[day][0]);
                            setIsEditing(false);
                        }}
                    >
                        Day {day}
                    </button>
                ))}
                <button className="tab plus">+</button>
            </div>

            <div className="main-section">
                <div className="schedule-box">
                    {dummyData[selectedDay]?.map((item, idx) => (
                        <div
                            key={idx}
                            className={`schedule-item ${selectedPlace?.name === item.name ? 'selected' : ''}`}
                            onClick={() => handleSelectPlace(item)}
                        >
                            <div className="circle">{idx + 1}</div>
                            <div className="time">{item.time}</div>
                            <div className="place">
                                <strong>{item.name}</strong>
                                <p className="type">{item.type}</p>
                                <p className="desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedPlace && isVisible && (
                    <div className="side-panel">
                        <button className="close-btn" onClick={handleClose}>X</button>
                        <h3>{selectedPlace.name}</h3>

                        {isEditing ? (
                            <div className="edit-form">
                                <label>
                                    장소 이름:
                                    <input
                                        type="text"
                                        name="name"
                                        value={newPlace.name}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    시간:
                                    <input
                                        type="time"
                                        name="time"
                                        value={newPlace.time}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    설명:
                                    <textarea
                                        name="desc"
                                        value={newPlace.desc}
                                        onChange={handleChange}
                                    />
                                </label>
                                <div className="edit-btn-box">
                                    <button className="btn save-btn" onClick={saveChanges}>저장</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="info-container">
                                    <span className="placetime">{selectedPlace.time}</span>
                                    <span className="placetype">{selectedPlace.type}</span>
                                </div>
                                <p className="placedesc">{selectedPlace.desc}</p>
                            </>
                        )}

                        <div className="btn-box">
                            {!isEditing && (
                                <>
                                    <button className="btn" onClick={handleEdit}>수정</button>
                                    <button className="btn" onClick={deletePlace}>삭제</button>
                                </>
                            )}
                        </div>

                        {/* 댓글 */}
                        {!isEditing && (
                            <div className="comment-section">
                                <h4>댓글</h4>
                                <ul className="comment-list">
                                    {(comments[selectedPlace.name] || []).map((comment, index) => (
                                        <li key={index} className="comment-item">
                                            <img src={comment.profileImg} alt="프로필" className="comment-avatar"/>
                                            <div className="comment-content">
                                                <span className="comment-nickname">{comment.nickname}</span>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="comment-input-box">
                                    <input
                                        type="text"
                                        placeholder="댓글을 입력하세요"
                                        value={newComment}
                                        onChange={handleCommentChange}
                                    />
                                    <button onClick={handleAddComment}>등록</button>
                                </div>
                            </div>

                        )}
                    </div>
                )}
            </div>

            <div className="btn-box">
                <button className="btn" onClick={() => navigate(`/rooms/${roomId}/members`)}>
                    동행자 초대하기
                </button>
            </div>
        </div>
    );
};

export default RoomPage;
