import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileSection from "../components/ProfileSection.jsx";
import { useToast } from "../components/Toast.jsx";
import { useAuth } from "../hooks/useAuth.js";

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? "bg-green" : "bg-navy-line"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Row({ title, badge, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-navy-line py-4 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-cream">{title}</span>
        {badge && (
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-gold">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const notify = useToast();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [mapSatellite, setMapSatellite] = useState(false);
  const [voice, setVoice] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-2xl font-bold text-cream">Settings</h1>

        <ProfileSection title="Preferences">
          <Row title="Notifications">
            <Toggle enabled={notifications} onChange={setNotifications} />
          </Row>
          <Row title="Language preference">
            <select
              onChange={() => notify("Coming soon")}
              defaultValue="English"
              className="rounded-lg border border-navy-line bg-navy px-3 py-1.5 text-sm text-cream outline-none focus:border-gold"
            >
              {["English", "Pidgin", "Yoruba", "Igbo", "Hausa"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Row>
          <Row title="Map default: satellite view">
            <Toggle enabled={mapSatellite} onChange={setMapSatellite} />
          </Row>
          <Row title="Voice input" badge="Beta">
            <Toggle enabled={voice} onChange={setVoice} />
          </Row>
          <Row title="Dark mode">
            <Toggle enabled={darkMode} onChange={setDarkMode} />
          </Row>
        </ProfileSection>

        <ProfileSection title="Account">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={handleLogout} className="btn-outline flex-1">
              Log out
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex-1 rounded-full border border-red-500/50 px-6 py-3 font-semibold text-red-400 transition-colors hover:bg-red-500/10"
            >
              Delete account
            </button>
          </div>
        </ProfileSection>
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] flex items-center justify-center bg-black/60 px-5"
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-navy-line bg-navy-soft p-6"
            >
              <h3 className="font-display text-lg font-bold text-cream">
                Delete your account?
              </h3>
              <p className="mt-2 text-sm text-blue-gray">
                This can't be undone. All your preferences and saved spots would be
                lost.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    notify("Demo mode", { tone: "default" });
                  }}
                  className="flex-1 rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
