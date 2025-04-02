import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-container">
      <Link to="/" className="login-logo">TripMate</Link>
      
      <h2 className="login-title">로그인</h2>

      <form className="login-form">
        <input type="email" placeholder="이메일" className="login-input" />
        <input type="password" placeholder="비밀번호" className="login-input" />
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
        <img src="/images/google.png" alt="Google 로그인" />
        <img src="/images/naver.png" alt="Naver 로그인" />
        <img src="/images/kakao.png" alt="Kakao 로그인" />
      </div>
    </div>
  );
};

export default LoginPage;
