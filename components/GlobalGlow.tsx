export default function GlobalGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden max-w-full">
      <div
        className="
          absolute
          top-32
          left-1/2
          -translate-x-1/2
          w-[120vw]
          max-w-[120vw]
          h-[500px]
          sm:h-[700px]
          rounded-full
          bg-[radial-gradient(circle_at_center,_rgba(30,58,138,0.18),_transparent_60%)]
          blur-[140px]
        "
      />
    </div>
  );
}
