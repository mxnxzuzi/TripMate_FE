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
import PostsPage from './pages/PostsPage';
import DetailedPostPage from './pages/DetailedPostPage';
import PostingPage from './pages/PostingPage';
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
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/consumers/:consumerId/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<DetailedPostPage />} />
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
        <Route path="/posts/posting" element={<PostingPage isEdit={false} />} />
        <Route path="/posts/:postId/edit" element={<PostingPage isEdit={true} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
