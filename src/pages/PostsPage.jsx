import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Heart, Pencil } from 'lucide-react';
import '../styles/PostsPage.css';

const dummyPosts = [
  {
    id: 1,
    user: {
      id: 1,
      nickname: 'luvddong_dong',
      avatar: 'image_url',
    },
    planId: 1,
    title: '도쿄/1박 2일(2025.01.02~2025.01.04)',
    text: '도쿄 여행 코스 추천! 특히 00점에서 장어덮밥 꼭 먹기…',
    images: [
      'image_url1',
      'image_url2',
      'image_url3',
      'image_url4',
    ],
    liked: true,
  },
  {
    id: 2,
    user: { 
      id: 2, 
      nickname: 'ssuong_01', 
      avatar: 'image_url' 
    },
    planId: 1,
    title: '도쿄/1박 2일(2025.01.02~2025.01.04)',
    text: '칼디 가서 꼭 퀸아망 스프레드 사와',
    images: [
      'image_url1', 
      'image_url2',
    ],
    liked: false,
  },
];

const CommunityPostsPage = () => {
  const navigate = useNavigate();
  const { consumerId } = useParams();
  const [searchParams] = useSearchParams();
  const countryFromQuery = searchParams.get('country');

  const currentUserId = 2;

  const [postList, setPostList] = useState(dummyPosts);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isUserPost, setIsUserPost] = useState(false);
  const [isMyPost, setIsMyPost] = useState(false);

  const toggleLike = (postId) => {
    setPostList((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      )
    );
    fetch(`/posts/${postId}/like`, { method: 'POST' });
  };

  const filteringByCountry = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);

    if (country) {
      navigate(`/posts?country=${encodeURIComponent(country)}`);
    } else {
      navigate('/posts');
    }
  };

  useEffect(() => {
    if (consumerId) {
      setIsUserPost(true);
      setIsMyPost(Number(consumerId) === currentUserId);

      fetch(`/consumers/${consumerId}/posts`)
        .then((res) => res.json())
        .then((data) => setPostList(data))
        .catch((err) => console.error('유저 게시글 로딩 실패', err));
    } else {
      setIsUserPost(false);
      setIsMyPost(false);

      const url = countryFromQuery
        ? `/posts?country=${encodeURIComponent(countryFromQuery)}`
        : '/posts';
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setPostList(data);
          setSelectedCountry(countryFromQuery || '');
        })
        .catch((err) => console.error('전체 게시글 로딩 실패', err));
    }
  }, [consumerId, countryFromQuery]);

  return (
    <div className="post-container">
      <div className="post-header">
        {!isUserPost && (
          <div className="auth-select">
            <select value={selectedCountry} onChange={filteringByCountry}>
              <option value="">나라</option>
              <option value="국내">국내</option>
              <option value="일본">일본</option>
              <option value="동남아">동남아</option>
              <option value="중국">중국</option>
              <option value="유럽">유럽</option>
              <option value="미주">미주</option>
              <option value="캐나다">캐나다</option>
            </select>
          </div>
        )}
      </div>

      <div className="post-list">
        {postList.map((post) => (
          <div key={post.id} className="post-item">
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

            <div
              className="post-content"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.images.length > 0 && (
                <div className="image-grid">
                  {post.images.map((img, idx) => (
                    <img key={idx} src={img} alt="post" className="post-image" />
                  ))}
                </div>
              )}
              <p className="post-text">{post.text}</p>
              {!isMyPost && (
                <div
                  className="heart-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(post.id);
                  }}
                >
                  <Heart
                    stroke="red"
                    fill={post.liked ? 'red' : 'none'}
                    className="w-6 h-6"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✨ 플로팅 버튼 추가 */}
      <button
        className="floating-btn"
        onClick={() => navigate('/posts/posting')}
      >
        <Pencil className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CommunityPostsPage;