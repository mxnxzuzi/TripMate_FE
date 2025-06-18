import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {Autocomplete, GoogleMap, LoadScript, Marker, Polyline} from '@react-google-maps/api';
import '../styles/RoomPage.css';

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

const companionEnumMap = {
  ALONE: '혼자',
  FRIEND: '친구와',
  COUPLE: '연인과',
  SPOUSE: '배우자와',
  CHILD: '아이와',
  PARENTS: '부모님과',
  FAMILY: '가족과',
  OTHER: '기타'
};

const styleEnumMap = {
  HEALING: '힐링 여행',
  HOT_PLACE: 'SNS 핫플레이스',
  FOOD_TOUR: '맛집 탐방',
  LOCAL_FESTIVAL: '지역 축제',
  ACTIVITY: '액티비티 여행',
  CITY_TOUR: '쇼핑ㆍ도시 여행',
  MARINE_SPORTS: '해양 스포츠',
  ROAD_TRIP: '로드 트립',
  NATURE: '자연 탐험',
  CULTURE_HISTORY: '문화ㆍ역사',
  TOURIST_SPOT: '유명 관광지'
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
    const [showRoomEdit, setShowRoomEdit] = useState(false);
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
                    const day = place.dayNumber;
                    if (!acc[day]) acc[day] = [];
                    const timeStr = place.time.substr(11, 5);
                    acc[day].push({
                        placeId: place.placeId,
                        time: timeStr,
                        name: place.name,
                        type: categoryLabels[place.category] || place.category,
                        desc: place.description,
                        latitude: place.latitude,
                        longitude: place.longitude
                    });
                    return acc;
                }, {});

                // 💡 time 기준 정렬 추가
                Object.keys(grouped).forEach(day => {
                    grouped[day].sort((a, b) => a.time.localeCompare(b.time));
                });

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

    // room 수정
    const dateStr = roomData?.plan?.startDate?.substring(0, 10) || "2025-01-01"; // "YYYY-MM-DD"
    const saveChanges = async () => {
        if (!newPlace || !selectedPlace) return;

        // 요청 바디 객체
        const updateData = {
            country: roomData.plan.country,
            city: roomData.plan.city
        };

        // 방 이름이 수정된 경우만 포함
        if (newPlace.roomName && newPlace.roomName !== roomData.name) {
            updateData.name = newPlace.roomName;
        }

        // 장소 수정 정보 구성
        const placeUpdate = {
            placeId: newPlace.placeId // 항상 포함
        };

        // 이름 수정 시
        if (newPlace.name && newPlace.name !== selectedPlace.name) {
            placeUpdate.name = newPlace.name;
        }

        // 설명 수정 시
        if (newPlace.desc && newPlace.desc !== selectedPlace.desc) {
            placeUpdate.description = newPlace.desc;
        }

        // 시간 수정 시
        if (newPlace.time && newPlace.time !== selectedPlace.time) {
            const formattedTime = `${dateStr}T${newPlace.time}:00`;
            placeUpdate.time = formattedTime;
        }

        // place에 name, description, time 중 하나라도 바뀌었으면 추가
        if (Object.keys(placeUpdate).length > 1) {
            updateData.place = placeUpdate;
        }

        try {
            await axios.patch(
                `http://localhost:8080/rooms/${roomId}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            window.location.reload(); // 💡 새로고침 실행
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
            <div className="plan-title-box" onClick={() => setShowRoomEdit(prev => !prev)}>
                <h2 className="title">{roomData.name}</h2>
                <p className="info">
                    {new Date(roomData.plan.startDate).toLocaleDateString()} ~ {new Date(roomData.plan.endDate).toLocaleDateString()}<br/>
                    {companionEnumMap[roomData.plan.companion]} | {
                        (() => {
                        const styles = roomData.plan.style?.map(s => styleEnumMap[s]) || [];
                        if (styles.length === 1) return styles[0];
                        if (styles.length > 1) return `${styles[0]} 외 ${styles.length - 1}개`;
                        return '';
                        })()
                    }
                    </p>
            </div>

            {showRoomEdit ? (
                <div className="room-edit-box">
                    <button className="close-btn" onClick={() => setShowRoomEdit(false)}>X</button>
                    <label>
                        방 제목 : 
                        <input
                        type="text"
                        value={newPlace?.roomName || roomData.name || ''}
                        onChange={e => setNewPlace(prev => ({ ...prev, roomName: e.target.value }))}
                        />
                    </label>

                    <div className="edit-btn-box">
                        <button className="btn save-btn" onClick={saveChanges}>저장</button>
                    </div>
                </div>
            ) : (null)}
            <br/>
            <div className="map-box">
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={mapCenter}
                        zoom={15}
                    >
                        {groupedData[selectedDay]
                        ?.filter(p => p.latitude && p.longitude)
                        .map((place, idx) => (
                            <Marker
                            key={place.placeId}
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
