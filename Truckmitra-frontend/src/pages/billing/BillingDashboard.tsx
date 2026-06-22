import React, { useEffect, useState } from 'react';
import { 
  HiOutlineCurrencyRupee, 
  HiOutlineDocumentText, 
  HiOutlineClock 
} from 'react-icons/hi';
import billingService, { BillingSummary } from '../../services/billing.service';
import InvoiceList from './InvoiceList';
import toast from 'react-hot-toast';

interface BillingDashboardProps {
  rolePath: string; // e.g. '', '/driver', '/transporter', '/shipper'
}

const BillingDashboard: React.FC<BillingDashboardProps> = ({ rolePath }) => {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const response = await billingService.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch billing summary', error);
      toast.error('Failed to load billing metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
        <button 
          onClick={fetchSummary}
          className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 flex items-center"
        >
          <HiOutlineClock className="w-4 h-4 mr-1" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue/Spend"
          value={`₹${summary?.totalRevenue?.toLocaleString() || 0}`}
          icon={<HiOutlineCurrencyRupee className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Total Paid"
          value={`₹${summary?.totalPaid?.toLocaleString() || 0}`}
          icon={<HiOutlineCurrencyRupee className="w-6 h-6 text-green-600" />}
          bgColor="bg-green-50"
        />
        <MetricCard
          title="Pending Amount"
          value={`₹${summary?.totalPending?.toLocaleString() || 0}`}
          icon={<HiOutlineClock className="w-6 h-6 text-yellow-600" />}
          bgColor="bg-yellow-50"
        />
        <MetricCard
          title="Total Invoices"
          value={summary?.totalInvoices?.toString() || '0'}
          icon={<HiOutlineDocumentText className="w-6 h-6 text-purple-600" />}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Main Invoice List */}
      <div className="bg-white shadow rounded-lg p-6">
        <InvoiceList rolePath={rolePath} />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, bgColor }: any) => (
  <div className={`${bgColor} rounded-lg p-6 border border-gray-100`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-white rounded-full shadow-sm">
        {icon}
      </div>
    </div>
  </div>
);

export default BillingDashboard;
