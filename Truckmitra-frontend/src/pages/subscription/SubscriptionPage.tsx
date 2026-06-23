import React, { useState, useEffect } from 'react';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import PricingCard from '../../Components/subscription/PricingCard';
import CurrentPlanCard from '../../Components/subscription/CurrentPlanCard';
import BillingHistory from '../../Components/subscription/BillingHistory';
import toast from 'react-hot-toast';
import { HiRefresh } from 'react-icons/hi';

const SubscriptionPage: React.FC = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<any>(null);
    const [billingHistory, setBillingHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [plansRes, subRes, historyRes] = await Promise.allSettled([
                protectedApi.get('/subscription/plans'),
                protectedApi.get('/subscription/current'),
                protectedApi.get('/subscription/history'),
            ]);

            if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data);
            if (subRes.status === 'fulfilled') setCurrentSubscription(subRes.value.data);
            if (historyRes.status === 'fulfilled') setBillingHistory(historyRes.value.data);
        } catch (err) {
            toast.error('Failed to load subscription data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubscribe = async (planId: number) => {
        try {
            const response = await protectedApi.post('/subscription/create', { planId });
            const sub = response.data;

            if (sub.razorpaySubscriptionId && (window as any).Razorpay) {
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                    subscription_id: sub.razorpaySubscriptionId,
                    name: 'TruckMitra',
                    description: 'Subscription Plan',
                    handler: (response: any) => {
                        toast.success('Subscription activated! You will receive a confirmation shortly.');
                        fetchData();
                    },
                    theme: { color: '#4F46E5' }
                };
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } else {
                toast.success('Plan updated successfully!');
                fetchData();
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to subscribe');
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
        try {
            await protectedApi.post('/subscription/cancel');
            toast.success('Subscription cancelled');
            fetchData();
        } catch (err) {
            toast.error('Failed to cancel subscription');
        }
    };

    const filteredPlans = plans.filter(p =>
        p.billingCycle === billingCycle || p.billingCycle == null
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Subscription</h2>
                    <p className="text-slate-500 mt-1">Manage your plan and billing</p>
                </div>
                <button onClick={fetchData} className="p-2 bg-white text-indigo-600 rounded-xl font-bold shadow-sm border border-slate-200 hover:bg-indigo-50 transition flex items-center space-x-2">
                    <HiRefresh className="w-5 h-5" />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Current Plan */}
            {currentSubscription && (
                <CurrentPlanCard subscription={currentSubscription} onCancel={handleCancel} />
            )}

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center">
                <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                        onClick={() => setBillingCycle('MONTHLY')}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${billingCycle === 'MONTHLY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('YEARLY')}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${billingCycle === 'YEARLY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Yearly <span className="ml-1.5 text-xs text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-full">Save 20%</span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredPlans.map(plan => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        isCurrentPlan={currentSubscription?.plan?.id === plan.id}
                        onSubscribe={handleSubscribe}
                    />
                ))}
            </div>

            {/* Billing History */}
            {billingHistory.length > 0 && (
                <BillingHistory history={billingHistory} />
            )}
        </div>
    );
};

export default SubscriptionPage;
