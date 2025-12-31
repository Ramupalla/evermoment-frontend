import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">EverMoment</h3>
            <p className="text-gray-300 text-sm">
              Turning every moment into beautiful memory💖.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-gold transition-colors">Home</Link></li>
              <li><Link href="/create" className="text-gray-300 hover:text-gold transition-colors">Create</Link></li>
              <li><Link href="/pricing" className="text-gray-300 hover:text-gold transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-gold transition-colors">Contact</Link></li>
              {/* <li><Link href="/about" className="text-gray-300 hover:text-gold transition-colors">About Us</Link></li> */}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-300 hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-gold transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="text-gray-300 hover:text-gold transition-colors">Refund Policy</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} EverMoment. All rights reserved.</p>
          <p className="mt-2">Made with care 🤍</p>
        </div>

      </div>
    </footer>
  );
}
