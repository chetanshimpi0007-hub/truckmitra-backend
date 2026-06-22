import React from 'react';
import { HiBookOpen, HiSupport, HiCog } from 'react-icons/hi';

const HelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-blue-900">TruckMitra Help Center</h2>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600">How can we help you today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
              <HiBookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Guides</h3>
            <p className="text-gray-600">Learn how to post loads, bid, and manage your fleet efficiently.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="p-3 bg-green-100 rounded-full text-green-600 mb-4">
              <HiSupport className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Common Support</h3>
            <p className="text-gray-600">Answers to the most frequently asked questions about billing, payments, and account setup.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 rounded-full text-red-600 mb-4">
              <HiCog className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Troubleshooting</h3>
            <p className="text-gray-600">Having technical issues? Find step-by-step guides to resolve common application problems.</p>
          </div>
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Guides</h3>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold text-blue-800">For Shippers</h4>
              <p className="text-gray-600 mt-1">Navigate to your dashboard to post new loads. Provide accurate weight, material type, and dimensions. Wait for transporters to bid on your load, and accept the best rate.</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold text-blue-800">For Transporters</h4>
              <p className="text-gray-600 mt-1">Browse active loads from your load board. Submit competitive bids based on real-time market insights. Assign your verified drivers and vehicles to completed bids.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-800">For Drivers</h4>
              <p className="text-gray-600 mt-1">Log in to view your assigned trips. Update your status accurately using the trip controls, and upload Proof of Delivery (POD) documents securely via your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
