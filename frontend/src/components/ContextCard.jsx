import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// Collapsible card showing the context the agent has "parsed" from the
// conversation so far. Updates each time a new message is processed.
export default function ContextCard({ context }) {
  const [open, setOpen] = useState(true);

  const rows = context
    ? [
        { icon: "📍", label: "Area", value: context.area },
        { icon: "👥", label: "Group", value: context.group },
        { icon: "💰", label: "Budget", value: context.budget },
        { icon: "🎯", label: "Occasion", value: context.occasion },
      ]
    : [];

  return (
    <div className="rounded-xl border border-navy-line bg-navy-soft">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-medium text-cream">Conversation context</span>
        <ChevronDown
          size={16}
          className={`text-blue-gray transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              {context ? (
                rows.map((r) => (
                  <div
                    key={r.label}
                    className="rounded-lg border border-navy-line bg-navy px-3 py-2"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-blue-gray">
                      {r.icon} {r.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-cream">
                      {r.value}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-2 py-2 text-sm text-blue-gray">
                  Tell me what you're looking for and I'll start reading the room.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
