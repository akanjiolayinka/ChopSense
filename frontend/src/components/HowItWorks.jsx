import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChefHat, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: MapPin,
    title: "Tell Us Your Mood",
    description: "Share what you're craving, your budget, and who you're with. We'll understand the context.",
    color: "from-gold to-orange-500"
  },
  {
    icon: ChefHat,
    title: "AI Finds Your Spot",
    description: "Our AI analyzes your preferences against Lagos' best restaurants to find your perfect match.",
    color: "from-forest to-emerald-400"
  },
  {
    icon: Sparkles,
    title: "Get Directions & Go",
    description: "Receive detailed directions, estimated travel time, and insider tips for your chosen spot.",
    color: "from-blue-400 to-purple-500"
  }
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const sections = gsap.utils.toArray(".step-card");
        const container = containerRef.current;

        const scrollTween = gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + container.offsetWidth,
          }
        });

        return () => {
          scrollTween.kill();
        };
      });

      return () => mm.revert();
    });

    return ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-navyDark/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How ChopSense Works</h2>
          <p className="text-white/60 text-lg">Three simple steps to your next great meal</p>
        </motion.div>

        <div ref={containerRef} className="flex gap-6 overflow-x-auto pb-8 no-scrollbar">
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="step-card flex-shrink-0 w-80 md:w-96 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                <step.icon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-white/70 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
