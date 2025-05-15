import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanContext from '../context/PlanContext';
import '../styles/DestinationSelectPage.css';

const destinations = {
  국내: ["제주", "서울", "가평", "부산", "강릉", "목포", "인천", "속초", "경주", "여수", "양양", "전주", "포항", "대구", "울산", "거제"],
  일본: ["도쿄", "오사카", "후쿠오카", "삿포로"],
  동남아: ["방콕", "하노이", "호치민", "세부"],
  중국: ["상하이", "베이징", "청두"],
  유럽: ["파리", "로마", "바르셀로나"],
  미주: ["뉴욕", "LA", "시애틀"],
  캐나다: ["밴쿠버", "토론토"]
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