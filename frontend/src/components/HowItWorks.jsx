import { motion } from "framer-motion";

const STAGES = [
  { n: 1, title: "Understand", body: "Parse mood, location, budget, occasion." },
  { n: 2, title: "Retrieve", body: "Find 50 matching restaurants from the database." },
  { n: 3, title: "Re-Rank", body: "Score each one precisely for this specific context." },
  { n: 4, title: "Reason", body: "The AI thinks through which spots fit you right now." },
  { n: 5, title: "Naija-fy", body: "Adapt the response to authentic Nigerian English." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-cream py-20 text-navy">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
          Five Stages. Every One Earns Its Place.
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-5">
          {STAGES.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border border-navy/10 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-gold">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
