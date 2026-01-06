export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl font-bold mb-6 text-charcoal">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-4">
          At EverMoment, your privacy is deeply important to us. This Privacy Policy explains how we collect,
          use, and protect your personal information.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Information We Collect
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Name, email address, and WhatsApp number</li>
          <li>Photos and videos you upload for your order</li>
          <li>Order-related communication and preferences</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>To create and deliver your EverMoment</li>
          <li>To communicate order updates and payment links</li>
          <li>To improve our services and user experience</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Data Storage & File Retention
        </h2>
        <p className="text-gray-700">
          The photos and videos you upload are used solely for creating your EverMoment.
          Once your final video is delivered and access is unlocked, your original uploaded
          files (raw media) are automatically deleted from our secure storage within
          <strong> 7 days</strong>.
        </p>
        <p className="text-gray-700 mt-2">
          This automatic cleanup ensures your personal memories are not retained longer
          than necessary while still allowing sufficient time for delivery and support.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Data Security
        </h2>
        <p className="text-gray-700">
          Your data is stored securely using industry-standard infrastructure and access
          is strictly limited to processing your order. We never sell or share your personal
          data with third parties.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Your Rights
        </h2>
        <p className="text-gray-700">
          You may request deletion of your personal information or delivery data at any
          time after your order is completed by contacting us.
        </p>

        <p className="text-gray-500 mt-10">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
