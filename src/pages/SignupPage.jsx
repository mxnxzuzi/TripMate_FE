import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8080';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // 1. 닉네임 중복 체크
    const nicknameCheckRes = await axios.get(`/consumers/check-nickname`, {
      params: { nickname }
    });
    if (nicknameCheckRes.data.exists) {
      setMessage('이미 사용 중인 닉네임입니다.');
      return;
    }

    // 2. 이메일 중복 체크
    const emailCheckRes = await axios.get(`/consumers/check-email`, {
      params: { email }
    });
    if (emailCheckRes.data.exists) {
      setMessage('이미 사용 중인 이메일입니다.');
      return;
    }

    try {
      const response = await axios.post('/consumers/register', {
        email,
        password,
        name,
        nickname,
      });

      console.log('회원가입 성공:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setMessage('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="signup-container">
      <Link to="/" className="login-logo">TripMate</Link>
      <h2 className="signup-title">회원가입</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="이름"
          className="signup-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="닉네임"
          className="signup-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        {message && <p className="signup-message">{message}</p>}

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
