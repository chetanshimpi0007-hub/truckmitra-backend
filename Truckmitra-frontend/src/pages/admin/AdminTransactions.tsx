import React, { useState, useEffect } from 'react';
import { 
  HiCurrencyDollar, 
  HiArrowUp, 
  HiArrowDown,
  HiClock,
  HiDownload
} from 'react-icons/hi';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Transaction {
  transactionId: string;
  transactionType: string;
  amount: number;
  currentBalance: number;
  direction: 'CREDIT' | 'DEBIT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionDate: string;
  description: string;
}

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await protectedApi.get('/api/admin/transactions');
      setTransactions(res.data.data.content || []);
    } catch (error: any) {
      console.error('Transactions fetch error:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
             <HiCurrencyDollar className="mr-3 text-emerald-600" /> All Transactions
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor all financial activities across the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-xl font-black text-slate-900 flex items-center">
             <HiClock className="mr-3 text-indigo-600" /> Transaction Ledger
           </h3>
           <button className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition flex items-center">
             Export CSV <HiDownload className="ml-2" />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-10 py-5">History & Date</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5">Description</th>
                <th className="px-10 py-5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <HiCurrencyDollar className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No transactions found.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-10 py-5">
                      <div className="flex items-center space-x-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                           tx.direction === 'CREDIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                         }`}>
                           {tx.direction === 'CREDIT' ? <HiArrowDown /> : <HiArrowUp />}
                         </div>
                         <div>
                            <div className="text-sm font-black text-slate-900">{tx.transactionType?.replace('_', ' ') || 'UNKNOWN'}</div>
                            <div className="text-[10px] font-bold text-slate-400">{format(new Date(tx.transactionDate), 'MMM dd, yyyy • HH:mm')}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                        tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-10 py-5">
                      <div className="text-sm font-medium text-slate-500 line-clamp-1">{tx.description || 'N/A'}</div>
                    </td>
                    <td className={`px-10 py-5 text-right text-lg font-black ${
                      tx.direction === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {tx.direction === 'CREDIT' ? '+' : '-'}{tx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
