import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChefHat, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: MapPin,
    title: "TELL US YOUR MOOD",
    description: "Share what you're craving, your budget, and who you're with. We'll understand the exact context.",
    color: "text-gold",
    borderColor: "border-gold"
  },
  {
    icon: ChefHat,
    title: "AI FINDS YOUR SPOT",
    description: "Our AI analyzes millions of data points against Lagos' best restaurants to find your perfect match instantly.",
    color: "text-forest",
    borderColor: "border-forest"
  },
  {
    icon: Sparkles,
    title: "GET DIRECTIONS & GO",
    description: "Receive detailed directions, estimated travel time, and insider menu tips for your chosen destination.",
    color: "text-white",
    borderColor: "border-white"
  }
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const sections = gsap.utils.toArray(".step-panel");
        
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            end: () => "+=" + (wrapperRef.current.offsetWidth - window.innerWidth),
          }
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="lg:h-screen w-full bg-navy flex flex-col justify-center relative overflow-hidden border-y-4 border-forest/30 py-24 lg:py-0">
      
      {/* Title Area - Fixed position relative to section on desktop */}
      <div className="lg:absolute top-12 md:top-24 left-6 md:left-12 z-20 pointer-events-none mb-12 lg:mb-0 px-6 lg:px-0">
        <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
          HOW CHOPSENSE <span className="text-gold">WORKS</span>
        </h2>
      </div>

      <div className="overflow-hidden w-full h-full flex flex-col lg:flex-row lg:items-center">
        <div ref={wrapperRef} className="flex flex-col lg:flex-row h-full lg:h-[70vh] items-center w-full lg:w-[300vw]">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="step-panel w-full lg:w-screen flex-shrink-0 h-[50vh] lg:h-full flex flex-col justify-center px-6 md:px-24"
            >
              <div className={`border-l-8 ${step.borderColor} pl-8 md:pl-16 relative`}>
                <div className="absolute -left-12 md:-left-20 top-0 opacity-10">
                  <span className="text-[12rem] md:text-[20rem] font-black leading-none">{idx + 1}</span>
                </div>
                <div className={`mb-8 ${step.color}`}>
                  <step.icon size={80} strokeWidth={2.5} />
                </div>
                <h3 className={`text-5xl md:text-7xl font-black mb-6 uppercase ${step.color}`}>{step.title}</h3>
                <p className="text-2xl md:text-4xl text-white/80 font-medium max-w-4xl leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
