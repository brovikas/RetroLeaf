import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api.js";

const moods = ["happy", "sad", "neutral", "excited", "anxious", "grateful", "tired"];
const moodEmojis = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
  tired: "😴",
};

// Used both for creating a new entry and editing an existing one
const EntryEditor = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [tagsInput, setTagsInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [weather, setWeather] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  // Load existing entry data if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchEntry = async () => {
      try {
        const { data } = await API.get(`/entries/${id}`);
        setTitle(data.title);
        setContent(data.content);
        setMood(data.mood);
        setTagsInput(data.tags.join(", "));
        setIsPrivate(data.isPrivate);
        setWeather(data.weather || "");
      } catch (err) {
        setError("Failed to load entry.");
      } finally {
        setFetching(false);
      }
    };

    fetchEntry();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = { title, content, mood, tags, isPrivate, weather };

    try {
      if (isEditMode) {
        await API.put(`/entries/${id}`, payload);
        navigate(`/entry/${id}`);
      } else {
        const { data } = await API.post("/entries", payload);
        navigate(`/entry/${data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save entry.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="animate-flicker font-body text-paper/60">Loading entry...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="retro-heading text-3xl">
        {isEditMode ? "Edit Entry" : "New Journal Entry"}
      </h1>
      <p className="mt-1 font-serif text-sm text-paper/60">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {error && (
        <div className="mt-4 border-2 border-red-700 bg-red-900/30 px-4 py-2 font-body text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block font-body text-sm text-paper/70">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="retro-input"
            placeholder="A title for today's entry"
          />
        </div>

        <div>
          <label className="mb-1 block font-body text-sm text-paper/70">
            How are you feeling?
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMood(m)}
                className={
                  mood === m
                    ? "retro-btn text-sm capitalize"
                    : "retro-btn-outline text-sm capitalize"
                }
              >
                {moodEmojis[m]} {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block font-body text-sm text-paper/70">Entry</label>
          <textarea
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="retro-input resize-y font-serif"
            placeholder="Dear journal..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-body text-sm text-paper/70">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="retro-input"
              placeholder="travel, work, family"
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-sm text-paper/70">
              Weather (optional)
            </label>
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="retro-input"
              placeholder="Rainy, Sunny, Cold..."
            />
          </div>
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-paper/70">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 accent-amber"
          />
          Keep this entry private
        </label>

        <div className="mt-2 flex gap-3">
          <button type="submit" disabled={loading} className="retro-btn disabled:opacity-60">
            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Save Entry"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="retro-btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryEditor;
