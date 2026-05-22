import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, ChefHat, Sparkles, Clock, CheckCircle } from 'lucide-react';

const WORKFLOWS = [
  {
    user: "Tunde",
    scenario: "Cold-Start User",
    steps: [
      { icon: User, title: "First Time in Lagos", description: "Tunde just moved to Lagos and has no idea where to eat." },
      { icon: MapPin, title: "Shares Location & Budget", description: "He tells ChopSense he's in Yaba, wants something cheap, and is alone." },
      { icon: ChefHat, title: "Gets Personalized Recommendation", description: "ChopSense recommends White House Buka - authentic amala at ₦500." },
      { icon: Sparkles, title: "Discovers Hidden Gem", description: "Tunde finds his new favorite spot and becomes a regular!" }
    ],
    budget: "₦500",
    outcome: "Found his go-to amala spot"
  },
  {
    user: "Adaeze",
    scenario: "Returning User",
    steps: [
      { icon: User, title: "Regular User", description: "Adaeze uses ChopSense weekly and the AI remembers her preferences." },
      { icon: MapPin, title: "Date Night Request", description: "She asks for a romantic spot in VI with a budget of ₦15,000." },
      { icon: ChefHat, title: "Context-Aware Suggestion", description: "ChopSense suggests RSVP Lagos - perfect for dates, within budget." },
      { icon: Clock, title: "Time-Saving Directions", description: "She gets directions and travel time, making planning easy." }
    ],
    budget: "₦15,000",
    outcome: "Impressed her date with the perfect spot"
  },
  {
    user: "Chukwuemeka",
    scenario: "Power User",
    steps: [
      { icon: User, title: "Multi-Turn Conversation", description: "Chukwuemeka engages in a detailed conversation about his cravings." },
      { icon: MapPin, title: "Specific Requirements", description: "He wants correct suya, not too spicy, with cold drinks, in Lekki." },
      { icon: ChefHat, title: "Tailored Recommendations", description: "ChopSense filters options and finds the perfect suya spot with his preferences." },
      { icon: CheckCircle, title: "Satisfaction Guaranteed", description: "He gets exactly what he wanted, every single time." }
    ],
    budget: "₦3,000",
    outcome: "Never disappointed with recommendations"
  }
];

export default function UserWorkflows() {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  return (
    <section className="py-24 px-6 bg-navyDark/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Real-Life User Workflows</h2>
          <p className="text-white/60 text-lg">See how ChopSense helps real people in Lagos</p>
        </motion.div>

        {/* Workflow Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {WORKFLOWS.map((workflow, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveWorkflow(idx)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeWorkflow === idx
                  ? "bg-gold text-navy shadow-[0_0_20px_rgba(212,162,76,0.3)]"
                  : "bg-white/5 border border-white/20 text-white/60 hover:border-gold/30 hover:text-white"
              }`}
            >
              {workflow.user}
            </motion.button>
          ))}
        </div>

        {/* Workflow Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWorkflow}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navy text-2xl font-bold shrink-0">
                {WORKFLOWS[activeWorkflow].user[0]}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{WORKFLOWS[activeWorkflow].scenario}</h3>
                <p className="text-white/60">{WORKFLOWS[activeWorkflow].user}'s journey with ChopSense</p>
              </div>
            </div>

            <div className="space-y-6">
              {WORKFLOWS[activeWorkflow].steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-forest to-emerald-400 flex items-center justify-center text-white shrink-0">
                    <step.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                    <p className="text-white/70">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-sm text-white/60">Budget:</span>
                <span className="ml-2 font-bold text-gold">{WORKFLOWS[activeWorkflow].budget}</span>
              </div>
              <div className="text-sm text-white/60">
                <span className="font-semibold text-forest">Result:</span> {WORKFLOWS[activeWorkflow].outcome}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
