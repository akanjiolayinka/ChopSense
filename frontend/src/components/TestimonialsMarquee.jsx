import React from 'react';

const TESTIMONIALS = [
  { name: "@tunde_lagos", text: "ChopSense found me the perfect amala spot in Yaba. The AI actually understood what I was craving! 🔥" },
  { name: "@adaeze_foodie", text: "Finally an app that knows Lagos food culture. The dietary adaptations are spot-on!" },
  { name: "@chukwuemeka_eats", text: "Used it for my date night recommendation - RSVP was perfect. 10/10!" },
  { name: "@lagos_foodie", text: "The macro tracker helped me stay on my diet while enjoying correct Nigerian food." },
  { name: "@naija_taste", text: "The AI speaks proper pidgin! It feels like asking a real Lagosian for advice." },
  { name: "@foodie_lagos", text: "Found hidden gems I never knew existed. This app is a game changer!" },
];

export default function TestimonialsMarquee() {
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-24 px-6 bg-navyDark overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">What People Are Saying</h2>
        
        <div className="relative overflow-hidden py-8">
          <div className="flex gap-6 animate-marquee">
            {duplicatedTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <p className="text-white/80 mb-4">"{testimonial.text}"</p>
                <p className="text-gold font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
