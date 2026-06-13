import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Public landing page - the "hero" / first impression of the app
const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero / signature section */}
      <section className="crt-overlay relative overflow-hidden border-2 border-crt-border bg-crt-panel p-8 shadow-retro sm:p-12">
        <div className="relative z-10">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-mint">
            est. today — your story begins here
          </p>
          <h1 className="retro-heading mt-4 text-4xl leading-tight sm:text-6xl">
            Write it down
            <br />
            before it fades.
          </h1>
          <p className="mt-6 max-w-xl font-serif text-lg italic text-paper/80">
            A quiet corner of the internet for your thoughts — moods, memories, and
            small moments, kept safe in amber light.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {user ? (
              <Link to="/dashboard" className="retro-btn">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="retro-btn">
                  Start Writing →
                </Link>
                <Link to="/login" className="retro-btn-outline">
                  I Already Have an Account
                </Link>
              </>
            )}
          </div>

          {/* Blinking cursor for typewriter feel */}
          <div className="mt-10 font-body text-sm text-paper/50">
            <span>C:\RETROLEAF\&gt; ready to write</span>
            <span className="animate-blink">_</span>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          emoji="🔥"
          title="Writing Streaks"
          description="Build a daily journaling habit. Retroleaf tracks your current and longest streaks automatically."
        />
        <FeatureCard
          emoji="🎭"
          title="Mood Tracking"
          description="Tag every entry with how you felt, then view your mood breakdown over time on your dashboard."
        />
        <FeatureCard
          emoji="🔍"
          title="Full-Text Search"
          description="Find any entry instantly by searching titles, content, or tags — no scrolling through months of pages."
        />
        <FeatureCard
          emoji="🎲"
          title="Memory Lane"
          description="Get a random entry from your past pulled up — a little surprise from your former self."
        />
        <FeatureCard
          emoji="⭐"
          title="Favorites & Tags"
          description="Star your favorite entries and organize everything with custom tags for quick filtering."
        />
        <FeatureCard
          emoji="🎨"
          title="Theme Picker"
          description="Choose from retro color themes — amber, mint, purple, and blue — to match your vibe."
        />
      </section>
    </div>
  );
};

// Small reusable feature card
const FeatureCard = ({ emoji, title, description }) => (
  <div className="retro-panel rounded-xl p-6 transition-transform duration-150 hover:-translate-y-1">
    <span className="text-3xl">{emoji}</span>
    <h3 className="retro-heading mt-3 text-lg">{title}</h3>
    <p className="mt-2 font-serif text-sm text-paper/70">{description}</p>
  </div>
);

export default Landing;
