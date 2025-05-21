import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import '../styles/DetailedPostPage.css';
import { Heart } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '290px',
};

const categoryEnumMap = {
  SIGHTSEEING: '관광명소',
  FOOD: '음식',
  CAFE: '카페',
  SHOPPING: '쇼핑',
  NATURE: '자연',
  CULTURE: '문화',
  ACTIVITY: '체험',
  RELAX: '휴식',
  NIGHT: '야경/밤',
  OTHER: '기타',
};

const DetailedPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8080/consumers/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCurrentUserId(data.id))
        .catch(() => console.error('유저 정보 불러오기 실패'));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    fetch(`http://localhost:8080/posts/${postId}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        const result = data.result;
        setPost({
          id: result.postId,
          title: result.title,
          text: result.content,
          images: result.images,
          liked: result.liked ?? false,
          user: {
            id: result.writerId,
            nickname: result.nickname,
            avatar: result.profile
              ? `${result.profile}`
              : '/images/default-profile.webp',
          },
        });
        setPlan(result.plan);
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패', err);
        alert('게시글을 불러오는 데 실패했습니다.');
        navigate('/posts');
      });
  }, [postId, navigate]);

  const toggleLike = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const method = post.liked ? 'DELETE' : 'POST';

    setPost((prev) => ({
      ...prev,
      liked: !prev.liked,
    }));

    fetch(`http://localhost:8080/posts/${postId}/like`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => {
      console.error('좋아요 요청 실패', err);
      setPost((prev) => ({
        ...prev,
        liked: !prev.liked,
      }));
    });
  };

  const editPost = () => {
    navigate(`/posts/${postId}/edit`, {
      state: { post: { ...post, plan: plan } , },
    });
  };

  const deletePost = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      fetch(`http://localhost:8080/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(() => {
          alert('삭제되었습니다.');
          navigate('/posts');
        })
        .catch((err) => {
          console.error('삭제 실패', err);
        });
    }
  };

  if (!post || !plan) return <div>게시글을 불러오는 중입니다...</div>;

  const isAuthor =
    post.user?.id != null &&
    currentUserId != null &&
    Number(post.user.id) === Number(currentUserId);

  const selectedPlaces = plan.places
    .filter((place) => place.dayNumber === selectedDay)
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  const center =
    selectedPlaces.length > 0
      ? { lat: selectedPlaces[0].latitude, lng: selectedPlaces[0].longitude }
      : { lat: 37.5665, lng: 126.9780 };

  const polylinePath = selectedPlaces.map((p) => ({
    lat: p.latitude,
    lng: p.longitude,
  }));

  return (
    <div className="detailed-post-page">
      <div className="post-title">{post.title}</div>

      <div
        className="user-info"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/consumers/${post.user.id}/posts`);
        }}
      >
        <img src={post.user.avatar} alt="avatar" className="avatar" />
        <span className="username">{post.user.nickname}</span>
      </div>

      <div className="image-grid">
        {post.images.map((img, idx) => (
          <img key={idx} src={`http://localhost:8080${img.storedPath}`} alt={img.originalFilename || `image-${idx}`} className="post-image" />
        ))}
      </div>

      <div className="post-text-like">
        <div className="post-text">{post.text}</div>
        {!isAuthor && (
          <div className="heart-icon" onClick={toggleLike}>
            <Heart stroke="red" fill={post.liked ? 'red' : 'none'} className="w-6 h-6" />
          </div>
        )}
      </div>

      <h2 className="plan-title">{plan.title}</h2>

      <div className="map-box">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            key={selectedDay}
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
          >
            {selectedPlaces.map((place, idx) => (
              <Marker
                key={idx}
                position={{ lat: place.latitude, lng: place.longitude }}
                label={{ text: String(idx + 1), color: 'white' }}
              />
            ))}
            {polylinePath.length > 1 && (
              <Polyline
                path={polylinePath}
                options={{
                  strokeColor: '#888',
                  strokeOpacity: 0.6,
                  strokeWeight: 2,
                  icons: [
                    {
                      icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                      offset: '0',
                      repeat: '20px',
                    },
                  ],
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="day-tabs">
        {[...new Set(plan.places.map((p) => p.dayNumber))]
          .sort()
          .map((day) => (
            <button
              key={day}
              className={`tab ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              Day {day}
            </button>
          ))}
      </div>

      <div className="schedule-box">
        {selectedPlaces.map((place, idx) => (
          <div key={place.placeId} className="schedule-item">
            <div className="circle">{idx + 1}</div>
            <div className="time">{place.time.slice(11, 16)}</div>
            <div className="place">
              <strong>{place.name}</strong>
              <p className="type">{categoryEnumMap[place.category]}</p>
              <p className="desc">{place.description}</p>
            </div>
          </div>
        ))}
      </div>

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
