import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-md border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900">Privacy Policy</h1>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-500 text-sm">Last Updated: June 2026</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              At TruckMitra, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data Collection</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              <ul className="list-disc ml-6 mt-2">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number.</li>
                <li><strong>Logistics Data:</strong> Vehicle registration details, driver licenses, PAN, GST numbers, and geo-location data during active trips.</li>
                <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) processed securely via our payment gateways.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Usage</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
              <ul className="list-disc ml-6 mt-2">
                <li>Create and manage your account.</li>
                <li>Facilitate the matching of loads to transporters and drivers.</li>
                <li>Process transactions and send related information, including confirmations and invoices.</li>
                <li>Track active shipments and provide real-time location updates to Shippers.</li>
                <li>Resolve disputes and troubleshoot problems.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies and Tracking</h2>
            <p>
              We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. User Rights</h2>
            <p>
              You have the right at any time to:
              <ul className="list-disc ml-6 mt-2">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request correction of any inaccurate data.</li>
                <li>Request deletion of your account and associated personal data (subject to legal and regulatory retention requirements).</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at: privacy@truckmitra.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
