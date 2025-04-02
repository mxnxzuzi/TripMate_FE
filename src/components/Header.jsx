import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">TripMate</Link>
      <div className="auth-links">
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
      </div>
    </header>
  );
};

export default Header;
