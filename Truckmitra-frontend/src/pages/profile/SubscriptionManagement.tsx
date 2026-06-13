import React, { useState, useEffect } from 'react';
import { 
  HiCheck, 
  HiChevronRight, 
  HiShieldCheck, 
  HiSparkles,
  HiLightningBolt,
  HiPlus
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { useAuth } from '../../hooks/auth.hook';

const SubscriptionManagement: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, subRes] = await Promise.all([
        protectedApi.get('/api/subscriptions/plans'),
        protectedApi.get('/api/subscriptions/my')
      ]);
      setPlans(plansRes.data);
      setCurrentSub(subRes.data);
    } catch (error) {
      console.error('Failed to fetch subscription data', error);
      toast.error('Could not load plan details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setSubscribingId(planId);
    try {
      const res = await protectedApi.post(`/api/subscriptions/subscribe?planId=${planId}`);
      setCurrentSub(res.data);
      toast.success('Your subscription has been updated successfully!');
    } catch (error) {
      toast.error('Failed to update subscription. Please ensure you have sufficient balance.');
    } finally {
      setSubscribingId(null);
    }
  };

  if (loading) {
     return <div className="p-20 text-center flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="p-10 animate-fadeIn bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Choose Your Growth Plan</h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Scale your logistics business with higher limits and advanced intelligence. Upgrade or downgrade anytime.</p>
          
          {currentSub && (
            <div className="mt-8 inline-flex items-center space-x-3 bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
               <HiShieldCheck className="text-indigo-600 text-xl" />
               <span className="text-sm font-black text-indigo-900">Active Plan: <span className="text-indigo-600">{currentSub.plan?.name}</span></span>
               <span className="text-xs font-bold text-indigo-400 bg-white px-2 py-0.5 rounded-lg border border-indigo-50">Expires: {new Date(currentSub.endDate).toLocaleDateString()}</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const isCurrent = currentSub?.plan?.id === plan.id;
            const isHigher = currentSub?.plan ? plan.price > currentSub.plan.price : true;

            return (
              <div 
                key={plan.id} 
                className={`relative bg-white rounded-[40px] p-8 shadow-sm border-2 transition-all hover:shadow-xl group ${isCurrent ? 'border-indigo-600 shadow-indigo-100' : 'border-slate-100 hover:border-indigo-200'}`}
              >
                {plan.name === 'PRO' && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
                )}
                
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    {plan.name === 'FREE' ? <HiLightningBolt /> : 
                     plan.name === 'BASIC' ? <HiPlus /> : 
                     plan.name === 'PRO' ? <HiSparkles /> : <HiShieldCheck />}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-black">₹{plan.price}</span>
                    <span className="text-slate-400 text-xs font-bold ml-1">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <FeatureItem label="Load Posts" value={plan.loadPostLimit === -1 ? 'Unlimited' : plan.loadPostLimit} />
                  <FeatureItem label="Active Bids" value={plan.bidLimit === -1 ? 'Unlimited' : plan.bidLimit} />
                  <FeatureItem label="Fleet Limit" value={plan.fleetLimit === -1 ? 'No Limit' : plan.fleetLimit} />
                  {plan.hasAnalytics && <FeatureItem label="Business Analytics" active />}
                  {plan.hasVoiceAssistant && <FeatureItem label="Voice Assistant" active />}
                </div>

                <button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || subscribingId !== null}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all ${
                    isCurrent 
                      ? 'bg-slate-50 text-slate-400 cursor-default border border-slate-100' 
                      : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200 hover:shadow-indigo-100'
                  }`}
                >
                  {subscribingId === plan.id ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isCurrent ? 'Current Plan' : (isHigher ? 'Upgrade Now' : 'Downgrade')}</span>
                      {!isCurrent && <HiChevronRight />}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <section className="mt-20 bg-slate-900 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full translate-x-1/2 translate-y-[-1/2]" />
           <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
             <h3 className="text-2xl font-black mb-2">Need a Custom Enterprise Solution?</h3>
             <p className="text-slate-400 font-medium">For organizations with fleets over 500+ vehicles, we offer dedicated support and custom API access.</p>
           </div>
           <button className="relative z-10 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-indigo-50 transition shadow-xl active:scale-95">Contact Sales</button>
        </section>
      </div>
    </div>
  );
};

const FeatureItem = ({ label, value, active }: { label: string, value?: any, active?: boolean }) => (
  <div className="flex items-center text-sm">
    <div className={`p-1 rounded-full mr-3 ${active || value ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
      <HiCheck className="w-3 h-3" />
    </div>
    <span className="font-bold text-slate-600">{label}:</span>
    <span className="ml-auto font-black text-slate-900">{value !== undefined ? value : (active ? 'Yes' : 'No')}</span>
  </div>
);

export default SubscriptionManagement;
