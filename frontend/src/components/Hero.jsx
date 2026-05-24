import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// The looping preview cycles through three phases: user message, agent reply
// with a card, then a beat before it resets — selling the live feel.
const SCRIPT = {
  user: "I'm in Lekki with 3 friends, budget ₦15k total, want good vibes 🎉",
  agent:
    "Cova Restaurant is the move — rooftop seating, lively crowd, and it comfortably fits four within your budget. Book the terrace.",
  card: {
    name: "Cova Restaurant & Lounge",
    category: "Continental · Rooftop",
    price: "₦₦₦",
    rating: 4.6,
  },
};

function useLoopPhase() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const delays = [600, 1600, 1400, 1800];
    const t = setTimeout(
      () => setPhase((p) => (p + 1) % 4),
      delays[phase]
    );
    return () => clearTimeout(t);
  }, [phase]);
  return phase;
}

export default function Hero() {
  const phase = useLoopPhase();

  return (
    <section className="relative overflow-hidden bg-navy pt-28 pb-20">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-green/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-navy-line bg-navy-soft px-4 py-1.5 text-xs font-medium text-gold"
          >
            🇳🇬 Built for the way Nigerians actually eat
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.1] text-cream sm:text-5xl lg:text-6xl"
          >
            Tell Us What You're Feeling.{" "}
            <span className="text-gold">We'll Tell You Where To Eat.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-blue-gray"
          >
            ChopSense is a conversational food recommendation agent built for
            Nigeria. Describe your situation — your mood, your budget, who you're
            with — and get a specific, explained, culturally-aware recommendation
            in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/signup" className="btn-gold">
              Try It Now
            </Link>
            <a href="#how-it-works" className="btn-outline">
              See How It Works
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="card-base min-h-[360px] space-y-4 bg-navy-soft/80">
            <div className="flex items-center gap-2 border-b border-navy-line pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green" />
              <span className="text-xs text-blue-gray">ChopSense · live</span>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gold px-4 py-2.5 text-sm font-medium text-navy">
                {SCRIPT.user}
              </div>
            </div>

            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-green/15 px-4 py-2.5 text-sm text-cream ring-1 ring-green/30">
                    {SCRIPT.agent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-navy-line bg-navy p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-cream">{SCRIPT.card.name}</p>
                      <p className="text-xs text-blue-gray">{SCRIPT.card.category}</p>
                    </div>
                    <motion.div
                      key={phase}
                      initial={{ y: -18, opacity: 0, scale: 0.6 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy"
                    >
                      <MapPin size={16} />
                    </motion.div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-navy-soft px-2 py-1 text-blue-gray">
                      {SCRIPT.card.price}
                    </span>
                    <span className="flex items-center gap-1 text-gold">
                      <Star size={12} fill="currentColor" /> {SCRIPT.card.rating}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
