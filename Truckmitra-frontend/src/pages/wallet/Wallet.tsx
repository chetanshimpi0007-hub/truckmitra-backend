import React, { useState, useEffect } from 'react';
import { 
  HiCreditCard, 
  HiArrowUp, 
  HiArrowDown, 
  HiClock, 
  HiCurrencyRupee, 
  HiPlus, 
  HiDownload,
  HiCash,
  HiShieldCheck
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

interface WalletData {
  currentBalance: number;
  escrowBalance: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
  walletNumber: string;
}

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');

  const fetchWalletData = async () => {
    try {
      const walletRes = await protectedApi.get('/api/wallet/my');
      setWallet(walletRes.data.data);
      
      const transRes = await protectedApi.get('/api/wallet/my/transactions');
      setTransactions(transRes.data.data.content || []);
    } catch (error: any) {
      console.error('Wallet fetch error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to load wallet data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountToAdd || isNaN(Number(amountToAdd))) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    toast.loading('Initializing payment...', { id: 'payment' });
    
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Check your connection.', { id: 'payment' });
        return;
      }

      // 1. Create order on backend
      const { data } = await protectedApi.post('/api/wallet/create-order', { amount: Number(amountToAdd) });
      const order = data.data;

      // Check if it's a mock order due to missing env vars
      if (order.id && order.id.startsWith('order_mock_')) {
        toast.success('Mock Order Created. Simulating Payment Redirect...', { id: 'payment' });
        window.open('https://razorpay.me/@chetandevidasshimpi', '_blank');
        
        // Simulate backend verification
        setTimeout(async () => {
          await protectedApi.post('/api/wallet/verify-payment', { 
            razorpay_order_id: order.id,
            razorpay_payment_id: 'mock_pay_id',
            razorpay_signature: 'mock_sig'
          });
          toast.success(`Verification complete (Simulated). Your balance is updated.`);
          setShowAddMoney(false);
          setAmountToAdd('');
          fetchWalletData();
        }, 3000);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || '', // Frontend key (public)
        amount: order.amount,
        currency: order.currency,
        name: 'TruckMitra',
        description: 'Wallet Recharge',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            toast.loading('Verifying payment...', { id: 'payment' });
            // 3. Verify payment on backend
            await protectedApi.post('/api/wallet/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success('Payment verified successfully!', { id: 'payment' });
            setShowAddMoney(false);
            setAmountToAdd('');
            fetchWalletData();
          } catch (err) {
            toast.error('Payment verification failed', { id: 'payment' });
          }
        },
        prefill: {
          name: wallet?.walletNumber || 'User'},
        theme: {
          color: '#4F46E5'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      toast.dismiss('payment');
      
    } catch(err: any) {
      toast.error(err.response?.data?.message || 'Failed to initialize payment', { id: 'payment' });
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Wallet</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your funds, escrow payments, and transaction history</p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          <HiShieldCheck className="w-4 h-4" />
          <span>Secure AES-256 Encrypted</span>
        </div>
      </div>

      {/* Wallet Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 rounded-[32px] p-10 text-white shadow-2xl shadow-indigo-200 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />
          <div className="relative z-10">
             <div className="flex items-start justify-between mb-12">
               <div>
                 <p className="text-indigo-100/80 text-xs font-black uppercase tracking-[0.2em] mb-2">Available Balance</p>
                 <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-light">₹</span>
                    <h2 className="text-6xl font-black tracking-tight tracking-tighter">
                      {wallet?.currentBalance?.toLocaleString('en-IN') || '0.00'}
                    </h2>
                 </div>
               </div>
               <div className="w-16 h-10 bg-white/20 backdrop-blur rounded-xl border border-white/30 flex items-center justify-center">
                  <HiCreditCard className="w-8 h-8" />
               </div>
             </div>
             
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-widest mb-1.5">Wallet Identifier</p>
                   <p className="font-mono text-lg tracking-widest opacity-90">{wallet?.walletNumber || 'WAL-0000-00000000'}</p>
                </div>
                <div className="flex space-x-4">
                   <button 
                    onClick={() => setShowAddMoney(true)}
                    className="truncate px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-slate-50 transition shadow-lg flex items-center"
                   >
                     <HiPlus className="mr-2 stroke-2" /> Add Funds
                   </button>
                   <button className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-2xl font-black hover:bg-white/20 transition">
                     Withdraw
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 gap-6">
           <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between border-b-4 hover:border-indigo-500 transition-all">
              <div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Escrow Balance</p>
                 <h3 className="text-3xl font-black text-slate-900 mb-1">₹{wallet?.escrowBalance?.toLocaleString('en-IN') || '0.00'}</h3>
              </div>
              <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl">
                 <HiClock className="mr-2 w-4 h-4 text-indigo-500" />
                 Funds held until delivery completion
              </div>
           </div>
           <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between border-b-4 hover:border-emerald-500 transition-all">
              <div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Lifetime Earnings</p>
                 <h3 className="text-3xl font-black text-slate-900 mb-1 text-emerald-600">₹{wallet?.lifetimeEarnings?.toLocaleString('en-IN') || '0.00'}</h3>
              </div>
              <div className="flex items-center text-xs font-bold text-slate-500 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                 <HiArrowUp className="mr-2 w-4 h-4 text-emerald-500" />
                 Total revenue processed on platform
              </div>
           </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-xl font-black text-slate-900 flex items-center">
             <HiClock className="mr-3 text-indigo-600" /> Recent Transactions
           </h3>
           <button className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition flex items-center">
             View All <HiDownload className="ml-2" />
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
                    <HiCash className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No transactions recorded yet.</p>
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
                            <div className="text-sm font-black text-slate-900">{tx.transactionType.replace('_', ' ')}</div>
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

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddMoney(false)} />
           <div className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl p-6 md:p-10 animate-modalCenter">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-8">
                 <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <HiCurrencyRupee className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">Add Wallet Funds</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Instant Recharge</p>
                 </div>
              </div>

              <form onSubmit={handleAddMoney}>
                <div className="mb-8">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recharge Amount</label>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">₹</span>
                      <input 
                        type="text" 
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                        placeholder="5,000"
                        className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all text-2xl font-black text-slate-900"
                      />
                   </div>
                   <div className="flex gap-2 mt-4">
                      {['1000', '5000', '10000'].map(amt => (
                         <button 
                          key={amt} 
                          type="button" 
                          onClick={() => setAmountToAdd(amt)}
                          className="flex-1 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition"
                         >
                           +₹{amt}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex items-start">
                   <HiShieldCheck className="w-5 h-5 text-indigo-600 mr-3 mt-0.5" />
                   <p className="text-[10px] font-bold text-indigo-700 leading-relaxed uppercase tracking-tighter">
                     Payment will be processed via secured gateway partnership. Your sensitive data is never stored on our servers.
                   </p>
                </div>

                <div className="flex gap-4">
                   <button 
                    type="button" 
                    onClick={() => setShowAddMoney(false)}
                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition"
                   >
                     Cancel
                   </button>
                   <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition"
                   >
                     Proceed To Pay
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;