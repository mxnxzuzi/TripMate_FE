import React, { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import PlanContext from '../context/PlanContext';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/TravelDatePage.css';

registerLocale('ko', ko);

const TravelDatePage = () => {
  const { planData, setPlanData } = useContext(PlanContext);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [mode, setMode] = useState(null); // 'add' or 'none'
  const [inputText, setInputText] = useState('');

  const navigate = useNavigate();

  const handleNext = () => {
    setPlanData({
      ...planData,
      startDate,
      endDate,
      customizing: mode === 'add' ? inputText : ''
    });
    navigate('/loading'); //LoadingPage로 이동
  };

  return (
    <div className="travel-date-page">
      <h2 className="title">여행 기간은? 📅</h2>
      <div className="date-picker-box">
        <DatePicker locale="ko" selected={startDate} onChange={setStartDate} placeholderText="시작일" dateFormat="yyyy-MM-dd" className="date-input" />
        <DatePicker locale="ko" selected={endDate} onChange={setEndDate} placeholderText="종료일" dateFormat="yyyy-MM-dd" className="date-input" />
      </div>
      <h3 className="subtitle">추가 커스터마이징 ✅</h3>
      <div className="custom-box">
        <div className="button-column">
          <button className={`trigger-button ${mode === 'add' ? 'selected' : ''}`} onClick={() => setMode('add')}>추가</button>
          <button className={`none-button ${mode === 'none' ? 'selected' : ''}`} onClick={() => setMode('none')}>없음</button>
        </div>
        {mode === 'add' && (
          <div className="right-input-wrapper">
            <textarea className="custom-textarea" placeholder="예: 1일차에 롯데월드 꼭 가고싶어요" value={inputText} onChange={(e) => setInputText(e.target.value)} rows={3} />
          </div>
        )}
      </div>
      <div className="next-button-wrapper">
        <button className="next-button" onClick={handleNext}>다음</button>
      </div>
    </div>
  );
};

export default TravelDatePage;