import { Github } from "lucide-react";

import { Logo } from "./Navbar.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-navy-line bg-navy py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-blue-gray">
            Not a search engine. A friend who knows where to eat.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-end">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-gray transition-colors hover:text-cream"
          >
            <Github size={16} /> GitHub
          </a>
          <p className="text-xs text-blue-gray/70">
            Built for the DSN × BCT LLM Agent Challenge
          </p>
        </div>
      </div>
    </footer>
  );
}
