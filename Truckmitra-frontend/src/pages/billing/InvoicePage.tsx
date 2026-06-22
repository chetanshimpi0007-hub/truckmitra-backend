import React, { useState } from 'react';
import InvoiceTable from '../../Components/billing/InvoiceTable';
import InvoiceViewer from '../../Components/billing/InvoiceViewer';

const InvoicePage: React.FC = () => {
  const [viewingInvoiceId, setViewingInvoiceId] = useState<number | null>(null);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {!viewingInvoiceId && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
            <p className="text-gray-500 mt-1">Manage and view all your invoices across trips.</p>
          </div>
        )}

        {viewingInvoiceId ? (
          <InvoiceViewer 
            invoiceId={viewingInvoiceId} 
            onBack={() => setViewingInvoiceId(null)} 
          />
        ) : (
          <InvoiceTable 
            onViewInvoice={(id) => setViewingInvoiceId(id)} 
          />
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
