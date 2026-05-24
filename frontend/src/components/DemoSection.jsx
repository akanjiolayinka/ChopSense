import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Send, Star } from "lucide-react";
import { useRef, useState } from "react";

import { getRestaurant, matchResponseSet } from "../data/mockData";

const STEPS = [
  "Understanding context...",
  "Retrieving restaurants...",
  "Re-ranking...",
  "Reasoning...",
];

export default function DemoSection() {
  const [input, setInput] = useState(
    "I'm in Lekki, group of 4, budget ₦15k, want good vibes"
  );
  const [stage, setStage] = useState("idle"); // idle | thinking | done
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState([]);
  const timers = useRef([]);

  const runDemo = () => {
    if (stage === "thinking" || !input.trim()) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setStage("thinking");
    setStepIndex(0);
    setResults([]);

    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStepIndex(i), i * 500));
    });

    timers.current.push(
      setTimeout(() => {
        const set = matchResponseSet(input);
        setResults(set.restaurantIds.map(getRestaurant).filter(Boolean));
        setStage("done");
      }, 2000)
    );
  };

  return (
    <section id="demo" className="scroll-mt-16 bg-navy py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-center font-display text-3xl font-bold text-cream sm:text-4xl">
          See It In Action
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-blue-gray">
          Type a request the way you'd actually say it. Watch the agent reason,
          then recommend.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Input side */}
          <div className="card-base">
            <label className="text-xs uppercase tracking-wide text-blue-gray">
              Your request
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-navy-line bg-navy px-4 py-3 text-cream outline-none transition-colors focus:border-gold"
            />
            <button onClick={runDemo} className="btn-gold mt-4 w-full">
              <Send size={16} /> Send
            </button>

            <div className="mt-6 space-y-2">
              <AnimatePresence>
                {stage === "thinking" &&
                  STEPS.slice(0, stepIndex + 1).map((step) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-sm text-blue-gray"
                    >
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                      {step}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Output side */}
          <div className="card-base min-h-[320px]">
            {stage === "idle" && (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center text-blue-gray">
                <span className="text-4xl">🍽️</span>
                <p className="mt-3 text-sm">
                  Your recommendations will appear here.
                </p>
              </div>
            )}

            {stage === "thinking" && (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                      className="h-2.5 w-2.5 rounded-full bg-gold"
                    />
                  ))}
                </div>
                <p className="text-sm text-blue-gray">ChopSense is thinking...</p>
              </div>
            )}

            {stage === "done" && (
              <div className="space-y-3">
                {results.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex gap-3 rounded-xl border border-navy-line bg-navy p-3"
                  >
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-navy"
                      style={{ backgroundColor: r.image_placeholder_color }}
                    >
                      <MapPin size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-cream">{r.name}</p>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-gold">
                          <Star size={11} fill="currentColor" /> {r.rating}
                        </span>
                      </div>
                      <p className="text-xs text-blue-gray">
                        {r.category} · {r.price_range}
                      </p>
                      <p className="mt-1 text-xs text-green">{r.one_line_reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
