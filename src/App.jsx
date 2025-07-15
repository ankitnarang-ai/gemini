import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./components/auth/Login";
import { useState } from "react";
import Toast from "./shared/Toast";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <Router>
      <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Toast />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/chat" />
                ) : (
                  <LoginPage onSuccess={() => setIsAuthenticated(true)} />
                )
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <ChatPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
