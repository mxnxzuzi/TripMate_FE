import '../styles/MainPage.css';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/select-destination');
  };

  return (
    <div className="main-container">
      <div className="main-text">
        <p>
          귀찮은 여행 계획?<br />
          한 번에 해결!
        </p>
      </div>

      <button className="ai-button" onClick={handleClick}>
        AI 추천받기
      </button>
    </div>
  );
};

export default MainPage;
