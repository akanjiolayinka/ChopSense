import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-navyDark via-navy to-forestDark" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-forest/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Sparkles size={16} className="text-gold" />
              <span className="text-sm font-medium text-gold">AI-Powered Nigerian Food Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Lagos Food
              <span className="block text-gold">Bestie</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Discover authentic Nigerian restaurants, get personalized recommendations, and never wonder "where should I chop?" again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="px-8 py-4 rounded-full bg-gold text-navy font-bold text-lg hover:bg-gold/90 transition-all shadow-[0_0_30px_rgba(212,162,76,0.4)] flex items-center justify-center gap-2">
                Start for Free
                <ArrowRight size={20} />
              </Link>
              <Link to="/dashboard" className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center">
                Try Demo
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Recipe Generator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-forest flex items-center justify-center text-navy">
                  <ChefHat size={24} className="text-navy" />
                </div>
                <div>
                  <div className="text-sm text-white/60">ChopSense AI</div>
                  <div className="font-semibold">Recipe Generator</div>
                </div>
              </div>
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="p-2 rounded-full bg-gold/20 hover:bg-gold/30 transition-colors disabled:opacity-50"
              >
                <motion.div
                  animate={isGenerating ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
                >
                  <Sparkles size={20} className={cn("text-gold", isGenerating && "animate-spin")} />
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
              <div className="p-6 rounded-2xl bg-forest/20 border border-forest/30 mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">{RECIPES[recipeIdx].name}</h3>
                <p className="text-white/70">{RECIPES[recipeIdx].description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gold">~350</div>
                  <div className="text-xs text-white/60">Calories</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-forest">25g</div>
                  <div className="text-xs text-white/60">Protein</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-400">45min</div>
                  <div className="text-xs text-white/60">Prep Time</div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors" onClick={handleRegenerate}>
                <span className="text-sm font-medium text-white/80">
                  {isGenerating ? `Generating ${RECIPES[recipeIdx]} recipe...` : "Recipe Complete! Click to regenerate."}
                </span>
                <Sparkles className={cn("text-gold", isGenerating && "animate-pulse")} size={16} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
