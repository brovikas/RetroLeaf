import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Top navigation bar - shown across all pages
// On mobile, links collapse into a slide-in sidebar menu
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b-2 border-crt-border bg-crt-panel">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="text-2xl">📓</span>
          <span className="retro-heading text-xl">Retroleaf</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="font-body text-sm text-paper/80 transition-colors hover:text-amber-glow"
              >
                Dashboard
              </Link>
              <Link
                to="/new"
                className="font-body text-sm text-paper/80 transition-colors hover:text-amber-glow"
              >
                New Entry
              </Link>
              <Link
                to="/profile"
                className="font-body text-sm text-paper/80 transition-colors hover:text-amber-glow"
              >
                {user.avatarEmoji} Profile
              </Link>
              <button onClick={handleLogout} className="retro-btn-outline text-sm">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="retro-btn-outline text-sm">
                Log In
              </Link>
              <Link to="/register" className="retro-btn text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center border-2 border-crt-border rounded-2xl text-amber-glow md:hidden"
        >
          <span className="text-xl">☰</span>
        </button>
      </nav>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 max-w-[80%] flex-col gap-1 border-l-2 border-crt-border bg-crt-panel p-6 shadow-retro transition-transform duration-200 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="retro-heading text-lg">Menu</span>
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center border-2 border-crt-border rounded-2xl text-amber-glow"
          >
            ✕
          </button>
        </div>

        {user ? (
          <>
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="border-b border-crt-border py-3 font-body text-sm text-paper/80 transition-colors hover:text-amber-glow"
            >
              Dashboard
            </Link>
            <Link
              to="/new"
              onClick={closeMenu}
              className="border-b border-crt-border py-3 font-body text-sm text-paper/80 transition-colors hover:text-amber-glow"
            >
              New Entry
            </Link>
            <Link
              to="/profile"
              onClick={closeMenu}
              className="border-b border-crt-border py-3 font-body text-sm text-paper/80 transition-colors hover:text-amber-glow"
            >
              {user.avatarEmoji} Profile
            </Link>
            <button onClick={handleLogout} className="retro-btn-outline mt-4 text-sm">
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu} className="retro-btn-outline mt-2 text-sm">
              Log In
            </Link>
            <Link to="/register" onClick={closeMenu} className="retro-btn mt-2 text-sm">
              Sign Up
            </Link>
          </>
        )}
      </aside>
    </header>
  );
};

export default Navbar;