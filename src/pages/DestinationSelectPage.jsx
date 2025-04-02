import React, { useState } from 'react';
import '../styles/DestinationSelectPage.css'; // 스타일 파일 경로에 맞게 수정

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

  return (
    <div className="destination-page">

      <h2 className="title">어디로 여행을 떠나시나요? ✈️</h2>

      <div className="destination-box">
        {/* 왼쪽: 국가 선택 */}
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

        {/* 오른쪽: 지역 리스트 */}
        <div className="region-list">
          {destinations[selectedCountry].map((region) => (
            <div key={region} className="region-item">
              {region}
            </div>
          ))}
        </div>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="🔍 더 많은 여행지를 찾아보세요"
      />

      <button className="next-button">다음</button>
    </div>
  );
};

export default DestinationSelectPage;
