export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl font-bold mb-6 text-charcoal">
          Terms & Conditions
        </h1>

        {/* rest of the content unchanged */}
        <p className="text-gray-700 mb-4">
        By using EverMoment, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Service Description</h2>
      <p className="text-gray-700">
        EverMoment provides custom video editing services based on user-uploaded content.
        Delivery timelines are estimates and may vary based on workload and content complexity.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">User Responsibilities</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>You confirm that you own or have rights to all uploaded content</li>
        <li>You agree not to upload illegal, offensive, or copyrighted material</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">Payments</h2>
      <p className="text-gray-700">
        Payments are required to unlock final video delivery. Optional add-ons such as fast-track delivery
        are charged separately and are non-refundable once executed.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Modifications</h2>
      <p className="text-gray-700">
        EverMoment reserves the right to update these terms at any time.
      </p>

      <p className="text-gray-500 mt-10">
        Last updated: {new Date().getFullYear()}
      </p>
      </div>
    </div>
  );
}






// export default function TermsAndConditions() {
//   return (
//     <div className="max-w-4xl mx-auto px-6 py-20">
//       <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      
//     </div>
//   );
// }
