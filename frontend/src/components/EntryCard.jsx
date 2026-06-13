import { Link } from "react-router-dom";

// Maps each mood to an emoji for quick visual scanning
const moodEmojis = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
  tired: "😴",
};

// Displays a single journal entry preview in the dashboard list
const EntryCard = ({ entry }) => {
  const formattedDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Strip and truncate content for the preview
  const preview =
    entry.content.length > 140 ? `${entry.content.slice(0, 140)}...` : entry.content;

  return (
    <Link
      to={`/entry/${entry._id}`}
      className="retro-panel rounded-xl block p-5 transition-transform duration-150 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="retro-heading text-lg leading-snug">{entry.title}</h3>
        <span className="text-xl">{moodEmojis[entry.mood] || "📝"}</span>
      </div>

      <p className="mt-2 font-serif text-sm text-paper/70">{preview}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-body text-xs text-paper/50">{formattedDate}</span>

        {entry.isFavorite && <span className="text-sm text-amber-glow">⭐</span>}

        {entry.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="border border-crt-border px-2 py-0.5 font-body text-xs text-mint"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default EntryCard;
