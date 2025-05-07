import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../styles/LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setUserInfo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8080';
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // 기존 에러 메시지 초기화

    try {
      const response = await axios.post('/consumers/login', {
        email,
        password,
      });

      const { name, nickname, email: userEmail, id, token, nicknameSet } = response.data;

      console.log('로그인 성공:', response.data);
      localStorage.setItem("token", token);
      setIsLoggedIn(true); 
      setUserInfo({ name, nickname, email: userEmail, id });
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="login-container">
      <Link to="/" className="login-logo">TripMate</Link>
      <h2 className="login-title">로그인</h2>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 에러 메시지 출력 */}
        {errorMessage && <p className="login-error">{errorMessage}</p>}

        <button type="submit" className="login-button">로그인</button>
      </form>

      <Link to="#" className="forgot-password">비밀번호를 잊어버리셨나요?</Link>

      <div className="signup-section">
        계정이 없으신가요? <Link to="/signup" className="signup-link">회원가입</Link>
      </div>

      <div className="divider">
        <hr /> <span>OR</span> <hr />
      </div>

      <div className="social-login">
        <img
            src="/images/google.png"
            alt="Google 로그인"
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
            style={{ cursor: 'pointer' }}
        />
        <img
            src="/images/naver.png"
            alt="Naver 로그인"
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/naver'}
            style={{ cursor: 'pointer' }}
        />
        <img
            src="/images/kakao.png"
            alt="Kakao 로그인"
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'}
            style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
