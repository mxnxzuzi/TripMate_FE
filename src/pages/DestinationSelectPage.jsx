import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanContext from '../context/PlanContext';
import '../styles/DestinationSelectPage.css';

const destinations = {
  국내: [
    "제주", "서울", "가평", "부산", "강릉", "목포", "인천", "속초", "경주", "여수",
    "양양", "전주", "포항", "대구", "울산", "거제", "통영", "춘천", "평창", "안동",
    "남해", "군산", "고성", "청주", "대전", "광주", "천안", "김해", "홍천", "담양",
    "부여", "합천", "영주", "보성", "순천"
  ],
  일본: [
    "도쿄", "오사카", "후쿠오카", "삿포로", "나고야", "교토", "나라", "히로시마", "오키나와",
    "가나자와", "니세코", "하코네", "고베", "요코하마", "가고시마", "구마모토", "마쓰야마"
  ],
  동남아: [
    "대만", "방콕", "하노이", "호치민", "세부", "푸켓", "발리", "쿠알라룸푸르", "싱가포르", "다낭",
    "나트랑", "치앙마이", "코사무이", "비엔티안", "마닐라", "코타키나발루", "파타야", "바탐"
  ],
  중국: [
    "상하이", "베이징", "청두", "시안", "충칭", "광저우", "하얼빈", "우한", "쿤밍",
    "샤먼", "홍콩", "마카오", "텐진", "선양", "난징", "항저우", "다롄"
  ],
  유럽: [
    "파리", "로마", "바르셀로나", "런던", "베를린", "암스테르담", "프라하", "부다페스트",
    "빈", "리스본", "마드리드", "피렌체", "베니스", "에든버러", "두브로브니크", "이스탄불",
    "브뤼셀", "코펜하겐", "스톡홀름", "헬싱키", "바르샤바", "뮌헨", "취리히", "제네바"
  ],
  미주: [
    "뉴욕", "LA", "시애틀", "샌프란시스코", "라스베가스", "마이애미", "시카고", "보스턴",
    "워싱턴DC", "오스틴", "샌디에이고", "포틀랜드", "휴스턴", "뉴올리언스", "애틀랜타", "덴버"
  ],
  캐나다: [
    "밴쿠버", "토론토", "몬트리올", "캘거리", "퀘벡시티", "오타와", "위니펙", "에드먼턴"
  ],
  오세아니아: [
    "시드니", "멜버른", "브리즈번", "퍼스", "오클랜드", "웰링턴", "퀸스타운"
  ],
  중동: [
    "두바이", "아부다비", "도하", "이스탄불", "텔아비브", "예루살렘"
  ],
  아프리카: [
    "케이프타운", "요하네스버그", "카이로", "마라케시", "나이로비", "잔지바르"
  ]
};

const DestinationSelectPage = () => {
  const [selectedCountry, setSelectedCountry] = useState('국내');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();
  const { setPlanData } = useContext(PlanContext);

  const handleNext = () => {
    let country = selectedCountry;
    let city = selectedRegion;

    if (searchInput) {
      if (searchInput.includes('-')) {
        const parts = searchInput.split('-').map(s => s.trim());
        if (parts.length === 2) {
          country = parts[0];
          city = parts[1];
        } else {
          alert('여행지는 "국가-도시" 형식으로 입력해주세요. 예: 국내-서울');
          return;
        }
      } else {
        alert('여행지는 "국가-도시" 형식으로 입력해주세요. 예: 국내-서울');
        return;
      }
    }

    setPlanData(prev => ({
      ...prev,
      country,
      city
    }));

    navigate('/travel-type');
  };

  return (
    <div className="destination-page">
      <h2 className="title">어디로 여행을 떠나시나요? ✈️</h2>
      <div className="destination-box">
        <div className="country-list">
          {Object.keys(destinations).map((country) => (
            <button
              key={country}
              className={`country-button ${selectedCountry === country ? 'active' : ''}`}
              onClick={() => setSelectedCountry(country)}
            >
              {country}
            </button>
          ))}
        </div>
        <div className="region-list">
          {(destinations[selectedCountry] || []).map((region) => (
            <div
              key={region}
              className={`region-item ${selectedRegion === region ? 'selected' : ''}`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </div>
          ))}
        </div>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="🔍 가고 싶은 여행지를 입력해주세요(예:국내-대전)"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
};

export default DestinationSelectPage;