import React, { useState, useEffect } from 'react';
import { TripInvoice, InvoicePaymentStatus } from '../../services/billing.service';
import billingService from '../../services/billing.service';
import { format } from 'date-fns';
import { HiDownload, HiSearch} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface InvoiceListProps {
  rolePath: string; // e.g. '', '/driver', '/transporter', '/shipper'
}

const InvoiceList: React.FC<InvoiceListProps> = ({ rolePath }) => {
  const [invoices, setInvoices] = useState<TripInvoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, ] = useState(0);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await billingService.getInvoices(rolePath, page, 20, search, statusFilter);
      setInvoices(res.data.content);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, statusFilter]);

  const handleExport = () => {
    const url = billingService.exportInvoicesUrl(rolePath, search, statusFilter);
    window.open(url, '_blank');
  };

  const getStatusColor = (status: InvoicePaymentStatus) => {
    switch (status) {
      case InvoicePaymentStatus.PAID: return 'bg-green-100 text-green-800';
      case InvoicePaymentStatus.PARTIALLY_PAID: return 'bg-blue-100 text-blue-800';
      case InvoicePaymentStatus.OVERDUE: return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInvoices()}
            />
          </div>
          
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
        >
          <HiDownload className="w-5 h-5" /> Export Excel
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parties</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-blue-600">{inv.invoiceNumber}</div>
                  <div className="text-sm text-gray-500">Trip: {inv.tripNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{format(new Date(inv.invoiceDate), 'PP')}</div>
                  <div className="text-sm text-red-500">Due: {format(new Date(inv.dueDate), 'PP')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{inv.shipperName || 'N/A'} (S)</div>
                  <div className="text-sm text-gray-500">{inv.transporterName || 'N/A'} (T)</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₹{inv.totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-yellow-600">Pending: ₹{inv.pendingAmount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inv.status)}`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/dashboard/billing/${inv.id}`} className="text-blue-600 hover:text-blue-900">
                    View Details
                  </a>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
