import React from 'react';
import { HiLightningBolt, HiCalendar, HiXCircle } from 'react-icons/hi';

interface CurrentPlanCardProps {
    subscription: any;
    onCancel: () => void;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ subscription, onCancel }) => {
    if (!subscription || !subscription.plan) return null;

    const { plan, status, nextBillingDate, autoRenew } = subscription;

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">Current Plan</h2>
                    <div className="text-4xl font-black mb-2 flex items-center gap-3">
                        {plan.name.replace(/_/g, ' ')}
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {status}
                        </span>
                    </div>
                    <p className="text-slate-400 max-w-md">{plan.description}</p>
                </div>
                
                <div className="text-right">
                    <div className="text-3xl font-black">₹{plan.price}</div>
                    <div className="text-sm text-indigo-300">/{plan.billingCycle?.toLowerCase() || 'month'}</div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                            <HiCalendar className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Renewal Date</div>
                            <div className="font-medium">{nextBillingDate ? new Date(nextBillingDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-400">
                            <HiLightningBolt className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Auto Renew</div>
                            <div className="font-medium">{autoRenew ? 'Enabled' : 'Disabled'}</div>
                        </div>
                    </div>
                </div>

                {status === 'ACTIVE' && autoRenew && (
                    <button 
                        onClick={onCancel}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-all"
                    >
                        <HiXCircle className="w-5 h-5" />
                        Cancel Subscription
                    </button>
                )}
            </div>
        </div>
    );
};

export default CurrentPlanCard;
