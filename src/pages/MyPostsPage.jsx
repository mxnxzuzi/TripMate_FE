import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import '../styles/PostsPage.css';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchMyPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`http://localhost:8080/posts/mine?page=0&size=100`, { headers });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`서버 오류: ${text}`);
      }

      const data = await res.json();
      console.log("서버 응답:", data);

      const transformed = transformResponse(data.result.posts || []);
      console.log("변환된 데이터:", transformed);

      setPostList(transformed);
    } catch (err) {
      console.error('내 게시글 로딩 실패', err);
      alert(`게시글 로딩 중 오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleFloatingButtonClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/posts/posting');
    } else {
      navigate('/login');
    }
  };

  console.log("렌더링!", { loading, postListLength: postList.length, postList });

  return (
    <div className="post-container">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>내가 쓴 게시글</h2>

      <div className="post-list">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            게시글을 불러오는 중입니다...
          </div>
        ) : postList.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            아직 게시글이 없습니다.
          </div>
        ) : (
          postList.map((post) => (
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
              </div>
            </div>
          ))
        )}
      </div>

      <button className="floating-btn" onClick={handleFloatingButtonClick}>
        <Pencil className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MyPostsPage;
