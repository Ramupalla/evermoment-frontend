import Button from '../Button';

export default function FinalCTA() {
  return (
    // <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-charcoal to-gray-800">
    // <section className="section-fade section-fade-dark bg-[#0b1c2d] py-28">
    <section className="section-fade section-fade-dark bg-[#0b1c2d] py-28">


      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-soft-white mb-6">
          Ready to create something beautiful?
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
          Let&apos;s turn your moments into memories that last forever.
        </p>
        {/* <Button href="/create" size="lg" variant="secondary">
          Make This Moment Forever
        </Button> */}

        <Button
          href="/create"
          size="lg"
          variant="secondary"
          
          className="glow-button font-extrabold px-10 py-4 text-lg"
        >
          Make This Moment Forever
      </Button>
      </div>
    </section>
  );
}
