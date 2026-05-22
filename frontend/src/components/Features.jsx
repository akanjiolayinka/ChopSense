import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, MapPin, Sparkles, Flame } from 'lucide-react';

const FEATURES = [
  {
    icon: UtensilsCrossed,
    title: "Recipe Generation",
    description: "Get detailed Nigerian recipes with ingredients, measurements, and cooking instructions tailored to your preferences."
  },
  {
    icon: MapPin,
    title: "Smart Location Matching",
    description: "AI-powered restaurant recommendations based on your location, budget, and dietary restrictions."
  },
  {
    icon: Sparkles,
    title: "Dietary Adaptations",
    description: "Intelligent substitutions for vegan, vegetarian, halal, and other dietary needs without losing authentic taste."
  },
  {
    icon: Flame,
    title: "Macro Tracking",
    description: "Track nutritional values for your favorite Nigerian dishes to stay healthy while enjoying great food."
  }
];

export default function Features() {
  return (
    <section className="py-24 px-6 bg-navyDark/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why ChopSense?</h2>
          <p className="text-white/60 text-lg">Features that make us different</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold to-forest flex items-center justify-center mb-6 shadow-lg">
                <feature.icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
