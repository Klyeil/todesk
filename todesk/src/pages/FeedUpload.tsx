import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedUpload.css';

const FeedUpload = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!title || !image) {
      setError('제목과 이미지는 필수입니다.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5003/api/feeds', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 201) {
        alert('피드가 업로드되었습니다!');
        navigate('/desk');
      }
    } catch (err) {
      console.error('업로드 에러:', err);
      setError((err as any).response?.data?.error || '피드 업로드에 실패했습니다.');
    }
  };

  return (
    <div className="feed-upload-container">
      <form className="feed-upload-form" onSubmit={handleSubmit}>
        <div className="box-section">
          <div className="image-upload-area" onDragOver={handleDragOver} onDrop={handleDrop}>
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <>
                <IoCloudUploadOutline className="upload-icon" />
                <p>드래그하여 파일을 업로드하거나</p>
                <label htmlFor="image" className="file-select-button">
                  파일 선택
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="button-group">
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="feed-submit-button">
            피드 업로드
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedUpload;