import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TripInvoice, PaymentRecord } from '../../services/billing.service';
import billingService from '../../services/billing.service';
import { format } from 'date-fns';
import { HiArrowLeft, HiDownload, HiCreditCard} from 'react-icons/hi';
import toast from 'react-hot-toast';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<TripInvoice | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For Admin recording payment
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const fetchData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [invRes, payRes] = await Promise.all([
        billingService.getInvoiceDetails(Number(id)),
        billingService.getPaymentHistory(Number(id))
      ]);
      setInvoice(invRes.data);
      setPayments(payRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load invoice details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !paymentAmount) return;
    try {
      await billingService.recordPayment(Number(id), Number(paymentAmount), paymentMethod, transactionId, remarks);
      toast.success('Payment recorded successfully');
      setShowPaymentModal(false);
      setPaymentAmount('');
      setTransactionId('');
      setRemarks('');
      fetchData(); // refresh
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-center text-gray-500">Invoice not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <HiArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <div className="flex gap-3">
          {invoice.pdfUrl && (
            <a 
              href={invoice.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              <HiDownload className="w-5 h-5" /> Download PDF
            </a>
          )}
          {isAdmin && invoice.pendingAmount > 0 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <HiCreditCard className="w-5 h-5" /> Record Payment
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
            <p className="text-gray-500 mt-1">Trip: {invoice.tripNumber}</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold 
              ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {invoice.status.replace('_', ' ')}
            </div>
            <p className="text-sm text-gray-500 mt-2">Issued: {format(new Date(invoice.invoiceDate), 'PP')}</p>
            <p className="text-sm text-red-500">Due: {format(new Date(invoice.dueDate), 'PP')}</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Parties</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Shipper</dt>
                <dd className="font-medium text-gray-900">{invoice.shipperName || 'N/A'}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Transporter</dt>
                <dd className="font-medium text-gray-900">{invoice.transporterName || 'N/A'}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Driver</dt>
                <dd className="font-medium text-gray-900">{invoice.driverName || 'N/A'}</dd>
              </div>
              <div className="flex justify-between pb-2">
                <dt className="text-gray-500">Vehicle</dt>
                <dd className="font-medium text-gray-900">{invoice.vehicleNumber || 'N/A'}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Route & Amount</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Route</dt>
                <dd className="font-medium text-gray-900">{invoice.source} → {invoice.destination}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Total Freight</dt>
                <dd className="font-medium text-gray-900">₹{invoice.totalAmount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-gray-500">Amount Paid</dt>
                <dd className="font-medium text-green-600">₹{invoice.paidAmount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between pb-2">
                <dt className="text-gray-500 font-bold">Balance Due</dt>
                <dd className="font-bold text-red-600 text-lg">₹{invoice.pendingAmount.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Payment History section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No payments recorded for this invoice yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{format(new Date(p.paymentDate), 'PP p')}</td>
                    <td className="px-4 py-2 text-sm font-medium text-green-600">₹{p.amountPaid.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{p.paymentMethod}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{p.transactionId || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{p.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <form onSubmit={handleRecordPayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (Max: ₹{invoice.pendingAmount})</label>
                  <input
                    type="number"
                    max={invoice.pendingAmount}
                    required
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
