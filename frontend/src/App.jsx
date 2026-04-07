import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Ebooks from './pages/Ebooks';
import Publications from './pages/Publications';
import Webinars from './pages/Webinars'; 
import Tutorials from './pages/Tutorials';
import Community from './pages/Community';
import Blogs from './pages/Blogs';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import BlogDetail from './pages/BlogDetail';
import Founder from './pages/Founder';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ebooks" element={<ProtectedRoute><Ebooks /></ProtectedRoute>} />
        <Route path="/publications" element={<ProtectedRoute><Publications /></ProtectedRoute>} />
        <Route path="/webinars" element={<ProtectedRoute><Webinars /></ProtectedRoute>} />
        <Route path="/tutorials" element={<ProtectedRoute><Tutorials /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
        <Route path="/blogs/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
        <Route path="/founder" element={<ProtectedRoute><Founder /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;