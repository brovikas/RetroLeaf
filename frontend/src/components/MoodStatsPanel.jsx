const moodEmojis = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
  tired: "😴",
};

// Displays a simple bar breakdown of mood counts
const MoodStatsPanel = ({ moodBreakdown = [], totalEntries = 0 }) => {
  return (
    <div className="retro-panel p-5">
      <p className="font-body text-xs uppercase tracking-widest text-paper/50">
        Mood Breakdown
      </p>

      {moodBreakdown.length === 0 ? (
        <p className="mt-3 font-serif text-sm text-paper/60">
          No entries yet — your moods will show up here.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {moodBreakdown.map((m) => {
            const percent = totalEntries ? Math.round((m.count / totalEntries) * 100) : 0;
            return (
              <div key={m._id} className="flex items-center gap-2">
                <span className="w-6 text-center">{moodEmojis[m._id] || "📝"}</span>
                <div className="h-3 flex-1 border border-crt-border bg-crt-bg">
                  <div
                    className="h-full bg-mint"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-right font-body text-xs text-paper/60">
                  {m.count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MoodStatsPanel;
