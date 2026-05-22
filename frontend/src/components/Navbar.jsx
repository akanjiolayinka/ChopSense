import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-navyDark/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navyDark shadow-lg">
              <ChefHat size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-tight text-xl">ChopSense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-white/70 hover:text-gold transition-colors">Features</Link>
            <Link to="#how-it-works" className="text-white/70 hover:text-gold transition-colors">How It Works</Link>
            <Link to="#pricing" className="text-white/70 hover:text-gold transition-colors">Pricing</Link>
            <Link to="/signup" className="px-6 py-2.5 rounded-full bg-gold text-navy font-bold hover:bg-gold/90 transition-all shadow-[0_0_20px_rgba(212,162,76,0.3)]">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-4 overflow-hidden"
            >
              <Link to="#features" onClick={() => setIsMobileMenuOpen(false)} className="block text-white/70 hover:text-gold transition-colors py-2">Features</Link>
              <Link to="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block text-white/70 hover:text-gold transition-colors py-2">How It Works</Link>
              <Link to="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-white/70 hover:text-gold transition-colors py-2">Pricing</Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-2.5 rounded-full bg-gold text-navy font-bold text-center mt-4">
                Get Started
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
