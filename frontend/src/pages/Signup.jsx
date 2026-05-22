import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup:', formData);
  };

  return (
    <div className="min-h-screen bg-navyDark text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navy">
              <ChefHat size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-tight text-2xl">ChopSense</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-white/60">Start discovering Lagos food today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-navy border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-navy border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-navy border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-navy border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 rounded-xl bg-gold text-navy font-bold hover:bg-gold/90 transition-all shadow-[0_0_20px_rgba(212,162,76,0.3)] flex items-center justify-center gap-2"
            >
              Create Account
              <ArrowRight size={20} />
            </motion.button>
          </form>

          <p className="text-center text-white/60 mt-6">
            Already have an account?{' '}
            <Link to="/dashboard" className="text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
