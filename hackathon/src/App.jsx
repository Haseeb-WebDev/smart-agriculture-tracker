import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import your page components
import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import FarmerDashboard from './FarmerDashboard';
import WeatherModule from './WeatherModule';
import CommunityForum from './CommunityForum';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUsername = localStorage.getItem('username');
    
    if (storedRole && storedUsername) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
    }
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to={userRole === 'admin' ? '/admin' : '/farmer'} replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Login Page - Shows first */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to={userRole === 'admin' ? '/admin' : '/farmer'} replace />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            )
          } 
        />
        
        {/* Admin Dashboard */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Farmer Dashboard */}
        <Route 
          path="/farmer" 
          element={
            <ProtectedRoute allowedRole="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Weather Module */}
        <Route 
          path="/weather" 
          element={
            <ProtectedRoute>
              <WeatherModule />
            </ProtectedRoute>
          } 
        />
        
        {/* Community Forum */}
        <Route 
          path="/forum" 
          element={
            <ProtectedRoute>
              <CommunityForum />
            </ProtectedRoute>
          } 
        />
        
        {/* Root redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;