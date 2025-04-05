import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import '../styles/RecommendationPage.css';

const dummyData = {
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

const mapContainerStyle = {
  width: '100%',
  height: '290px', 
};
const center = {
  lat: 37.5665,
  lng: 126.9780,
};

const RecommendationPage = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="plan-page">
      <div className="plan-title-box">
        <h2 className="title">서울 여행</h2>
        <p className="info">2025.3.26 ~ 2025.3.29<br />친구와 | SNS 핫플레이스 외 3</p>
      </div>

      <div className="map-box">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
        >
          {/* 여기에 마커나 다른 컴포넌트 넣을 수 있음 */}
        </GoogleMap>
      </LoadScript>
    </div>


      <div className="day-tabs">
        {Object.keys(dummyData).map(day => (
          <button
            key={day}
            className={`tab ${selectedDay === Number(day) ? 'active' : ''}`}
            onClick={() => setSelectedDay(Number(day))}
          >
            Day {day}
          </button>
        ))}
        <button className="tab plus">+</button>
      </div>

      <div className="schedule-box">
        {dummyData[selectedDay].map((item, idx) => (
          <div key={idx} className="schedule-item">
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

      <div className="btn-box">
        <button className="btn">내 일정으로 저장</button>
        <button className="btn" onClick={() => navigate('/loading')}>새로운 추천받기</button>
        <button className="btn">동행자 초대하기</button>
      </div>
    </div>
  );
};

export default RecommendationPage;
