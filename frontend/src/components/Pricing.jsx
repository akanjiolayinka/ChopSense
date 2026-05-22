import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: "Apprentice",
    price: "Free",
    period: "forever",
    features: [
      "Basic restaurant recommendations",
      "5 AI conversations per day",
      "Standard map view",
      "Basic dietary filters"
    ]
  },
  {
    name: "ChopLife Pro",
    price: "₦2,500",
    period: "per month",
    features: [
      "Unlimited AI conversations",
      "Advanced recipe generation",
      "Macro tracking",
      "Premium dietary adaptations",
      "Priority support",
      "Exclusive restaurant deals"
    ]
  }
];

export default function Pricing() {
  return (
    <section className="py-24 px-6 bg-navyDark/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-white/60 text-lg">Start free, upgrade when you're ready</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl p-8 border ${
                plan.name === "ChopLife Pro"
                  ? "bg-gradient-to-br from-gold/20 to-forest/20 border-gold/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.name === "ChopLife Pro" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-navy text-sm font-bold rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-white/60">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-3 text-white/80">
                    <Check size={18} className="text-gold flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.name === "ChopLife Pro"
                    ? "bg-gold text-navy hover:bg-gold/90"
                    : "border-2 border-white/20 hover:bg-white/5"
                }`}
              >
                {plan.name === "Apprentice" ? "Get Started Free" : "Upgrade to Pro"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
