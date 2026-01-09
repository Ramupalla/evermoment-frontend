"use client";

import { useState, FormEvent } from "react";



export default function ContactPage() {

  /* ✅ CENTRALIZED API BASE */
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
}


    const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // const data = await res.json();
      if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to send message");
    }


const data = await res.json();


      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      setForm({ name: "", email: "", orderId: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-soft-white to-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-4">
            We&apos;re here for you
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about your moment or need help with your order?
            We&apos;re just a message away.
          </p>
        </div>

        

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 mb-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center mb-2">
              Send us a message
            </h2>
            <p className="text-center text-gray-600 mb-8">
              This form is the fastest way to reach us regarding your moment.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-light-grey px-4 py-3"
                  required
                />


                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-light-grey px-4 py-3"
                  required
                />

              </div>

              {/* <input
                type="text"
                placeholder="Order ID"
                className="w-full rounded-xl border border-light-grey px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/40"
                required
              /> */}
              <input
                type="text"
                placeholder="Order ID"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                className="w-full rounded-xl border border-light-grey px-4 py-3"
                required
              />


              {/* <textarea
                rows={5}
                placeholder="Tell us how we can help you..."
                className="w-full rounded-xl border border-light-grey px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
                required
              /> */}

              <textarea
                rows={5}
                placeholder="Tell us how we can help you..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-light-grey px-4 py-3 resize-none"
                required
              />


              <p className="text-sm text-gray-500">
                Your email is used only to communicate about your order or
                message. No spam. No sharing. 🤍
              </p>
              {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                {success && (
                  <p className="text-sm text-green-600">
                    Message sent successfully. We’ll get back to you shortly 🤍
                  </p>
                )}


              <button
                type="submit"
                className="w-full bg-charcoal text-white py-3 rounded-xl font-semibold hover:bg-black transition-all"
              >
               {loading ? "Sending..." : "Send Message"}
                {/* disabled={loading} */}

              </button>
            </form>
          </div>
        </div>

        {/* Help Categories */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 mb-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center mb-6">
              What can we help you with?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: "💡", title: "Questions", desc: "About our process" },
                { icon: "🎯", title: "Custom Projects", desc: "Something unique" },
                { icon: "📦", title: "Order Status", desc: "Check your moment" },
                { icon: "💬", title: "Just Chat", desc: "We’re friendly" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-soft-white rounded-xl p-6 text-center hover:bg-gold/10 transition-colors"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-charcoal mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center border-t border-light-grey pt-6">
              <p className="text-gray-600">
                We usually respond within a few hours.
              </p>
              <p className="text-sm text-gray-500">
                Monday – Saturday, 9 AM – 7 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Contact Section */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/ramu_elite.0209?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl">
              📸
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Instagram</p>
              <p className="text-lg font-semibold text-charcoal">@ramu_elite.0209</p>
            </div>
          </a>


          <a
            href="https://www.instagram.com/evermoment_studio?igsh=dzZ6aXN0OHdwOGli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl">
              📸
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Instagram</p>
              <p className="text-lg font-semibold text-charcoal">@evermomentstudio</p>
            </div>
          </a>

          {/* Gmail */}
          <a
  href="mailto:evermomentstudio912@gmail.com"
  className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition max-w-full"
>
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-green-500 flex items-center justify-center text-2xl">
    💌
  </div>

  <div className="text-left min-w-0">
    <p className="text-sm text-gray-500">Email us</p>
    <p className="text-lg font-semibold text-charcoal break-words">
      evermomentstudio912@gmail.com
    </p>
  </div>
</a>

        </div>

        {/* Footer Line */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Your moments matter to us. Let’s create something beautiful
            together.
          </p>
          <div className="text-3xl">🤍</div>
        </div>
      </div>
    </div>
  );
}

