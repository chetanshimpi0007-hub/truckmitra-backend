import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-md border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900">Terms of Service</h1>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-500 text-sm">Last Updated: June 2026</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the TruckMitra platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. User Responsibilities</h2>
            <p>
              Users are strictly responsible for the accuracy of the information provided during registration, load posting, and bidding.
              <ul>
                <li className="list-disc ml-6 mt-2"><strong>Shippers:</strong> Must accurately declare the weight, volume, and material type of the cargo. Misdeclaration may lead to penalties or load rejection.</li>
                <li className="list-disc ml-6 mt-2"><strong>Transporters:</strong> Must ensure that their assigned drivers and vehicles hold valid licenses, permits, and insurance.</li>
                <li className="list-disc ml-6 mt-2"><strong>Drivers:</strong> Must ensure safe and timely delivery, and accurately upload the Proof of Delivery (POD) via the app.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Payment Terms</h2>
            <p>
              All financial transactions are routed through TruckMitra's secure payment gateways and wallet system.
              Shippers must fund their wallets prior to accepting a bid. TruckMitra holds these funds in escrow and releases them to the Transporter only upon successful verification of the POD.
              TruckMitra charges a standard platform fee for facilitating this marketplace, which is deducted prior to final payout.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Platform Rules and Conduct</h2>
            <p>
              Users must conduct themselves professionally. Harassment, use of abusive language, circumvention of the platform's payment systems, or submitting fraudulent PODs are strict violations of these terms and will result in immediate account suspension and potential legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p>
              TruckMitra acts merely as a marketplace connecting Shippers, Transporters, and Drivers. We do not take ownership of the goods being transported and are not liable for any damages, loss of goods, or delays in transit. Any such disputes must be resolved directly between the Shipper and Transporter, although TruckMitra may offer mediation services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
