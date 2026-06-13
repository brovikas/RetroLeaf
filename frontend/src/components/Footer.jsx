// Simple retro footer shown across all pages
const Footer = () => {
  return (
    <footer className="border-t-2 border-crt-border bg-crt-panel py-6">
      <div className="mx-auto max-w-5xl px-6 text-center font-body text-xs text-paper/40">
        Retroleaf © {new Date().getFullYear()} — write something true today.
      </div>
    </footer>
  );
};

export default Footer;
