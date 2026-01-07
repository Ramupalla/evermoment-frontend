"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function WhyEverMoment() {
  const revealRef = useScrollReveal();
  const features = [
    {
      title: 'Made for real memories',
      description: 'Birthdays, anniversaries, travel, family moments — the moments that matter to you.',
      icon: '🎉'
    },
    {
      title: 'No editing skills needed',
      description: 'Just upload your videos and place the order. We handle everything else with care and attention.',
      icon: '✨'
    },
    {
      title: 'Crafted with care',
      description: 'Professional editing combined with gentle AI enhancement for that perfect touch.',
      icon: '❤️'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 
        ref={revealRef}
        className="reveal-on-scroll text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal text-center mb-12" 
        // style={{ animationDelay: "0.15s" }}
        >
          Why EverMoment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-soft-white  rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-120"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-charcoal mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
