import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {Autocomplete, GoogleMap, LoadScript, Marker, Polyline} from '@react-google-maps/api';
import '../styles/RoomPage.css';

const mapContainerStyle = {
    width: '100%',
    height: '290px',
};

const defaultCenter = {
    lat: 37.5665,
    lng: 126.9780,
};

// 카테고리 Enum을 한국어로 매핑
const categoryLabels = {
    SIGHTSEEING: '관광 명소',
    FOOD: '음식점',
    CAFE: '카페',
    SHOPPING: '쇼핑몰',
    NATURE: '자연경관',
    CULTURE: '전시/문화',
    ACTIVITY: '체험',
    RELAX: '휴식',
    NIGHT: '야경/밤',
    OTHER: '기타',
};

const RoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [roomData, setRoomData] = useState(null);
    const [groupedData, setGroupedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newPlace, setNewPlace] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);

    const selectedPlaces = (roomData?.plan?.places || []).filter(p => p.latitude && p.longitude);

    const mapCenter = selectedPlaces.length > 0
        ? { lat: selectedPlaces[0].latitude, lng: selectedPlaces[0].longitude }
        : { lat: 37.5665, lng: 126.9780 };

    const polylinePath = selectedPlaces
        .filter(p => p.latitude && p.longitude)
        .map(p => ({ lat: p.latitude, lng: p.longitude }));

    const [copied, setCopied] = useState(false);


    // 방 데이터 로딩
    useEffect(() => {
        if (!token) return navigate('/login');
        if (selectedPlace) {
            console.log('선택한 장소 변경됨:', selectedPlace);
        }
        setLoading(true);
        axios.get(`http://localhost:8080/rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const data = res.data.result;
                setRoomData(data);
                const grouped = data.plan.places.reduce((acc, place) => {
                    console.log(place); // 이거 찍어서 확인해보세요
                    const day = place.dayNumber;
                    if (!acc[day]) acc[day] = [];
                    const timeStr = place.time.substr(11, 5);
                    acc[day].push({
                        placeId: place.placeId,
                        time: timeStr,
                        name: place.name,
                        type: categoryLabels[place.category] || place.category,
                        desc: place.description
                    });
                    return acc;
                }, {});
                setGroupedData(grouped);
                // 👉 처음 Day의 장소를 초기 선택
                const firstDay = Object.keys(grouped)[0];
                const firstPlace = grouped[firstDay]?.[0] || null;
                setSelectedDay(Number(firstDay));
                setSelectedPlace(firstPlace);
                setNewPlace(firstPlace);
            })
            .catch(err => {
                console.error(err);
                setError('방 정보를 불러오는 중 오류가 발생했습니다.');
            })
            .finally(() => setLoading(false));
    }, [roomId, token, navigate]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;
    if (!roomData) return null;

    const handleCommentChange = e => setNewComment(e.target.value);

    const handleAddComment = async () => {
        if (!newComment.trim() || !selectedPlace) return;

        try {
            // 1. 댓글 등록 요청
            await axios.post(
                `http://localhost:8080/rooms/${roomId}/places/${selectedPlace.placeId}/comments`,
                { content: newComment.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 2. 댓글 목록 다시 불러오기
            const res = await axios.get(
                `http://localhost:8080/rooms/${roomId}/places/${selectedPlace.placeId}/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 3. 기존 구조 유지: key를 selectedPlace.name으로 저장
            const key = selectedPlace.name;
            setComments(prev => ({
                ...prev,
                [key]: res.data.data // 서버 응답이 data 안에 있을 때
            }));

            // 4. 입력창 비우기
            setNewComment('');
        } catch (err) {
            console.error("댓글 등록 오류:", err);
            alert("댓글 등록에 실패했습니다.");
        }
    };

    // 장소 선택
    const handleSelectPlace = item => {
        const id = item.placeId || item.id || item.someOtherIdField;

        const formatted = {
            ...item,
            id: id,
        };

        setSelectedPlace(formatted);
        setNewPlace(formatted);
        setIsVisible(true);
        setIsEditing(false);
    };


    console.log('선택한 장소 변경됨:', selectedPlace);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            console.log("선택된 place:", place);

            if (!place.geometry) {
                console.warn("선택한 장소에 위치 정보가 없습니다.");
                return;
            }

            if (place.name && place.geometry?.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const placeType = place.types && place.types.length > 0 ? place.types[0] : '';

                setNewPlace(prev => ({
                    ...prev,
                    name: place.name,
                    lat,
                    lng,
                    type: placeType,
                }));
            }
        }
    };


    // 장소 수정
    const dateStr = roomData?.plan?.startDate?.substring(0, 10) || "2025-01-01"; // "YYYY-MM-DD"
    const formattedTime = `${dateStr}T${newPlace.time}:00`; // "2025-06-17T14:30:00"
    const saveChanges = async () => {
        if (!newPlace) return;

        try {
            await axios.patch(
                `http://localhost:8080/rooms/${roomId}/places/${newPlace.placeId}`,
                {
                    updatedFields: {
                        name: newPlace.name || selectedPlace.name,
                        description: newPlace.desc || selectedPlace.desc,
                        category: newPlace.type || selectedPlace.type,
                        time: formattedTime,
                        dayNumber: newPlace.dayNumber || selectedPlace.dayNumber,
                        latitude: newPlace.lat || selectedPlace.lat,
                        longitude: newPlace.lng || selectedPlace.lng,
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // 화면 업데이트는 이전처럼 유지
            const updatedList = groupedData[selectedDay].map(p =>
                p.placeId === newPlace.placeId ? {
                    ...p,
                    name: newPlace.name || p.name,
                    time: newPlace.time || p.time,
                    desc: newPlace.desc || p.desc,
                    dayNumber: newPlace.dayNumber || p.dayNumber,
                    // lat, lng 업데이트는 백엔드에서 처리되므로 여기선 필요없음
                } : p
            );

            setGroupedData(prev => ({ ...prev, [selectedDay]: updatedList }));
            setSelectedPlace(prev => ({ ...prev, ...newPlace }));
            setIsEditing(false);
        } catch (e) {
            console.error('수정 실패', e);
            alert('수정에 실패했습니다.');
        }
    };


    const deletePlace = async (placeId) => {
        console.log("deletePlace 호출됨, 전달받은 ID:", placeId);
        console.log("현재 selectedPlace 객체:", selectedPlace);
        if (!placeId) {
            alert("삭제할 장소 정보가 없습니다.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/rooms/${roomId}/places/${placeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert("삭제 성공!");

            const updatedGrouped = { ...groupedData };
            updatedGrouped[selectedDay] = groupedData[selectedDay].filter(p => p.placeId !== placeId);
            setGroupedData(updatedGrouped);

            // 선택된 장소가 삭제된 장소면 선택 해제
            if (selectedPlace?.placeId === placeId) {
                setSelectedPlace(null);
                setIsVisible(false); // 만약 상세창 같은 거 표시용이면
            }

        } catch (e) {
            console.error("삭제 실패", e);
            alert("삭제 중 오류 발생");
        }
    };

    const inviteLink = `http://localhost:3000/invite/${roomId}`;

    //초대 링크 복사
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
        } catch (err) {
            alert("복사에 실패했습니다.");
        }
    };


    return (
        <div className="plan-page">
            <div className="plan-title-box">
                <h2 className="title">{roomData.plan.title}</h2>
                <p className="info">
                    {new Date(roomData.plan.startDate).toLocaleDateString()} ~ {new Date(roomData.plan.endDate).toLocaleDateString()}<br/>
                    {roomData.plan.companion} | 스타일 {roomData.plan.style.join(', ')}
                </p>
            </div>

            <div className="map-box">
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={mapCenter}
                        zoom={15}
                    >
                        {selectedPlaces.map((place, idx) => (
                            <Marker
                                key={idx}
                                position={{ lat: place.latitude, lng: place.longitude }}
                                label={{ text: `${idx + 1}`, color: 'white' }}
                            />
                        ))}
                        {polylinePath.length > 1 && (
                            <Polyline
                                key={`polyline-${selectedDay}`}
                                path={polylinePath}
                                options={{
                                    strokeColor: '#888',
                                    strokeOpacity: 0.6,
                                    strokeWeight: 2,
                                    icons: [
                                        {
                                            icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                                            offset: '0',
                                            repeat: '20px'
                                        }
                                    ]
                                }}
                            />
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>

            <div className="day-tabs">
                {Object.keys(groupedData).map(day => (
                    <button
                        key={day}
                        className={`tab ${selectedDay === Number(day) ? 'active' : ''}`}
                        onClick={() => {
                            const dayNum = Number(day);
                            setSelectedDay(dayNum);
                            const first = groupedData[day]?.[0] || null;
                            setSelectedPlace(first);
                            setNewPlace(first);
                            setIsEditing(false);
                            setIsVisible(!!first);
                        }}
                    >
                        Day {day}
                    </button>
                ))}
            </div>

            <div className="main-section">
                <div className="schedule-box">
                    {groupedData[selectedDay]?.map((item, idx) => (
                        <div
                            key={idx}
                            className={`schedule-item ${selectedPlace?.id === item.id ? 'selected' : ''}`}
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
                        <button className="close-btn" onClick={() => setIsVisible(false)}>X</button>
                        <h3>{selectedPlace.name}</h3>
                        {isEditing ? (
                            <div className="edit-form">
                                <label>
                                    장소 검색:
                                    <input
                                        type="text"
                                        placeholder="장소를 검색하세요"
                                        value={newPlace?.name || ''}
                                        onChange={e => setNewPlace(prev => ({...prev, name: e.target.value}))}/>
                                </label>
                                <label>시간:
                                    <input
                                        type="time" name="time"
                                        value={newPlace.time}
                                        onChange={e => setNewPlace(prev => ({...prev, time: e.target.value}))}/>
                                </label>
                                <label>설명:
                                    <textarea
                                        name="desc" value={newPlace.desc}
                                        onChange={e => setNewPlace(prev => ({...prev, desc: e.target.value}))}/>
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

                        {!isEditing && (
                            <div className="room-btn-box">
                                <button className="room-edit-btn" onClick={() => setIsEditing(true)}>수정</button>
                                <button className="room-delete-btn"  onClick={() => deletePlace(selectedPlace.placeId)}>삭제</button>
                            </div>
                        )}

                        {!isEditing && (
                            <div className="comment-section">
                                <h4>댓글</h4>
                                <ul className="comment-list">
                                    {(comments[selectedPlace.name] || []).map((comment, idx) => (
                                        <li key={idx} className="comment-item">
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
                <button className="btn" onClick={handleCopy}>
                    {copied ? "링크가 복사되었습니다!" : "초대 링크 복사"}
                </button>
            </div>
        </div>
    );
};

export default RoomPage;
