import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Logo } from "../components/Navbar.jsx";
import { useToast } from "../components/Toast.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();
  const notify = useToast();
  const { signup } = useAuth();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      notify("Passwords don't match", { tone: "error" });
      return;
    }
    signup(form.fullName, form.email);
    notify("Account created — let's set you up...", { tone: "success" });
    setTimeout(() => navigate("/app/onboarding"), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5 py-12">
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
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-blue-gray">
            Three quick questions after this and you're eating well.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-base space-y-4">
          {[
            { key: "fullName", label: "Full name", type: "text", ph: "Tunde Bakare" },
            { key: "email", label: "Email", type: "email", ph: "you@example.com" },
            { key: "password", label: "Password", type: "password", ph: "••••••••" },
            {
              key: "confirm",
              label: "Confirm password",
              type: "password",
              ph: "••••••••",
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs uppercase tracking-wide text-blue-gray">
                {field.label}
              </label>
              <input
                type={field.type}
                required
                value={form[field.key]}
                onChange={update(field.key)}
                placeholder={field.ph}
                className="mt-1.5 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-cream outline-none transition-colors focus:border-gold"
              />
            </div>
          ))}
          <button type="submit" className="btn-gold w-full">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-gray">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-gold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
