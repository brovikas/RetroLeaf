import { useState, useEffect } from "react";
import API from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const avatarOptions = ["📓", "✍️", "📖", "🖋️", "📔", "🌙", "☕", "📼"];
const themeOptions = [
  { value: "retro-amber", label: "Amber Glow", color: "#FFC857" },
  { value: "retro-mint", label: "Mint CRT", color: "#3FA796" },
  { value: "retro-purple", label: "Purple Haze", color: "#7B5CFF" },
  { value: "retro-blue", label: "Cool Blue", color: "#5CA8FF" },
];

// User profile settings page - avatar, theme, password, and site stats
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [avatarEmoji, setAvatarEmoji] = useState(user?.avatarEmoji || "📓");
  const [theme, setTheme] = useState(user?.theme || "retro-amber");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [visitStats, setVisitStats] = useState(null);

  // Fetch site-wide visit statistics (IP based analytics feature)
  useEffect(() => {
    const fetchVisitStats = async () => {
      try {
        const { data } = await API.get("/visits/stats");
        setVisitStats(data);
      } catch (err) {
        console.error("Failed to load visit stats:", err);
      }
    };
    fetchVisitStats();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = { avatarEmoji, theme };
      if (password) payload.password = password;

      const { data } = await API.put("/auth/profile", payload);
      updateUser(data);
      setPassword("");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="retro-heading text-3xl">Profile Settings</h1>
      <p className="mt-1 font-serif text-sm text-paper/60">
        Logged in as <span className="text-amber-glow">{user?.username}</span> ({user?.email})
      </p>

      {message && (
        <div className="mt-4 border-2 border-mint bg-mint/10 px-4 py-2 font-body text-sm text-mint">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 border-2 border-red-700 bg-red-900/30 px-4 py-2 font-body text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="retro-panel mt-6 flex flex-col gap-6 p-6">
        {/* Avatar picker */}
        <div>
          <label className="mb-2 block font-body text-sm text-paper/70">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {avatarOptions.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setAvatarEmoji(emoji)}
                className={
                  avatarEmoji === emoji
                    ? "retro-btn h-12 w-12 text-2xl"
                    : "retro-btn-outline h-12 w-12 text-2xl"
                }
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Theme picker */}
        <div>
          <label className="mb-2 block font-body text-sm text-paper/70">Color Theme</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {themeOptions.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex flex-col items-center gap-2 border-2 p-3 transition-colors ${
                  theme === t.value ? "border-amber" : "border-crt-border"
                }`}
              >
                <span
                  className="h-6 w-6 rounded-full border border-crt-border"
                  style={{ backgroundColor: t.color }}
                />
                <span className="font-body text-xs text-paper/70">{t.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 font-body text-xs text-paper/40">
            Note: theme switching is saved to your profile for future updates.
          </p>
        </div>

        {/* Password change */}
        <div>
          <label className="mb-1 block font-body text-sm text-paper/70">
            New Password (optional)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="retro-input"
            minLength={6}
          />
        </div>

        <button type="submit" className="retro-btn self-start">
          Save Changes
        </button>
      </form>

      {/* Site visit stats - unique feature using IP-based visit logging */}
      {visitStats && (
        <div className="retro-panel mt-6 p-6">
          <p className="retro-heading text-lg">📊 Site Activity</p>
          <p className="mt-1 font-serif text-sm text-paper/60">
            A peek at Retroleaf's overall traffic, tracked anonymously by IP.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="retro-heading text-2xl text-amber-glow">{visitStats.totalVisits}</p>
              <p className="font-body text-xs text-paper/50">Total Visits</p>
            </div>
            <div>
              <p className="retro-heading text-2xl text-amber-glow">{visitStats.uniqueVisitors}</p>
              <p className="font-body text-xs text-paper/50">Unique Visitors</p>
            </div>
            <div>
              <p className="retro-heading text-2xl text-amber-glow">{visitStats.last24h}</p>
              <p className="font-body text-xs text-paper/50">Last 24h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
