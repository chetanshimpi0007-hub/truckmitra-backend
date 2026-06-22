import React from 'react';

interface PricingCardProps {
    plan: any;
    isCurrentPlan: boolean;
    onSubscribe: (planId: number) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isCurrentPlan, onSubscribe }) => {
    return (
        <div className={`p-6 rounded-2xl border ${isCurrentPlan ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'} shadow-sm relative`}>
            {isCurrentPlan && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                    Current Plan
                </div>
            )}
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide">{plan.name.replace(/_/g, ' ')}</h3>
            <p className="text-slate-500 text-sm mt-2 min-h-[40px]">{plan.description || "Get started with our basic features."}</p>
            <div className="mt-4 mb-6">
                <span className="text-4xl font-black text-slate-900">₹{plan.price || 0}</span>
                <span className="text-slate-500 font-medium">/{plan.billingCycle?.toLowerCase() || 'month'}</span>
            </div>
            
            <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                {plan.maxLoads != null && <li>{plan.maxLoads === -1 ? 'Unlimited' : plan.maxLoads} Loads</li>}
                {plan.maxBids != null && <li>{plan.maxBids === -1 ? 'Unlimited' : plan.maxBids} Bids</li>}
                {plan.maxVehicles != null && <li>{plan.maxVehicles === -1 ? 'Unlimited' : plan.maxVehicles} Vehicles</li>}
                {plan.hasAnalytics && <li className="flex items-center text-emerald-600"><span className="mr-2">✓</span> Advanced Analytics</li>}
                {plan.hasVoiceAssistant && <li className="flex items-center text-emerald-600"><span className="mr-2">✓</span> Voice Assistant</li>}
                {plan.features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-center"><span className="mr-2 text-indigo-500">✓</span> {f}</li>
                ))}
            </ul>

            <button 
                onClick={() => onSubscribe(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isCurrentPlan 
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                }`}
            >
                {isCurrentPlan ? 'Active' : (plan.price === 0 ? 'Downgrade' : 'Upgrade')}
            </button>
        </div>
    );
};

export default PricingCard;
