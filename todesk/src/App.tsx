import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/NavBar.tsx';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default App;