import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PostingPage.css';

const dummyPlans = [
  { id: 1, title: '대구 여행 test' },
  { id: 2, title: '서울/1박 2일(2024.11.12~2024.11.14)' },
  { id: 3, title: '파리/5박 6일(2024.06.01~2024.06.05)' },
];

const PostingPage = ({ isEdit = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  const [selectedPlan, setSelectedPlan] = useState(() =>
    post && post.plan ? { id: post.plan.planId, title: post.plan.title } : { id: '', title: '' }
  );
  const [title, setTitle] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [content, setContent] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isEdit && post && !isInitialized) {
      const matchedPlan = dummyPlans.find((plan) => plan.id == post.plan?.planId);
      if (matchedPlan) {
        setSelectedPlan({ id: matchedPlan.id, title: matchedPlan.title });
      }
      setTitle(post.title || '');
      setContent(post.text || '');

      const existingImages = post.images.map(img => ({
        url: `http://localhost:8080${img.storedPath}`,
        name: img.originalFilename,
      }));
      setImageFiles(existingImages);
      setIsInitialized(true);
    }
  }, [isEdit, post, isInitialized]);

  const addPostImage = (e) => {
    const newFiles = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const deleteImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submitPost = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (selectedPlan.id) formData.append('planId', selectedPlan.id);

    // 업데이트 전용 처리
    if (isEdit) {
      const deleteImageIds = post.images
        .filter((img) =>
          !imageFiles.some((f) =>
            !(f instanceof File) && f.url === `http://localhost:8080${img.storedPath}`
          )
        )
        .map((img) => img.id);

      const newImageFiles = imageFiles.filter((file) => file instanceof File);

      newImageFiles.forEach((file) => {
        formData.append('newImages', file);
      });

      deleteImageIds.forEach((id) => {
        formData.append('deleteImageIds', id);
      });
    } else {
      // 생성일 경우에는 그냥 images로 전송
      imageFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append('images', file);
        }
      });
    }

    try {
      const endpoint = isEdit
        ? `http://localhost:8080/posts/${post.id}`
        : 'http://localhost:8080/posts';

      const response = await fetch(endpoint, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const data = await response.json();
      alert(isEdit ? '수정 완료되었습니다.' : '등록 완료되었습니다.');
      navigate(`/posts/${isEdit ? post.id : data.result.postId}`);
    } catch (error) {
      console.error('등록 또는 수정 실패', error);
      alert('오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="posting-container">
      <div className="form-wrapper">
        <select
          value={selectedPlan.id}
          onChange={(e) => {
            const selectedId = e.target.value;
            const foundPlan = dummyPlans.find((plan) => String(plan.id) === selectedId);
            setSelectedPlan(foundPlan ? { id: String(foundPlan.id), title: foundPlan.title } : { id: '', title: '' });
          }}
          className="dropdown"
        >
          <option value="">일정 선택</option>
          {dummyPlans.map((plan) => (
            <option key={plan.id} value={String(plan.id)}>
              {plan.title}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={addPostImage}
          className="image-upload"
        />

        <div className="preview-list">
          {imageFiles.map((file, idx) => {
            const imageUrl = file instanceof File ? URL.createObjectURL(file) : file.url;
            const imageName = file instanceof File ? file.name : file.name;

            return (
              <div key={idx} className="preview-item">
                <img src={imageUrl} alt="preview" className="preview-thumbnail" />
                <span className="file-name">{imageName}</span>
                <button className="delete-btn" onClick={() => deleteImage(idx)}>×</button>
              </div>
            );
          })}
        </div>

        <input
          type="text"
          className="post-title-input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="post-textarea"
          placeholder="여행 기록하기"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="button-group">
          <button className="submit-btn" onClick={submitPost}>
            {isEdit ? '수정 완료' : '등록'}
          </button>
          <button className="cancel-btn" onClick={() => window.history.back()}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostingPage;
