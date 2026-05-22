import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const RECIPES = [
  { name: "Jollof Rice", description: "Party-perfect with smoky undertones" },
  { name: "Beef Suya", description: "Spicy grilled beef with yaji spice" },
  { name: "Vegan Egusi", description: "Melon seed soup with vegetables" },
  { name: "Plantain Frittata", description: "Sweet plantain with eggs" },
  { name: "Pounded Yam", description: "Classic swallow with egusi" },
  { name: "Efo Riro", description: "Spinach stew with assorted meat" }
];

export default function Hero() {
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setRecipeIdx((prev) => (prev + 1) % RECIPES.length);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden bg-navyDark">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy border-2 border-forest text-forest font-bold uppercase tracking-wider mb-8">
              <Sparkles size={18} />
              <span>AI-Powered Nigerian Food Intelligence</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] text-white tracking-tight">
              YOUR LAGOS
              <span className="block text-gold">FOOD BESTIE.</span>
            </h1>
            
            <p className="text-2xl text-white/80 mb-10 leading-snug font-medium max-w-2xl">
              Discover authentic Nigerian restaurants, get personalized recommendations, and never wonder <span className="text-white italic">"where should I chop?"</span> again.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/signup" className="px-8 py-5 bg-gold text-navy font-black text-xl hover:bg-white hover:text-navy transition-colors flex items-center justify-center gap-3">
                START FOR FREE
                <ArrowRight size={24} strokeWidth={3} />
              </Link>
              <Link to="/dashboard" className="px-8 py-5 border-4 border-white text-white font-black text-xl hover:bg-white hover:text-navy transition-colors flex items-center justify-center">
                TRY DEMO
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Recipe Generator */}
          <motion.div
            className="lg:col-span-5 bg-navy border-4 border-forest p-8 md:p-12 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Structural corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-gold -translate-x-2 -translate-y-2"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-gold translate-x-2 -translate-y-2"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-gold -translate-x-2 translate-y-2"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-gold translate-x-2 translate-y-2"></div>

            <div className="flex items-center justify-between mb-8 pb-8 border-b-4 border-forest/50">
              <div className="flex items-center gap-4">
                <ChefHat size={32} className="text-gold" strokeWidth={2.5} />
                <div>
                  <div className="text-sm font-bold text-forest uppercase tracking-widest">ChopSense AI</div>
                  <div className="font-black text-xl text-white">RECIPE GENERATOR</div>
                </div>
              </div>
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="w-14 h-14 bg-forest hover:bg-gold text-white hover:text-navy flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <motion.div
                  animate={isGenerating ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
                >
                  <Sparkles size={24} strokeWidth={2.5} />
                </motion.div>
              </button>
            </div>

            <motion.div
              key={recipeIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-forest/20 p-6 mb-8 border-l-8 border-gold">
                <h3 className="text-3xl font-black text-white mb-2 uppercase">{RECIPES[recipeIdx].name}</h3>
                <p className="text-lg text-white/80 font-medium">{RECIPES[recipeIdx].description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-navyDark p-5 border-2 border-forest text-center hover:border-gold transition-colors">
                  <div className="text-3xl font-black text-white mb-1">~350</div>
                  <div className="text-sm font-bold text-forest uppercase tracking-widest">CALS</div>
                </div>
                <div className="bg-navyDark p-5 border-2 border-forest text-center hover:border-gold transition-colors">
                  <div className="text-3xl font-black text-white mb-1">25g</div>
                  <div className="text-sm font-bold text-forest uppercase tracking-widest">PROT</div>
                </div>
                <div className="bg-navyDark p-5 border-2 border-forest text-center hover:border-gold transition-colors">
                  <div className="text-3xl font-black text-white mb-1">45m</div>
                  <div className="text-sm font-bold text-forest uppercase tracking-widest">TIME</div>
                </div>
              </div>

              <button className="w-full py-5 border-4 border-gold text-gold hover:bg-gold hover:text-navy transition-colors font-black text-xl flex items-center justify-center gap-3">
                <ChefHat size={24} strokeWidth={2.5} />
                VIEW FULL RECIPE
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
