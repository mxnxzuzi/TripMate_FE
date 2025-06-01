import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Heart, Pencil } from 'lucide-react';
import axios from 'axios';
import '../styles/PostsPage.css';

const CommunityPostsPage = () => {
  const navigate = useNavigate();
  const { consumerId } = useParams();
  const [searchParams] = useSearchParams();
  const countryFromQuery = searchParams.get('country');

  const [currentUserId, setCurrentUserId] = useState(null);
  const [postList, setPostList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(countryFromQuery || '');
  const [isUserPost, setIsUserPost] = useState(false);
  const [isMyPost, setIsMyPost] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/consumers/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setCurrentUserId(res.data.result.id))
        .catch(() => console.error('유저 정보를 불러오는 데 실패했습니다.'));
    } else {
      setCurrentUserId(0);
    }
  }, []);

  const transformResponse = (postsFromServer) => {
    return postsFromServer.map((post) => ({
      id: post.postId,
      title: post.title,
      text: post.content,
      images: post.images,
      liked: post.liked ?? false,
      user: {
        id: post.writerId,
        nickname: post.nickname,
        avatar: post.profile ? `${post.profile}` : '/images/default-profile.webp',
      },
    }));
  };

  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    let baseUrl = consumerId
      ? `/consumers/${consumerId}/posts`
      : selectedCountry
        ? `/posts?country=${encodeURIComponent(selectedCountry)}`
        : `/posts`;

    const url = baseUrl.includes('?')
      ? `${baseUrl}&page=0&size=100`
      : `${baseUrl}?page=0&size=100`;

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`http://localhost:8080${url}`, { headers });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`서버 오류: ${text}`);
      }

      const data = await res.json();
      const transformed = transformResponse(data.result.posts);
      setPostList(transformed);
    } catch (err) {
      console.error('게시글 로딩 실패', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId !== null) {
      setIsUserPost(!!consumerId);
      setIsMyPost(Number(consumerId) === currentUserId);
      fetchPosts();
    }
  }, [consumerId, selectedCountry, currentUserId]);

  const toggleLike = (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const targetPost = postList.find((post) => post.id === postId);
    const method = targetPost?.liked ? 'DELETE' : 'POST';

    setPostList((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      )
    );

    fetch(`http://localhost:8080/posts/${postId}/like`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => {
      console.error('좋아요 요청 실패', err);
      setPostList((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, liked: !post.liked } : post
        )
      );
    });
  };

  const filteringByCountry = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    navigate(country ? `/posts?country=${encodeURIComponent(country)}` : '/posts');
  };

  const handleFloatingButtonClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/posts/posting');
    } else {
      navigate('/login');
    }
  };

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
        {postList.map((post) => {
          const isAuthor = post.user.id === currentUserId;

          return (
            <div key={post.id} className="post-item">
              <div className="post-title">{post.title}</div>

              <div
                className="user-info"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/consumers/${post.user.id}/posts`);
                }}
              >
                <img src={post.user.avatar} alt="avatar" className="avatar" />
                <div className="text-info">
                  <div className="username">{post.user.nickname}</div>
                </div>
              </div>

              <div
                className="post-content"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.images.length > 0 && (
                  <div className="image-grid">
                    {post.images.map((img, idx) => (
                      <img key={idx} src={`http://localhost:8080${img}`} alt="post" className="post-image" />
                    ))}
                  </div>
                )}
                <p className="post-text">{post.text}</p>

                {!isAuthor && (
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
          );
        })}
      </div>

      <button className="floating-btn" onClick={handleFloatingButtonClick}>
        <Pencil className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CommunityPostsPage;