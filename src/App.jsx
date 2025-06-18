import React, { useState, useEffect } from 'react';
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
import NicknameSettingPage from './pages/NicknameSettingPage';
import InvitePage from './pages/InvitePage';
import axios from "axios";
import RoomPage from "./pages/RoomPage";
import MyLikedPostsPage from './pages/MyLikedPostsPage';
import MyPostsPage from './pages/MyPostsPage';
import MyCoursePage from './pages/MyCoursePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); 
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");
    const tokenFromStorage = localStorage.getItem("token");
    const token = tokenFromURL || tokenFromStorage;

    if (token && token.split('.').length === 3) {
      localStorage.setItem("token", token);

      axios.get("http://localhost:8080/consumers/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {

        // 🚨 여기! result만 저장
        if (res.data.isSuccess && res.data.result) {
          setUserInfo(res.data.result); // result만!
          setIsLoggedIn(true);
          window.history.replaceState({}, document.title, "/");
        } else {
          alert("로그인이 필요한 페이지입니다.");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        alert("사용자 정보를 불러올 수 없습니다.");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      });
    }
  }, []);

  


  return (
    <Router>
      <Routes>
        {/* AuthLayout (로그인/회원가입 페이지) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/nickname-setting" element={<NicknameSettingPage />} />
        </Route>

        {/* 나머지 페이지들 (isLoggedIn 여부에 따라 MainLayout 또는 UserLayout) */}
        <Route element={isLoggedIn ? <UserLayout userInfo={userInfo} setIsLoggedIn={setIsLoggedIn} /> : <MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/select-destination" element={<DestinationSelectPage />} />
          <Route path="/travel-type" element={<TravelTypeSelectPage />} />
          <Route path="/travel-date" element={<TravelDatePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/RecommendationPlan" element={<RecommendationPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/consumers/:consumerId/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<DetailedPostPage />} />
          <Route path="/posts/posting" element={<PostingPage isEdit={false} />} />
          <Route path="/posts/:postId/edit" element={<PostingPage isEdit={true} />} />
          <Route path="/invite/:roomId" element={<InvitePage />} />
          <Route path="/rooms/:roomId" element={<RoomPage />} />
          <Route path="/posts/likes" element={<MyLikedPostsPage />} />
          <Route path="/posts/mine" element={<MyPostsPage />} />
          <Route path="/mycourse" element={<MyCoursePage />} />
        </Route>

        {/* 잘못된 경로면 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}


export default App;
