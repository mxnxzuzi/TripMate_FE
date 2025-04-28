import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PostingPage.css';

const PostingPage = ({ isEdit = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  const dummyPlans = [
    { id: 1, title: '도쿄/1박 2일(2025.01.02~2025.01.04)' },
    { id: 2, title: '서울/1박 2일(2024.11.12~2024.11.14)' },
    { id: 3, title: '파리/5박 6일(2024.06.01~2024.06.05)' },
  ];

  const [selectedPlan, setSelectedPlan] = useState({ id: '', title: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isEdit && post) {
      // planId로 dummyPlans에서 찾아서 세팅
      const matchedPlan = dummyPlans.find((plan) => plan.id === post.planId);
      if (matchedPlan) {
        setSelectedPlan({ id: matchedPlan.id, title: matchedPlan.title });
      }
      setImageFiles(post.images || []);
      setContent(post.text || '');
    }
  }, [isEdit, post]);

  const addPostImage = (e) => {
    const newFiles = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const deleteImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submitPost = async () => {
    const formData = new FormData();
  
    if (selectedPlan.id) {
      formData.append('planId', selectedPlan.id);
      formData.append('title', selectedPlan.title);
    }
  
    imageFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });
  
    formData.append('content', content);
  
    try {
      if (isEdit) {
        // 수정인 경우
        await fetch(`/posts/${post.id}`, {
          method: 'PATCH',
          body: formData,
        });
        alert('수정 완료되었습니다.');
        navigate(`/posts/${post.id}`); // 수정 후 바로 상세페이지로 이동 (fetch는 상세페이지에서 처리!)
      } else {
        // 새 등록인 경우
        const res = await fetch('/posts', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        alert('등록 완료되었습니다.');
        navigate(`/posts/${data.id}`); // 새로 등록된 게시글 id로 상세페이지 이동
      }
    } catch (error) {
      console.error('등록 또는 수정 실패', error);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="posting-container">
      <div className="form-wrapper">
        {/* 일정 선택 */}
        <select
          value={selectedPlan.id}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const foundPlan = dummyPlans.find((plan) => plan.id === selectedId);
            if (foundPlan) {
              setSelectedPlan({ id: foundPlan.id, title: foundPlan.title });
            } else {
              setSelectedPlan({ id: '', title: '' });
            }
          }}
          className="dropdown"
        >
          <option value="">일정 선택</option>
          {dummyPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.title}</option>
          ))}
        </select>

        {/* 이미지 업로드 */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={addPostImage}
          className="image-upload"
        />

        {/* 미리보기 */}
        <div className="preview-list">
          {imageFiles.map((file, idx) => {
            let imageUrl = '';

            if (file instanceof File) {
              imageUrl = URL.createObjectURL(file);
            } else if (typeof file === 'string') {
              imageUrl = file;
            }

            return (
              <div key={idx} className="preview-item">
                <img src={imageUrl} alt="preview" className="preview-thumbnail" />
                <span className="file-name">{file instanceof File ? file.name : '기존 업로드 이미지'}</span>
                <button className="delete-btn" onClick={() => deleteImage(idx)}>×</button>
              </div>
            );
          })}
        </div>

        {/* 본문 작성 */}
        <textarea
          className="post-textarea"
          placeholder="여행 기록하기"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 버튼 */}
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
