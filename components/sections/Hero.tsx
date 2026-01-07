// import Button from '../Button';

// export default function Hero() {
//   const memoryImages = [
//     '/images/memory1.jpg',
  
//   ];

//   return (
//     // <section className=" hero bg-transparent relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
//       <section className="hero section-fade bg-transparent relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">

//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: "url('/hero-bg.png')",
          
//         }}
// />

// {/* Navy overlay for premium feel */}
// <div className="absolute inset-0 bg-[#0b1c2d]/50 " />

//       {/* Navy overlay with subtle animation */}
//       <div className="absolute inset-0 z-10 bg-[#0b1c2d]/50  animate-slowFade" />

//       {/* Content */}
//       <div className="relative z-20 max-w-7xl mx-auto text-center">
//         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
//           Your moments,<br />beautifully crafted together.
//         </h1>

//         <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
//           Turning Every Moment Into Beautiful Memory💖.
//         </p>

//         <Button href="/create" size="lg" variant="secondary" className="glow-button" style={{ boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)" }}>
//           Create Your EverMoment
//         </Button>
//       </div>
//     </section>
//   );
// }

"use client";


import { useScrollReveal } from "@/lib/useScrollReveal";

import Button from "../Button";

export default function Hero() {
   const revealRef = useScrollReveal();
  return (
    <section className="hero section-fade bg-transparent relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero-bg.png')",
        }}
      />

      {/* Premium navy overlay */}
      <div className="absolute inset-0 bg-[#0b1c2d]/50" />

      {/* Subtle animated overlay */}
      <div className="absolute inset-0 z-10 bg-[#0b1c2d]/50 animate-slowFade" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto text-center">
        <h1 
        ref={revealRef}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        style={{ animationDelay: "0.15s" }}
        >
          Your moments,<br />
          beautifully crafted together.
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          Turning Every Moment Into Beautiful Memory 💖
        </p>

        <Button
          href="/create"
          size="lg"
          variant="secondary"
          
          className="glow-button font-extrabold px-10 py-4 text-lg"
        >
          Create Your EverMoment
        </Button>
      </div>
    </section>
  );
}
