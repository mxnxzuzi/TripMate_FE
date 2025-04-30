import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Test from './pages/Test';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); 
  
  return (
    <Router>
      <Routes>
        {/* AuthLayout (로그인/회원가입 페이지) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Route>

        {/* 나머지 페이지들 (isLoggedIn 여부에 따라 MainLayout 또는 UserLayout) */}
        <Route element={isLoggedIn ? <UserLayout userInfo={userInfo} setIsLoggedIn={setIsLoggedIn} /> : <MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/select-destination" element={<DestinationSelectPage />} />
          <Route path="/travel-type" element={<TravelTypeSelectPage />} />
          <Route path="/travel-date" element={<TravelDatePage />} />
          <Route path="/RecommendationPlan_noLogin" element={<RecommendationPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/consumers/:consumerId/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<DetailedPostPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/posts/posting" element={<PostingPage isEdit={false} />} />
          <Route path="/posts/:postId/edit" element={<PostingPage isEdit={true} />} />
        </Route>

        {/* 잘못된 경로면 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}


export default App;
