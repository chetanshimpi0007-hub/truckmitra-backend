import React from 'react';
import { HiChevronDown } from 'react-icons/hi';

const faqData = [
  {
    category: "Account Questions",
    questions: [
      { q: "How do I create a TruckMitra account?", a: "Click on the 'Register' button on the top right. Select your role (Shipper, Transporter, or Driver) and follow the simple OTP-based registration process." },
      { q: "Can I have multiple roles under one account?", a: "Currently, each mobile number is tied to a specific role. If you act as both a shipper and a transporter, you will need to register separate accounts with different phone numbers." },
    ]
  },
  {
    category: "Payment Questions",
    questions: [
      { q: "How does TruckMitra handle payments?", a: "TruckMitra uses a secure wallet system and integrated payment gateways. Shippers load funds to pay transporters, and transporters receive payouts directly to their linked bank accounts." },
      { q: "Are there any hidden fees?", a: "No. TruckMitra charges a transparent platform fee on completed loads. The fee structure is visible before you accept any bid." },
    ]
  },
  {
    category: "Bidding Questions",
    questions: [
      { q: "How does the bidding process work?", a: "Shippers post a load with details. Transporters view active loads and place bids specifying their rate. Shippers can review all bids and accept the best one." },
      { q: "Can a transporter retract a bid?", a: "Bids can be withdrawn at any point before they are accepted by the shipper. Once accepted, it becomes a binding contract." },
    ]
  },
  {
    category: "Driver & Transporter Questions",
    questions: [
      { q: "How do I assign a driver to an accepted load?", a: "After winning a bid, navigate to your 'My Trips' section. Click on the trip and use the 'Assign Driver' module to select from your verified driver pool." },
      { q: "How does the POD (Proof of Delivery) work?", a: "Drivers use their mobile dashboard to capture an image of the physical delivery receipt. This is uploaded as the POD, which triggers the final payment release once verified by the shipper." },
    ]
  }
];

const Faqs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-blue-900">Frequently Asked Questions</h2>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600">Find answers to the most common questions about using TruckMitra.</p>
        </div>

        <div className="mt-12 space-y-8">
          {faqData.map((section, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.category}</h3>
              <div className="space-y-4">
                {section.questions.map((faq, fIdx) => (
                  <details key={fIdx} className="group border rounded-lg">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-800 hover:bg-gray-50">
                      <span>{faq.q}</span>
                      <span className="transition group-open:rotate-180">
                        <HiChevronDown className="w-5 h-5 text-gray-500" />
                      </span>
                    </summary>
                    <div className="text-gray-600 mt-3 p-4 pt-0 leading-relaxed border-t bg-gray-50/50">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faqs;
