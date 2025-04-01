import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import NewFile from './components/NewFile';
import Dashboard from './components/Dashboard';
import FileList from './components/FileList';
import UserProfile from './components/Userprofile';
function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  // ✅ Update token state when login occurs
  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    setToken(storedToken);
  }, [token]);  // ✅ Re-run effect when token changes

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken'); // ✅ Remove refresh token on logout
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!token ? <Login onLogin={setToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login onLogin={setToken} />} />  {/* ✅ Add login route */}
        <Route path="/upload" element={token ? <NewFile onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/files" element={token ? <FileList /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
