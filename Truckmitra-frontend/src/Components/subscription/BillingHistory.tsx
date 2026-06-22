import React from 'react';
import { HiDownload, HiCheckCircle, HiXCircle } from 'react-icons/hi';

interface BillingHistoryProps {
    history: any[];
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ history }) => {
    if (!history || history.length === 0) return null;

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 mt-8">
            <h3 className="text-xl font-black mb-6">Billing History</h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                            <th className="px-4 py-3 rounded-l-xl">Date</th>
                            <th className="px-4 py-3">Event</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 rounded-r-xl text-right">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-4 font-medium text-slate-700">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4 font-bold text-slate-900">
                                    {item.eventType}
                                </td>
                                <td className="px-4 py-4 font-medium text-slate-700">
                                    {item.amount ? `${item.currency} ${item.amount}` : '-'}
                                </td>
                                <td className="px-4 py-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                                        item.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                        {item.status === 'SUCCESS' ? <HiCheckCircle className="w-3 h-3"/> : <HiXCircle className="w-3 h-3"/>}
                                        {item.status}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    {item.eventType === 'CHARGED' && item.status === 'SUCCESS' && (
                                        <button className="inline-flex items-center gap-2 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition">
                                            <HiDownload /> PDF
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillingHistory;
