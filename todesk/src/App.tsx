import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/NavBar.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
    </AuthProvider>
  );
};

export default App;