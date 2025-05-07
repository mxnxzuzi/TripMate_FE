import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/NicknameSettingPage.css'; 

const NicknameSettingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("token", tokenFromUrl);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await axios.patch(
        "http://localhost:8080/consumers/nickname",
        { nickname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (err) {
        const errorMsg = err.response?.data?.error || "이미 사용 중인 닉네임입니다.";
        setErrorMessage(errorMsg); 
      }
  };

  return (
    <div className="nickname-container">
      <div className="nickname-box">
        <h2>닉네임 설정</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="nickname-input"
          />
          <button type="submit" className="nickname-button">
            설정 완료
          </button>
        </form>
        {errorMessage && <p style={{ color: "rgb(242, 0, 0)" }}>{errorMessage}</p>} 
      </div>
    </div>
  );
};

export default NicknameSettingPage;
