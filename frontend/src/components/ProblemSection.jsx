import { motion } from "framer-motion";

const CARDS = [
  {
    title: "Google Maps",
    body: "Closest restaurants by rating. No idea if you're solo or with 8 friends. No idea if it's a work lunch or a birthday.",
    tone: "warm",
  },
  {
    title: "Instagram",
    body: "20 minutes of scrolling food photos. Half the places are closed. The other half are across town.",
    tone: "warm",
  },
  {
    title: "ChopSense",
    body: "You describe your moment. The agent thinks. You get a specific recommendation with a reason why — in under 10 seconds.",
    tone: "green",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-cream py-20 text-navy">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="mx-auto max-w-3xl text-center font-display text-3xl font-bold sm:text-4xl">
          What Happens When You Ask "Where Should I Eat?"
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border p-7 ${
                card.tone === "green"
                  ? "border-green/40 bg-green/10 shadow-green-glow"
                  : "border-orange-200 bg-gradient-to-b from-orange-50 to-red-50"
              }`}
            >
              <h3
                className={`text-lg font-bold ${
                  card.tone === "green" ? "text-green" : "text-red-500"
                }`}
              >
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/70">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
