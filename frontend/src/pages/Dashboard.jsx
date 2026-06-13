import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api.js";
import EntryCard from "../components/EntryCard.jsx";
import StreakWidget from "../components/StreakWidget.jsx";
import MoodStatsPanel from "../components/MoodStatsPanel.jsx";

const moodOptions = ["", "happy", "sad", "neutral", "excited", "anxious", "grateful", "tired"];

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [mood, setMood] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [randomEntry, setRandomEntry] = useState(null);

  // Fetch entries whenever filters/page change
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (search) params.search = search;
      if (mood) params.mood = mood;
      if (favoriteOnly) params.favorite = "true";

      const { data } = await API.get("/entries", { params });
      setEntries(data.entries);
      setPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, mood, favoriteOnly]);

  // Fetch dashboard stats once
  const fetchStats = async () => {
    try {
      const { data } = await API.get("/entries/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    fetchStats();
  }, []);

  // "Memory Lane" - pull a random past entry
  const handleRandomEntry = async () => {
    try {
      const { data } = await API.get("/entries/random");
      setRandomEntry(data);
    } catch (error) {
      setRandomEntry({ error: "No entries yet — write your first one!" });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="retro-heading text-3xl">Your Journal</h1>
        <Link to="/new" className="retro-btn">
          + New Entry
        </Link>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StreakWidget streak={stats.streak} />
          <MoodStatsPanel moodBreakdown={stats.moodBreakdown} totalEntries={stats.totalEntries} />

          <div className="retro-panel flex flex-col justify-between p-5">
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-paper/50">
                Memory Lane
              </p>
              <p className="mt-2 font-serif text-sm text-paper/60">
                Pull up a random entry from your past.
              </p>
            </div>
            <button onClick={handleRandomEntry} className="retro-btn-outline mt-3 text-sm">
              🎲 Surprise Me
            </button>
          </div>
        </div>
      )}

      {/* Random entry result */}
      {randomEntry && (
        <div className="retro-panel mt-4 p-5">
          {randomEntry.error ? (
            <p className="font-serif text-sm text-paper/70">{randomEntry.error}</p>
          ) : (
            <>
              <p className="font-body text-xs uppercase tracking-widest text-mint">
                From your past...
              </p>
              <Link to={`/entry/${randomEntry._id}`} className="retro-heading mt-1 block text-lg">
                {randomEntry.title}
              </Link>
              <p className="mt-1 font-serif text-sm text-paper/70">
                {randomEntry.content.slice(0, 150)}...
              </p>
            </>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search entries..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="retro-input max-w-xs"
        />

        <select
          value={mood}
          onChange={(e) => {
            setMood(e.target.value);
            setPage(1);
          }}
          className="retro-input max-w-[160px]"
        >
          {moodOptions.map((m) => (
            <option key={m} value={m}>
              {m === "" ? "All moods" : m}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setFavoriteOnly((prev) => !prev);
            setPage(1);
          }}
          className={favoriteOnly ? "retro-btn text-sm" : "retro-btn-outline text-sm"}
        >
          ⭐ Favorites
        </button>
      </div>

      {/* Entries grid */}
      {loading ? (
        <p className="mt-10 animate-flicker font-body text-paper/60">Loading entries...</p>
      ) : entries.length === 0 ? (
        <div className="retro-panel mt-10 p-8 text-center">
          <p className="font-serif text-paper/70">
            No entries found. Start writing your first memory!
          </p>
          <Link to="/new" className="retro-btn mt-4 inline-block">
            Write Now
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry._id} entry={entry} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="retro-btn-outline text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="font-body text-sm text-paper/60">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="retro-btn-outline text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
