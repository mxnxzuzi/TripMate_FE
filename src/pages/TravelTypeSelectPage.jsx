import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TravelTypeSelectPage.css';

const companionOptions = [
  '혼자', '친구와', '연인과', '배우자와', '아이와',
  '부모님과', '가족과', '기타'
];

const styleOptions = [
  '힐링 여행', 'SNS 핫플레이스', '맛집 탐방', '지역 축제',
  '액티비티 여행', '쇼핑 · 도시 여행', '해양 스포츠', '로드 트립',
  '자연 탐험', '문화 · 역사', '유명 관광지'
];

const TravelTypeSelectPage = () => {
  const [selectedCompanion, setSelectedCompanion] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const navigate = useNavigate();

  const handleStyleClick = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleNext = () => {
    // 조건 추가 가능
    navigate('/travel-date'); // 다음 페이지 경로로 수정
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
