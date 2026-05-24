import { AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Logo } from "../components/Navbar.jsx";
import OnboardingStep from "../components/OnboardingStep.jsx";
import {
  onboardingAreas,
  onboardingCuisines,
  onboardingPriorities,
} from "../data/mockData.js";
import { useAuth } from "../hooks/useAuth.js";

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [area, setArea] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [priorities, setPriorities] = useState([]); // ordered list of labels
  const navigate = useNavigate();
  const { savePrefs } = useAuth();

  const toggleCuisine = (c) =>
    setCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const togglePriority = (p) =>
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  const finish = () => {
    savePrefs({ area, cuisines, priorities });
    navigate("/app");
  };

  const canAdvance =
    (step === 0 && area) ||
    (step === 1 && cuisines.length > 0) ||
    (step === 2 && priorities.length === onboardingPriorities.length) ||
    step === 3;

  return (
    <div className="flex min-h-screen flex-col bg-navy px-5 py-8">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="text-sm text-blue-gray">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-gold" : "bg-navy-line"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <OnboardingStep
              key="step0"
              eyebrow="Where are you based?"
              title="First, where in Lagos are you usually eating?"
            >
              <div className="flex flex-wrap gap-3">
                {onboardingAreas.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className={`pill ${area === a ? "pill-active" : ""}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </OnboardingStep>
          )}

          {step === 1 && (
            <OnboardingStep
              key="step1"
              eyebrow="What do you like?"
              title="What kind of food gets you excited?"
            >
              <div className="flex flex-wrap gap-3">
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
              <p className="mt-4 text-xs text-blue-gray">Pick as many as you like.</p>
            </OnboardingStep>
          )}

          {step === 2 && (
            <OnboardingStep
              key="step2"
              eyebrow="How do you roll?"
              title="What matters most to you when eating out?"
            >
              <p className="mb-4 text-xs text-blue-gray">
                Tap in order of importance — most important first.
              </p>
              <div className="space-y-3">
                {onboardingPriorities.map((p) => {
                  const rank = priorities.indexOf(p);
                  const ranked = rank !== -1;
                  return (
                    <button
                      key={p}
                      onClick={() => togglePriority(p)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                        ranked
                          ? "border-gold bg-gold/10 text-cream"
                          : "border-navy-line bg-navy text-blue-gray hover:border-gold/50"
                      }`}
                    >
                      <span>{p}</span>
                      {ranked && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
                          {rank + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </OnboardingStep>
          )}

          {step === 3 && (
            <OnboardingStep
              key="step3"
              eyebrow="You're all set"
              title="Here's what I've got on you."
            >
              <div className="space-y-4">
                <SummaryRow label="📍 Home area" value={area || "—"} />
                <SummaryRow
                  label="🍽️ Favourite cuisines"
                  value={cuisines.length ? cuisines.join(", ") : "—"}
                />
                <div>
                  <p className="text-xs uppercase tracking-wide text-blue-gray">
                    🎯 Priorities
                  </p>
                  <ol className="mt-2 space-y-1.5">
                    {priorities.map((p, i) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-cream">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-green/40 bg-green/10 px-4 py-3 text-sm text-cream">
                  <Check size={16} className="text-green" />
                  Profile ready. Your recommendations will be tuned to this.
                </div>
              </div>
            </OnboardingStep>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto flex w-full max-w-xl items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-blue-gray transition-colors hover:text-cream disabled:opacity-0"
        >
          Back
        </button>

        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="btn-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button onClick={finish} className="btn-gold">
            Start Exploring
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-blue-gray">{label}</p>
      <p className="mt-1 text-sm font-medium text-cream">{value}</p>
    </div>
  );
}
