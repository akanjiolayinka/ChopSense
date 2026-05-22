import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-gold/10 to-forest/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Next Great Meal?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of Lagos foodies who are already using ChopSense to discover the best spots in the city.
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gold text-navy font-bold text-lg hover:bg-gold/90 transition-all shadow-[0_0_30px_rgba(212,162,76,0.4)] inline-flex items-center gap-2"
            >
              Start for Free
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
