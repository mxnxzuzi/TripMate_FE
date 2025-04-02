import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DestinationSelectPage from './pages/DestinationSelectPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Header 있는 페이지들 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/select-destination" element={<DestinationSelectPage />} />
          {/* 필요한 다른 페이지도 여기 추가 */}
        </Route>

        {/* Header 없는 페이지들 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
