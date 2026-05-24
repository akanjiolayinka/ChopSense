// Mock authentication + onboarding preferences, persisted to localStorage so
// the profile and personalised recommendations survive a page refresh.

import { useCallback, useEffect, useState } from "react";

const AUTH_KEY = "chopsense.auth";
const PREFS_KEY = "chopsense.prefs";

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private-mode errors in the demo */
  }
}

export function useAuth() {
  const [user, setUser] = useState(() => read(AUTH_KEY));
  const [prefs, setPrefs] = useState(() => read(PREFS_KEY));

  useEffect(() => {
    const sync = () => {
      setUser(read(AUTH_KEY));
      setPrefs(read(PREFS_KEY));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = useCallback((email) => {
    const name = email ? email.split("@")[0] : "Guest";
    const profile = { name, email: email || "guest@chopsense.ng" };
    write(AUTH_KEY, profile);
    setUser(profile);
    return profile;
  }, []);

  const signup = useCallback((fullName, email) => {
    const profile = { name: fullName || "New User", email: email || "" };
    write(AUTH_KEY, profile);
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const savePrefs = useCallback((next) => {
    write(PREFS_KEY, next);
    setPrefs(next);
  }, []);

  return { user, prefs, login, signup, logout, savePrefs };
}

export function getInitials(name) {
  if (!name) return "GU";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
