import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="nav-links">
        <Link to="/" className="logo">TripMate</Link>
        {/*<Link to="/posts" className="post-link">여행 기록</Link>*/}
      </div>
      <div className="auth-links">
        <Link to="/posts" className="post-link">커뮤니티</Link>
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
      </div>
    </header>
  );
};

export default Header;
