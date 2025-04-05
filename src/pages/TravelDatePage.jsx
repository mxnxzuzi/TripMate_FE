import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/TravelDatePage.css';
import { useNavigate } from 'react-router-dom';

import { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
registerLocale('ko', ko);

const TravelDatePage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [mode, setMode] = useState(null); // 'add' or 'none'
  const [inputText, setInputText] = useState('');
  
  const navigate = useNavigate();

  return (
    <div className="travel-date-page">
      <h2 className="title">여행 기간은? 📅</h2>

      <div className="date-picker-box">
        <DatePicker
          locale="ko"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="시작일"
          dateFormat="yyyy-MM-dd"
          className="date-input"
        />
        <DatePicker
          locale="ko"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="종료일"
          dateFormat="yyyy-MM-dd"
          className="date-input"
        />
      </div>

      <h3 className="subtitle">추가 커스터마이징 ✅</h3>

      <div className="custom-box">
        <div className="button-column">
          <button
            className={`trigger-button ${mode === 'add' ? 'selected' : ''}`}
            onClick={() => setMode('add')}
          >
            추가
          </button>
          <button
            className={`none-button ${mode === 'none' ? 'selected' : ''}`}
            onClick={() => setMode('none')}
          >
            없음
          </button>
        </div>

        {mode === 'add' && (
          <div className="right-input-wrapper">
            <textarea
              type="text"
              className="custom-textarea"
              placeholder="예: 1일차에 롯데월드 꼭 가고싶어요"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              row={3}
            />
          </div>
        )}
      </div>

    <div className="next-button-wrapper">
    <button className="next-button" onClick={() => navigate('/loading')}>
        다음
    </button>
    </div>


    </div>
  );
};

export default TravelDatePage;
