import { ChevronDown, Star } from "lucide-react";
import { useState } from "react";

import ProfileSection from "../components/ProfileSection.jsx";
import { useToast } from "../components/Toast.jsx";
import {
  getRestaurant,
  onboardingCuisines,
  profileStats,
  recommendationHistory,
  savedRestaurantIds,
} from "../data/mockData.js";
import { getInitials, useAuth } from "../hooks/useAuth.js";

export default function Profile() {
  const { user, prefs, savePrefs } = useAuth();
  const notify = useToast();
  const [openHistory, setOpenHistory] = useState(null);

  const area = prefs?.area || "Lekki";
  const cuisines = prefs?.cuisines?.length ? prefs.cuisines : ["Nigerian", "Continental"];
  const priorities = prefs?.priorities?.length
    ? prefs.priorities
    : ["Great food above everything", "Value for money always"];

  const toggleCuisine = (c) => {
    const next = cuisines.includes(c)
      ? cuisines.filter((x) => x !== c)
      : [...cuisines, c];
    savePrefs({ ...(prefs || {}), area, priorities, cuisines: next });
  };

  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold font-display text-2xl font-bold text-navy">
            {getInitials(user?.name)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cream">
              {user?.name || "Guest User"}
            </h1>
            <p className="text-sm text-blue-gray">Member since May 2026</p>
            <span className="mt-2 inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              📍 {area}
            </span>
          </div>
        </div>

        {/* Taste profile */}
        <ProfileSection
          title="Your Taste Profile"
          action={
            <button
              onClick={() => notify("Demo mode — area change coming soon")}
              className="text-xs font-medium text-gold hover:underline"
            >
              Change area
            </button>
          }
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-gray">Home area</p>
              <p className="mt-1 font-medium text-cream">{area}</p>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-blue-gray">
                Favourite cuisines
              </p>
              <div className="flex flex-wrap gap-2">
                {onboardingCuisines.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`pill ${cuisines.includes(c) ? "pill-active" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-blue-gray">
                Dining priorities
              </p>
              <ol className="space-y-2">
                {priorities.map((p, i) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 rounded-lg border border-navy-line bg-navy px-3 py-2 text-sm text-cream"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ProfileSection>

        {/* History */}
        <ProfileSection title="Recommendation History">
          <div className="space-y-3">
            {recommendationHistory.map((h) => {
              const open = openHistory === h.id;
              return (
                <div
                  key={h.id}
                  className="rounded-xl border border-navy-line bg-navy"
                >
                  <button
                    onClick={() => setOpenHistory(open ? null : h.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <div>
                      <p className="font-medium text-cream">
                        {h.title} —{" "}
                        <span className="text-blue-gray">{h.when}</span>
                      </p>
                      <p className="text-xs text-blue-gray">{h.summary}</p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-blue-gray transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="space-y-2 border-t border-navy-line px-4 py-3">
                      {h.restaurantIds.map(getRestaurant).filter(Boolean).map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-cream">{r.name}</span>
                          <span className="flex items-center gap-1 text-xs text-gold">
                            <Star size={11} fill="currentColor" /> {r.rating}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ProfileSection>

        {/* Saved */}
        <ProfileSection title="Saved Restaurants">
          <div className="grid gap-3 sm:grid-cols-2">
            {savedRestaurantIds.map(getRestaurant).filter(Boolean).map((r) => (
              <div
                key={r.id}
                className="flex gap-3 rounded-xl border border-navy-line bg-navy p-3"
              >
                <div
                  className="h-12 w-12 shrink-0 rounded-lg"
                  style={{ backgroundColor: r.image_placeholder_color }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{r.name}</p>
                  <p className="text-xs text-blue-gray">{r.category}</p>
                  <p className="text-xs text-gold">
                    {r.price_range} · ★ {r.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ProfileSection>

        {/* Stats */}
        <ProfileSection title="Your Stats">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {profileStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-navy-line bg-navy p-4 text-center"
              >
                <p className="font-display text-3xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-xs text-blue-gray">{s.label}</p>
              </div>
            ))}
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}
