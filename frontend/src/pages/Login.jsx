import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="retro-panel p-8">
        <h1 className="retro-heading text-3xl">Welcome Back</h1>
        <p className="mt-2 font-serif text-sm text-paper/70">
          Pick up your pen where you left off.
        </p>

        {error && (
          <div className="mt-4 border-2 border-red-700 bg-red-900/30 px-4 py-2 font-body text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-body text-sm text-paper/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="retro-input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-sm text-paper/70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="retro-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="retro-btn mt-2 disabled:opacity-60">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-paper/60">
          New here?{" "}
          <Link to="/register" className="text-amber-glow underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
