import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanContext from '../context/PlanContext';
import '../styles/TravelTypeSelectPage.css';

const companionEnumMap = {
  '혼자': 'ALONE',
  '친구와': 'FRIEND',
  '연인과': 'COUPLE',
  '배우자와': 'SPOUSE',
  '아이와': 'CHILD',
  '부모님과': 'PARENTS',
  '가족과': 'FAMILY',
  '기타': 'OTHER'
};

const styleEnumMap = {
  '힐링 여행': 'HEALING',
  'SNS 핫플레이스': 'HOT_PLACE',
  '맛집 탐방': 'FOOD_TOUR',
  '액티비티 여행': 'ACTIVITY',
  '유명 관광지': 'TOURIST_SPOT',
  '쇼핑 · 도시 여행': 'CITY_TOUR',
  '해양 스포츠': 'MARINE_SPORTS',
  '로드 트립': 'ROAD_TRIP',
  '자연 탐험': 'NATURE',
  '문화 · 역사': 'CULTURE_HISTORY',
  '지역 축제': 'LOCAL_FESTIVAL'
};

const companionOptions = Object.keys(companionEnumMap);
const styleOptions = Object.keys(styleEnumMap);

const TravelTypeSelectPage = () => {
  const [selectedCompanion, setSelectedCompanion] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const navigate = useNavigate();
  const { setPlanData } = useContext(PlanContext);

  const handleStyleClick = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleNext = () => {
    const companionEnum = companionEnumMap[selectedCompanion] || '';
    const styleEnums = selectedStyles.map(style => styleEnumMap[style]);

    setPlanData(prev => ({
      ...prev,
      companion: companionEnum,
      style: styleEnums
    }));
    navigate('/travel-date');
  };

  return (
    <div className="travel-type-page">
      <h2 className="title">누구와 여행을 떠나시나요? 🧑‍🤝‍🧑</h2>
      <div className="button-grid">
        {companionOptions.map((option) => (
          <button
            key={option}
            className={`select-button ${selectedCompanion === option ? 'selected' : ''}`}
            onClick={() => setSelectedCompanion(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <h2 className="title">여행 스타일은? 🏝️</h2>
      <div className="button-grid">
        {styleOptions.map((style) => (
          <button
            key={style}
            className={`select-button ${selectedStyles.includes(style) ? 'selected' : ''}`}
            onClick={() => handleStyleClick(style)}
          >
            {style}
          </button>
        ))}
      </div>

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
};

export default TravelTypeSelectPage;