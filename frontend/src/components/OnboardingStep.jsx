import { motion } from "framer-motion";

// Generic animated wrapper for a single onboarding step. Keeps the slide
// transition and card chrome consistent across all four steps.
export default function OnboardingStep({ eyebrow, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="w-full max-w-xl"
    >
      <div className="card-base">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-display text-2xl font-bold text-cream sm:text-3xl">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </motion.div>
  );
}
