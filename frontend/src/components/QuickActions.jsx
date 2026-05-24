import { quickActions } from "../data/mockData.js";

// Horizontal scroll of suggestion chips. Tapping one sends it as a message.
export default function QuickActions({ onSend, disabled }) {
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
      {quickActions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSend(action.message)}
          disabled={disabled}
          className="shrink-0 rounded-full border border-navy-line bg-navy-soft px-3.5 py-1.5 text-sm text-blue-gray transition-colors hover:border-gold/60 hover:text-cream disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
