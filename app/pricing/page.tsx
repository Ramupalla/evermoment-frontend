// import Button from '@/components/Button';

// export default function PricingPage() {
//   const pricingTiers = [
//     {
//       key: "story",
//       name: "Story / Status",
//       price: "₹149",
//       description: "Perfect for short stories, status updates, and quick moments.",
//       features: [
//         "Usually delivered within 24–48 hours",
//         "Final video up to 1 minute",
//         "Clean cuts & smooth flow",
//         "Smooth transitions",
//         "Basic color correction",
//         "HD quality (1080p)",
//         "One final expor"
//       ],
//       icon: "🎬",
//       popular: false,
//       fastTrack: true
//     },
//     {
//       key: "basic",
//       name: "Beautiful Moments",
//       price: "₹399",
//       description: "Ideal for birthdays, trips, and beautiful celebrations.",
//       features: [
//         "Estimated delivery within 4–5 days",
//         "Final video up to 3 minutes",
//         "Enhanced color correction",
//         "Smooth transitions",
//         "Carefully selected background music",
//         "HD quality (1080p)",
//         "Minor refinements if needed"
//       ],
//       icon: "✨",
//       popular: true
//     },
//     {
//       key: "premium",
//       name: "Premium Moments",
//       price: "₹799",
//       description: "For full memories that deserve time and emotion.",
//       features: [
//         "Estimated delivery within 5–7 days with extra care",
//         "Final video up to 10 minutes",
//         "AI-assisted visual enhancement",
//         "Clean cinematic color grading",
//         "Cinematic transitions",
//         "Visual & sound effects",
//         "Emotion-matched music syncing",
//         "High-quality export (up to 4K where suitable)",
//         "Thoughtful refinements if needed"
//       ],
//       icon: "💙",
//       popular: false
//     }
//   ];

//   return (
//     <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-soft-white to-white min-h-screen">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-4">
//             Simple pricing for priceless memories
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Choose the package that fits your moment. Every tier includes our care and attention to detail.
//           </p>
//         </div>

//         {/* PRICING CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
//           {pricingTiers.map((tier) => (
//             <div
//               key={tier.key}
//               className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
//                 tier.popular ? "ring-4 ring-gold" : ""
//               }`}
//             >
//               {tier.popular && (
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-charcoal px-6 py-1 rounded-full text-sm font-bold">
//                   Most Popular
//                 </div>
//               )}

//               <div className="text-center mb-6">
//                 <div className="text-5xl mb-4">{tier.icon}</div>
//                 <h2 className="text-2xl font-bold text-charcoal mb-2">
//                   {tier.name}
//                 </h2>
//                 <p className="text-gray-600 text-sm mb-4">
//                   {tier.description}
//                 </p>
//                 <div className="text-4xl font-bold text-charcoal mb-1">
//                   {tier.price}
//                 </div>
//                 <p className="text-sm text-gray-500">per memory</p>
//               </div>

//               <ul className="space-y-3 mb-8">
//                 {tier.features.map((feature, idx) => (
//                   <li key={idx} className="flex items-start gap-3 text-gray-700">
//                     <span className="text-gold text-lg mt-0.5">✓</span>
//                     <span className="text-sm">{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               {/* ⚡ FAST TRACK NOTE */}
//               {tier.fastTrack && (
//                 <div className="mb-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-charcoal">
//                   <div className="flex items-start gap-2">
//                     <span className="text-lg">⚡</span>
//                     <div>
//                       <p className="font-medium">
//                         Fast-track delivery available
//                       </p>
//                       <p className="text-xs text-gray-600 mt-1">
//                         Add-on available in the next step (+₹99, subject to availability).
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ✅ FIXED BUTTON */}
//               <Button
//                 href={`/create?plan=${tier.key}`}
//                 variant={tier.popular ? "primary" : "outline"}
//                 size="md"
//                 className="w-full"
//               >
//                 Get Started
//               </Button>
//             </div>
//           ))}
//         </div>

//         {/* FOOTER CTA */}
//         <div className="mt-16 bg-charcoal rounded-2xl p-8 sm:p-12 text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-soft-white mb-4">
//             Not sure which package to choose?
//           </h2>
//           <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
//             We&apos;re here to help you find the perfect fit for your moment.
//           </p>
//           <Button href="/contact" variant="secondary" size="md">
//             Talk to Us
//           </Button>
//         </div>

//       </div>
//     </div>
//   );
// }

// -------------------Actual pricing above--------------------


import Button from "@/components/Button";

