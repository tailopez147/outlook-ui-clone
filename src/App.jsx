import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import SignIn from './pages/SignIn'
import Mail from './pages/Mail'
import Calendar from './pages/Calendar'
import People from './pages/People'
import Tasks from './pages/Tasks'
import Video from './pages/Video'
import Apps from './pages/Apps'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <SignIn />;

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={window.location.search.includes('token') ? "/mail" : "/people"} replace />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/people" element={<People />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/video" element={<Video />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App

