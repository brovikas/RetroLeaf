// Displays the user's current and longest writing streak
const StreakWidget = ({ streak }) => {
  return (
    <div className="retro-panel p-5">
      <p className="font-body text-xs uppercase tracking-widest text-paper/50">
        Writing Streak
      </p>
      <div className="mt-2 flex items-end gap-2">
        <span className="retro-heading text-4xl text-amber-glow">
          {streak?.current || 0}
        </span>
        <span className="mb-1 font-serif text-sm text-paper/60">
          day{streak?.current === 1 ? "" : "s"} 🔥
        </span>
      </div>
      <p className="mt-2 font-body text-xs text-paper/50">
        Longest streak: {streak?.longest || 0} days
      </p>
    </div>
  );
};

export default StreakWidget;
