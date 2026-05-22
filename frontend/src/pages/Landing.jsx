import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import DemoChat from '../components/DemoChat';
import Features from '../components/Features';
import TestimonialsMarquee from '../components/TestimonialsMarquee';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import UserWorkflows from '../components/UserWorkflows';
import Lenis from '@studio-freight/lenis';

export default function Landing() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.5 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-navyDark text-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <UserWorkflows />
      <DemoChat />
      <Features />
      <TestimonialsMarquee />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
