"use client";

export default function OfferBanner() {
  return (
    <section className="w-full bg-gold/90 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-sm sm:text-base font-medium">
            🎉 <span className="font-bold">Flat 50% OFF on all plans</span> 
            <span className="opacity-80"> — limited time launch offer 🔜</span>
          </p>

          <a
            href="/create"
            className="text-sm font-semibold underline underline-offset-4 hover:opacity-80 transition"
          >
            Create your moment →
          </a>
        </div>
      </div>
    </section>
  );
}
