import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupPage.css';

const SignupPage = () => {
  return (
    <div className="signup-container">
      <Link to="/" className="login-logo">TripMate</Link>
      <h2 className="signup-title">회원가입</h2>

      <form className="signup-form">
        <input type="email" placeholder="이메일" className="signup-input" />
        <input type="password" placeholder="비밀번호" className="signup-input" />
        <input type="text" placeholder="이름" className="signup-input" />
        <input type="text" placeholder="닉네임" className="signup-input" />
        <button type="submit" className="signup-button">회원가입</button>
      </form>

      <div className="login-section">
        이미 가입하셨나요? <Link to="/login" className="login-link">로그인</Link>
      </div>

      <div className="divider">
        <hr /> <span>OR</span> <hr />
      </div>

      <div className="social-signup">
        <img src="/images/google.png" alt="Google 회원가입" />
        <img src="/images/naver.png" alt="Naver 회원가입" />
        <img src="/images/kakao.png" alt="Kakao 회원가입" />
      </div>
    </div>
  );
};

export default SignupPage;
