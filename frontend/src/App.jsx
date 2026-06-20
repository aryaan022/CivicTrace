import React, { useState } from 'react';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import AdminDashboard from './AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} user={user} setUser={setUser} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} user={user} setUser={setUser} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} user={user} setUser={setUser} />;
      case 'admin-dashboard':
        return <AdminDashboard setCurrentPage={setCurrentPage} user={user} setUser={setUser} />;
      default:
        return <Home setCurrentPage={setCurrentPage} user={user} setUser={setUser} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;
