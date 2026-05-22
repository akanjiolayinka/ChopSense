import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, MapPin, Sparkles, Flame } from 'lucide-react';

const FEATURES = [
  {
    icon: UtensilsCrossed,
    title: "Recipe Generation",
    description: "Get detailed Nigerian recipes with ingredients, measurements, and cooking instructions tailored to your preferences.",
    color: "from-gold to-orange-500",
    gradient: true
  },
  {
    icon: MapPin,
    title: "Smart Location Matching",
    description: "AI-powered restaurant recommendations based on your location, budget, and dietary restrictions.",
    color: "from-forest to-emerald-400",
    gradient: true
  },
  {
    icon: Sparkles,
    title: "Dietary Adaptations",
    description: "Intelligent substitutions for vegan, vegetarian, halal, and other dietary needs without losing authentic taste.",
    color: "from-blue-400 to-purple-500",
    gradient: true
  },
  {
    icon: Flame,
    title: "Macro Tracking",
    description: "Track nutritional values for your favorite Nigerian dishes to stay healthy while enjoying great food.",
    color: "from-purple-500 to-pink-500",
    gradient: true
  }
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-navy via-navyDark to-navy relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-forest/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gold via-white to-forest bg-clip-text text-transparent">Why ChopSense?</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Features that make us the go-to food intelligence for Lagos</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 overflow-hidden transition-all cursor-pointer"
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl transition-all transform group-hover:scale-110`}>
                <feature.icon size={32} className="text-white" strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">{feature.description}</p>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
