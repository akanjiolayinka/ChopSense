import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Logo } from "../components/Navbar.jsx";
import { useToast } from "../components/Toast.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const notify = useToast();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    notify("Demo mode — redirecting...", { tone: "success" });
    setTimeout(() => navigate("/app"), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link to="/">
            <Logo className="text-2xl" />
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-cream">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-blue-gray">
            Pick up where your cravings left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-base space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-blue-gray">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-cream outline-none transition-colors focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-blue-gray">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-cream outline-none transition-colors focus:border-gold"
            />
          </div>
          <button type="submit" className="btn-gold w-full">
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-gray">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-gold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
