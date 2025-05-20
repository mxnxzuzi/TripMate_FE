import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import '../styles/RecommendationPage.css';

const mapContainerStyle = {
  width: '100%',
  height: '290px',
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

const categoryEnumMap = {
  SIGHTSEEING: '관광명소',
  FOOD: '음식',
  CAFE: '카페',
  SHOPPING: '쇼핑',
  NATURE: '자연',
  CULTURE: '문화',
  ACTIVITY: '체험',
  RELAX: '휴식',
  NIGHT: '야경/밤',
  OTHER: '기타'
};

const RecommendationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  const [selectedDay, setSelectedDay] = useState(1);
  const [placesByDay, setPlacesByDay] = useState({});
  const [editingPlace, setEditingPlace] = useState(null); // 클릭한 장소 정보
  const [isEditOpen, setIsEditOpen] = useState(false); // 수정 창 표시 여부

  useEffect(() => {
    if (!plan?.places) return;
    const grouped = {};
    plan.places.forEach(place => {
      if (!grouped[place.dayNumber]) grouped[place.dayNumber] = [];
      grouped[place.dayNumber].push(place);
    });
    setPlacesByDay(grouped);
  }, [plan]);

  if (!plan){
    alert('일정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    navigate('/');
  }

  const selectedPlaces = [...(placesByDay[selectedDay] || [])].sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );

  const mapCenter = selectedPlaces.length > 0
    ? { lat: selectedPlaces[0].latitude, lng: selectedPlaces[0].longitude }
    : { lat: 37.5665, lng: 126.9780 };

  const polylinePath = selectedPlaces
    .filter(p => p.latitude && p.longitude)
    .map(p => ({ lat: p.latitude, lng: p.longitude }));

  const handleSavePlan = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      //계획 저장 API에 맞게 수정하기
      await axios.post(
        'http://localhost:8080/rooms',
        plan,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/mypage'); //요청 성공 시 이동
    } catch (error) {
      console.error('일정 저장 실패:', error);
      alert('일정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

return (
  <div className="reco-plan-page">
    <div className="reco-plan-title-box">
      <h2 className="reco-title">{plan.title}</h2>
      <p className="reco-info">
        {plan.startDate.slice(0, 10)} ~ {plan.endDate.slice(0, 10)}<br />
        {companionEnumMap[plan.companion]} | {
          (() => {
            const styles = plan.style?.map(s => styleEnumMap[s]) || [];
            if (styles.length === 1) return styles[0];
            if (styles.length > 1) return `${styles[0]} 외 ${styles.length - 1}개`;
            return '';
          })()
        }
      </p>
    </div>

    <div className="reco-map-box">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          key={selectedDay}
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
        >
          {selectedPlaces.map((place, idx) => (
            <Marker
              key={idx}
              position={{ lat: place.latitude, lng: place.longitude }}
              label={{ text: String(idx + 1), color: 'white' }}
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

    <div className="reco-day-tabs">
      {Object.keys(placesByDay).map(day => (
        <button
          key={day}
          className={`reco-tab ${selectedDay === Number(day) ? 'reco-active' : ''}`}
          onClick={() => setSelectedDay(Number(day))}
        >
          Day {day}
        </button>
      ))}
    </div>

    <div className="reco-schedule-box">
      {selectedPlaces.map((place, idx) => (
        <div key={idx} className="reco-schedule-item">
          <div className="reco-circle">{idx + 1}</div>
          <div className="reco-time">{place.time.slice(11, 16)}</div>
          <div className="reco-place">
            <strong>{place.name}</strong>
            <p className="reco-type">{categoryEnumMap[place.category]}</p>
            <p className="reco-desc">{place.description}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="reco-btn-box">
      <button className="reco-btn" onClick={handleSavePlan}>내 일정으로 저장</button>
      <button className="reco-btn" onClick={() => navigate('/loading')}>새로운 추천받기</button>
    </div>
  </div>
  );
};

export default RecommendationPage;