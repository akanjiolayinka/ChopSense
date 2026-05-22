import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-navyDark border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navyDark">
              <ChefHat size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-tight text-xl">ChopSense</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold transition-colors">
              <Github size={20} />
            </a>
            <a href="mailto:hello@chopsense.com" className="text-white/60 hover:text-gold transition-colors">
              <Mail size={20} />
            </a>
          </div>

          <p className="text-white/40 text-sm">© 2024 ChopSense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
