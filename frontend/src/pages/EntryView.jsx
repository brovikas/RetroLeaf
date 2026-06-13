import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../utils/api.js";

const moodEmojis = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
  tired: "😴",
};

// Shows the full content of a single journal entry
const EntryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data } = await API.get(`/entries/${id}`);
        setEntry(data);
      } catch (err) {
        setError("Entry not found or you don't have access to it.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const { data } = await API.put(`/entries/${id}`, { isFavorite: !entry.isFavorite });
      setEntry(data);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry permanently? This cannot be undone.")) return;

    try {
      await API.delete(`/entries/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="animate-flicker font-body text-paper/60">Loading entry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="retro-panel p-8 text-center">
          <p className="font-serif text-paper/70">{error}</p>
          <Link to="/dashboard" className="retro-btn mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/dashboard" className="font-body text-sm text-mint hover:underline">
        ← Back to Dashboard
      </Link>

      <div className="retro-panel mt-4 p-8">
        <div className="flex items-start justify-between gap-3">
          <h1 className="retro-heading text-3xl">{entry.title}</h1>
          <span className="text-3xl">{moodEmojis[entry.mood] || "📝"}</span>
        </div>

        <p className="mt-1 font-body text-sm text-paper/50">
          {formattedDate}
          {entry.weather && ` • ${entry.weather}`}
          {entry.isPrivate ? " • 🔒 Private" : " • 🌐 Public"}
        </p>

        <div className="mt-6 whitespace-pre-wrap font-serif text-base leading-relaxed text-paper/90">
          {entry.content}
        </div>

        {entry.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="border border-crt-border px-2 py-0.5 font-body text-xs text-mint"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={toggleFavorite} className="retro-btn-outline text-sm">
            {entry.isFavorite ? "⭐ Unfavorite" : "☆ Favorite"}
          </button>
          <Link to={`/edit/${entry._id}`} className="retro-btn-outline text-sm">
            ✏️ Edit
          </Link>
          <button onClick={handleDelete} className="retro-btn-outline text-sm text-red-400">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryView;