export default function PricingPage() {
  const pricingTiers = [
    {
      key: "story",
      name: "Story / Status",
      originalPrice: 149,
      offerPrice: 75,
      description: "Perfect for short stories, status updates, and quick moments.",
      features: [
        "Usually delivered within 24–48 hours",
        "Final video up to 1 minute",
        "Clean cuts & smooth flow",
        "Smooth transitions",
        "Basic color correction",
        "HD quality (1080p)",
        "One final export",
      ],
      icon: "🎬",
      popular: false,
      fastTrack: true,
    },
    {
      key: "basic",
      name: "Beautiful Moments",
      originalPrice: 399,
      offerPrice: 199,
      description: "Ideal for birthdays, trips, and beautiful celebrations.",
      features: [
        "Estimated delivery within 4–5 days",
        "Final video up to 3 minutes",
        "Enhanced color correction",
        "Smooth transitions",
        "Carefully selected background music",
        "HD quality (1080p)",
        "Minor refinements if needed",
      ],
      icon: "✨",
      popular: true,
    },
    {
      key: "premium",
      name: "Premium Moments",
      originalPrice: 799,
      offerPrice: 399,
      description: "For full memories that deserve time and emotion.",
      features: [
        "Estimated delivery within 5–7 days with extra care",
        "Final video up to 10 minutes",
        "AI-assisted visual enhancement",
        "Clean cinematic color grading",
        "Cinematic transitions",
        "Visual & sound effects",
        "Emotion-matched music syncing",
        "High-quality export (up to 4K where suitable)",
        "Thoughtful refinements if needed",
      ],
      icon: "💙",
      popular: false,
    },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-soft-white to-white min-h-screen">
      <div className="max-w-7xl mx-auto">

{/* 🎉 OFFER BANNER */}
{/* <div className="mb-20 rounded-2xl bg-gradient-to-r from-green-200 via-green-100 to-green-200 px-6 py-8 sm:py-10 text-center shadow-lg">
  <div className="flex flex-col items-center gap-2">
    <div className="text-3xl sm:text-4xl">🎉</div>

    <p className="text-xl sm:text-2xl font-bold text-green-900">
      Limited Time Launch Offer
    </p>

    <p className="text-3xl sm:text-4xl font-extrabold text-green-800">
      Flat <span className="text-green-900">50% OFF</span> on all plans
    </p>

    <p className="text-sm sm:text-base text-green-700 mt-1">
      Celebrate your moments at half the price — for a limited time only ✨
    </p>
  </div>
</div> */}

{/* 🎉 OFFER BANNER */}
<div className="mb-20 rounded-2xl bg-gradient-to-r from-green-200 via-green-100 to-green-200 px-6 py-8 sm:py-10 text-center shadow-lg">
  <div className="flex flex-col items-center gap-2">
    <div className="text-3xl sm:text-4xl">🎉</div>

    <p className="text-xl sm:text-2xl font-bold text-green-900">
      Limited Time Launch Offer
    </p>

    <p className="text-3xl sm:text-4xl font-extrabold text-green-800">
      Flat <span className="text-green-900">50% OFF</span> on all plans
    </p>

    {/* ✅ NEW DETAIL */}
    {/* <p className="text-sm sm:text-base font-medium text-green-900">
      on your first <span className="font-semibold">EverMoment</span> 
    </p> */}

    <p className="text-sm sm:text-base text-green-700 mt-1">
      Celebrate your moments at half the price — limited time only✨
    </p>
  </div>
</div>



        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-4">
            Simple pricing for priceless memories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the package that fits your moment. Every tier includes our care and attention to detail.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {pricingTiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                tier.popular ? "ring-4 ring-gold" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-charcoal px-6 py-1 rounded-full text-sm font-bold">
                  Most Popular ⭐
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{tier.icon}</div>
                <h2 className="text-2xl font-bold text-charcoal mb-2">
                  {tier.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {tier.description}
                </p>

                {/* 💰 PRICE DISPLAY */}
                <div className="mb-1">
                  <span className="text-sm text-gray-400 line-through">
                    ₹{tier.originalPrice}
                  </span>
                </div>
                <div className="text-4xl font-bold text-charcoal">
                  ₹{tier.offerPrice}
                </div>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  50% OFF
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="text-gold text-lg mt-0.5">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* ⚡ FAST TRACK NOTE */}
              {tier.fastTrack && (
                <div className="mb-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-charcoal">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                      <p className="font-medium">
                        Fast-track delivery available
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Add-on available in the next step (+₹99, subject to availability).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                href={`/create?plan=${tier.key}`}
                variant={tier.popular ? "primary" : "outline"}
                size="md"
                className="w-full"
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        {/* FOOTER CTA */}
        <div className="mt-16 bg-charcoal rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-soft-white mb-4">
            Not sure which package to choose?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We're here to help you find the perfect fit for your moment.
          </p>
          <Button href="/contact" variant="secondary" size="md">
            Talk to Us
          </Button>
        </div>

      </div>
    </div>
  );
}
