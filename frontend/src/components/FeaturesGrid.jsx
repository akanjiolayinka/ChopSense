import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "🗣️",
    title: "Conversational",
    body: "Just describe what you want in your own words. No filters. No forms. Just talk.",
  },
  {
    icon: "🧠",
    title: "Reasons Before Recommending",
    body: "The agent thinks through your context — occasion, budget, group size, mood — before it speaks.",
  },
  {
    icon: "❄️",
    title: "Cold-Start Ready",
    body: "First time? Three questions is all we need. No account history required.",
  },
  {
    icon: "🔄",
    title: "Remembers Everything",
    body: "Say 'something cheaper' on turn 3. The agent adjusts without forgetting turns 1 and 2.",
  },
  {
    icon: "🇳🇬",
    title: "Built for Nigeria",
    body: "Pidgin when it fits. Lagos neighbourhood awareness. Occasion intelligence — owambe ≠ business lunch.",
  },
  {
    icon: "🗺️",
    title: "Live Map",
    body: "Every recommendation pinned on a live map. See exactly where it is before you go.",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="scroll-mt-16 bg-navy py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-center font-display text-3xl font-bold text-cream sm:text-4xl">
          What ChopSense Can Do
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="card-base group transition-all duration-200 hover:-translate-y-1 hover:border-gold/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-2xl ring-1 ring-navy-line transition-colors group-hover:ring-gold/40">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-cream">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-gray">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
