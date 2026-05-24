import { motion } from "framer-motion";

import RestaurantCard from "./RestaurantCard.jsx";

// One conversation entry. Handles three kinds: user/agent text bubbles, the
// gray reasoning-trace card, and the inline recommendation list.
export default function ChatMessage({ message, onViewMap }) {
  if (message.kind === "recommendations") {
    return (
      <div className="space-y-3">
        {message.restaurants.map((r, i) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            index={i}
            onViewMap={onViewMap}
          />
        ))}
      </div>
    );
  }

  if (message.kind === "trace") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-navy-line bg-navy-soft/60 px-4 py-2.5 text-xs text-blue-gray"
      >
        <span className="mr-2 font-medium text-blue-gray/80">Parsed context</span>
        {message.text}
      </motion.div>
    );
  }

  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-gold font-medium text-navy"
            : "rounded-bl-sm bg-green/15 text-cream ring-1 ring-green/30"
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  );
}
