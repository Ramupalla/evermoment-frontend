export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl font-bold mb-6 text-charcoal">
          Refund Policy
        </h1>

        <p className="text-gray-700 mb-4">
        EverMoment offers a creative, customized service. Please read our refund policy carefully.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Non-Refundable Services</h2>
      <p className="text-gray-700">
        Once editing work has begun or a final video is delivered, payments are non-refundable.
        This includes optional add-ons such as fast-track delivery.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Eligible Refunds</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Duplicate payments</li>
        <li>Technical issues preventing delivery</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">Revisions</h2>
      <p className="text-gray-700">
        We are happy to make reasonable refinements where needed. Refunds are not provided
        for creative preference differences.
      </p>

      <p className="text-gray-500 mt-10">
        Last updated: {new Date().getFullYear()}
      </p>
    {/* </div> */}
      </div>
    </div>
  );
}



// export default function RefundPolicy() {
//   return (
//     <div className="max-w-4xl mx-auto px-6 py-20">
//       <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      
//   );
// }
