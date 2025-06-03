import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Pencil } from 'lucide-react';
import '../styles/PostsPage.css';

const MyLikedPostsPage = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 로그인 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8080/consumers/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCurrentUserId(data.result.id))
        .catch(() => console.error('유저 정보를 불러오는 데 실패했습니다.'));
    } else {
      setCurrentUserId(0);
    }
  }, []);

  // 서버 응답 데이터를 프론트 형식으로 변환
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

  // 좋아요한 게시글 불러오기
  const fetchLikedPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`http://localhost:8080/posts/likes?page=0&size=100`, { headers });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`서버 오류: ${text}`);
      }

      const data = await res.json();
      const transformed = transformResponse(data.result.posts);
      setPostList(transformed);
    } catch (err) {
      console.error('좋아요한 게시글 로딩 실패', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId !== null) {
      fetchLikedPosts();
    }
  }, [currentUserId]);

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
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>좋아요한 게시글</h2>

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
                      <img
                        key={idx}
                        src={`http://localhost:8080${img}`}
                        alt="post"
                        className="post-image"
                      />
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

export default MyLikedPostsPage;
