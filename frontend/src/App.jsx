import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EntryEditor from "./pages/EntryEditor.jsx";
import EntryView from "./pages/EntryView.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <EntryEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EntryEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entry/:id"
            element={
              <ProtectedRoute>
                <EntryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl px-6 py-20 text-center">
                <p className="retro-heading text-4xl">404</p>
                <p className="mt-2 font-serif text-paper/70">
                  This page doesn't exist in your journal.
                </p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
