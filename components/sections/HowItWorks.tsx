
"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function HowItWorks() {
  const revealRef = useScrollReveal();
  const steps = [
    {
      
      number: '1',
      title: 'Share your video',
      description: 'Upload your raw footage and tell us what makes this moment special to you.',
      icon: '📤'
    },
    {
      number: '2',
      title: 'We craft your memory',
      description: 'Our team combines professional editing with thoughtful AI to create something beautiful.',
      icon: '✨'
    },
    {
      number: '3',
      title: 'Relive it forever',
      description: 'Receive your beautifully edited memory, ready to cherish and share.',
      icon: '💝'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-white section-fade bg-white py-24">
      <div className="max-w-7xl mx-auto">
        <h2
        ref={revealRef} 
        className="reveal-on-scroll text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal text-center mb-12"
        // style={{ animationDelay: "0.15s" }}
        >
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-full text-2xl font-bold text-charcoal mb-6">
                {step.number}
              </div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-charcoal mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-light-grey">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-light-grey rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
