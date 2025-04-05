import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DestinationSelectPage from './pages/DestinationSelectPage';
import TravelTypeSelectPage from './pages/TravelTypeSelectPage';
import TravelDatePage from './pages/TravelDatePage';
import LoadingPage from './pages/LoadingPage';
import RecommendationPage from './pages/RecommendationPage';
import UserLayout from './layouts/UserLayout';
import test from './pages/test';

function App() {
  return (
    <Router>
      <Routes>
        {/* Header 있는 페이지들 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/select-destination" element={<DestinationSelectPage />} />
          <Route path="/travel-type" element={<TravelTypeSelectPage />} />
          <Route path="/travel-date" element={<TravelDatePage />} />
          <Route path="/RecommendationPlan_noLogin" element={<RecommendationPage />} />
      </Route>

        {/* Header 없는 페이지들 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Route>
        {/* Header after login 페이지들 */}
        <Route element={<UserLayout/>}>
        <Route path="/test" element={<test />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
