import { motion } from "framer-motion";
import { Bookmark, MapPin, Star } from "lucide-react";
import { useState } from "react";

// Renders one recommendation. `index` drives the number shown on the matching
// map pin so the chat card and the pin read as the same thing.
export default function RestaurantCard({ restaurant, index, onViewMap }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className="rounded-xl border border-navy-line bg-navy p-4"
    >
      <div className="flex gap-3">
        <div
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-lg font-display text-lg font-bold text-navy"
          style={{ backgroundColor: restaurant.image_placeholder_color }}
        >
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold leading-tight text-cream">{restaurant.name}</p>
            <button
              onClick={() => setSaved((v) => !v)}
              className={`shrink-0 transition-colors ${
                saved ? "text-gold" : "text-blue-gray hover:text-cream"
              }`}
              aria-label="Save restaurant"
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-navy-soft px-2 py-0.5 text-blue-gray">
              {restaurant.category}
            </span>
            <span className="text-gold">{restaurant.price_range}</span>
            <span className="flex items-center gap-1 text-gold">
              <Star size={11} fill="currentColor" /> {restaurant.rating}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-cream/90">
        <span className="text-green">Picked because: </span>
        {restaurant.one_line_reason}
      </p>

      <button
        onClick={() => onViewMap?.(restaurant.id)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:underline"
      >
        <MapPin size={13} /> View on map
      </button>
    </motion.div>
  );
}
