import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import FeedPage from './pages/FeedPage.tsx';
import ConsultingPage from './pages/ConsultingPage.tsx';
import CommunityPage from './pages/CommunityPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import FeedUpload from './pages/FeedUpload.tsx';
import PostCreation from './pages/PostCreation.tsx';
import PostPage from './pages/PostPage.tsx';
import FeedDetailPage from './pages/FeedDetailPage.tsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="desk" element={<FeedPage />} />
          <Route path="desk/:id" element={<FeedDetailPage />} />
          <Route path="desk/upload" element={<FeedUpload />} />
          <Route path="consult" element={<ConsultingPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/post" element={<PostCreation />} />
          <Route path="/community/:id" element={<PostPage />} />
          <Route path="login" element={<LoginPage />} />      
          <Route path="signup" element={<SignUpPage />} />          
          <Route path="profile" element={<ProfilePage />} />     
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);