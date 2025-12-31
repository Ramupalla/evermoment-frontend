// export default function FAQPage() {
//   return (
//     <div className="max-w-4xl mx-auto px-6 py-20">
//       <h1 className="text-3xl font-bold mb-10">Frequently Asked Questions</h1>


//         </div>
//       </div>
//     </div>
//   );
// }


export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl font-bold mb-6 text-charcoal">
          Frequently Asked Questions
        </h1>

              <div className="space-y-6 text-gray-700">
        <div>
          <h3 className="font-semibold">How does pricing work?</h3>
          <p>
            Pricing is based on the final edited video duration, not the number of files uploaded.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">When do I pay?</h3>
          <p>
            Payment is requested only after your final video is ready to be delivered.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Can I request urgent delivery?</h3>
          <p>
            Yes. Fast-track delivery may be available as an optional add-on during payment.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Will I get revisions?</h3>
          <p>
            Yes. We support thoughtful refinements if needed, depending on the plan and request.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">How will I receive my final video?</h3>
          <p>
            We send the final delivery link via WhatsApp and email.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Is my content safe?</h3>
          <p>
            Absolutely. Your files are private and used only to create your EverMoment.
          </p>

        {/* rest of the content unchanged */}
        </div>
        </div>
        <p className="text-gray-500 mt-10">
        Last updated: {new Date().getFullYear()}
      </p>
      </div>
    </div>
  );
}
