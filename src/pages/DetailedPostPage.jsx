import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import '../styles/DetailedPostPage.css';
import { Heart } from 'lucide-react';

// 더미 데이터
const dummyPost = {
  id: 1,
  user: {
    id: 1,
    nickname: 'luvddong_dong',
    avatar: 'image_url',
  },
  planId: 1,
  title: '도쿄 여행',
  text: '도쿄 여행 코스 추천! 특히 00점에서 장어덮밥 꼭 먹기…',
  images: [
    'image_url1',
    'image_url2',
    'image_url3',
    'image_url4',
  ],
  liked: false,
};

const dummyPlans = [
  {
    id: 1,
    title: '도쿄/1박 2일(2025.01.02~2025.01.04)',
    schedules: [
      {
        day: 1,
        items: [
          { time: '09:00', name: '롯데월드', type: '관광 명소', desc: '대한민국 대표 테마파크' },
          { time: '11:00', name: '고도식', type: '음식점', desc: '프리미엄 한식당' },
          { time: '13:00', name: '시그니엘 서울', type: '전망대', desc: '서울 전경을 한눈에 볼 수 있는 곳' },
          { time: '15:00', name: '커피빈', type: '카페', desc: '휴식 시간' },
          { time: '17:00', name: '서울숲', type: '자연경관', desc: '자연과 함께 힐링' },
        ],
      },
      {
        day: 2,
        items: [
          { time: '09:30', name: '남산타워', type: '전망대', desc: '서울의 전경을 감상할 수 있는 대표적인 랜드마크' },
          { time: '11:30', name: '이태원 브런치 카페', type: '맛집/카페', desc: '감성 가득한 분위기에서 여유로운 브런치를 즐길 수 있는 곳' },
          { time: '13:30', name: '서울역사박물관', type: '전시/문화', desc: '서울의 과거와 현재를 한눈에 볼 수 있는 문화 공간' },
          { time: '15:30', name: '한강공원 반포지구', type: '자연/레저', desc: '시원한 강바람과 함께 자전거 타기와 산책을 즐길 수 있는 명소' },
          { time: '18:00', name: '더현대 서울', type: '쇼핑몰', desc: '최신 트렌드의 패션과 푸드를 한곳에서 경험할 수 있는 핫플레이스' },
        ],
      },
    ],
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '290px',
};

const center = {
  lat: 35.6764,
  lng: 139.6500, // 도쿄 중심
};

const DetailedPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);

  const currentUserId = 1; // ✨ 임시 로그인 사용자 ID

  const toggleLike = () => {
    setPost((prev) => ({
      ...prev,
      liked: !prev.liked,
    }));

    fetch(`/posts/${postId}/like`, {
      method: 'POST',
    });
  };

  const editPost = () => {
    navigate(`/posts/${postId}/edit`, {
      state: { post: post },
    });
  };

  const deletePost = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      fetch(`/posts/${postId}`, { method: 'DELETE' })
        .then(() => {
          alert('삭제되었습니다.');
          navigate('/posts');
        })
        .catch((err) => {
          console.error('삭제 실패', err);
        });
    }
  };

  useEffect(() => {
    setPost(dummyPost);
    // fetch(`/posts/${postId}`)
    //   .then((res) => res.json())
    //   .then((data) => setPost(data))
    //   .catch((err) => console.error('게시글 불러오기 실패', err));
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  const isAuthor = post.user.id === currentUserId;

  // ✨ 현재 plan의 schedule 가져오기
  const plan = dummyPlans.find((p) => p.id === post.planId);

  return (
    <div className="detailed-post-page">
      {/* 게시글 헤더 */}
      <div
        className="user-info"
        onClick={() => navigate(`/consumers/${post.user.id}/posts`)}
        style={{ cursor: 'pointer' }}
      >
        <img src={post.user.avatar} alt="avatar" className="avatar" />
        <span className="username">{post.user.nickname}</span>
      </div>

      {/* 첨부 사진 */}
      <div className="image-grid">
        {post.images.map((img, idx) => (
          <img key={idx} src={img} alt="post" className="post-image" />
        ))}
      </div>

      {/* 본문 내용 + 좋아요 */}
      <div className="post-text-like">
        <div className="post-text">{post.text}</div>
        {!isAuthor && (
          <div className="heart-icon" onClick={toggleLike}>
            <Heart stroke="red" fill={post.liked ? 'red' : 'none'} className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* 여행 제목 */}
      <h2 className="plan-title">{post.title}</h2>

      {/* 지도 */}
      <div className="map-box">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
          />
        </LoadScript>
      </div>

      {/* 날짜 탭 */}
      {plan && (
        <div className="day-tabs">
          {plan.schedules.map((schedule) => (
            <button
              key={schedule.day}
              className={`tab ${selectedDay === schedule.day ? 'active' : ''}`}
              onClick={() => setSelectedDay(schedule.day)}
            >
              Day {schedule.day}
            </button>
          ))}
        </div>
      )}

      {/* 일정 리스트 */}
      {plan && (
        <div className="schedule-box">
          {plan.schedules
            .find((schedule) => schedule.day === selectedDay)
            ?.items.map((item, idx) => (
              <div key={idx} className="schedule-item">
                <div className="circle">{idx + 1}</div>
                <div className="time">{item.time}</div>
                <div className="place">
                  <strong>{item.name}</strong>
                  <p className="type">{item.type}</p>
                  <p className="desc">{item.desc}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 수정/삭제 버튼 (작성자만) */}
      {isAuthor && (
        <div className="my-post-actions">
          <button className="edit-btn" onClick={editPost}>
            수정
          </button>
          <button className="delete-btn" onClick={deletePost}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailedPostPage;
