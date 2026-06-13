import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiCheckCircle, 
  HiShieldCheck, 
  HiCreditCard, 
  HiChevronDown, 
  HiChevronUp, 
  HiLockClosed 
} from 'react-icons/hi';
import { FaGooglePay, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiPaytm, SiRazorpay } from 'react-icons/si';

import Button from '../../Components/ui/Button';
import GlassCard from '../../Components/ui/GlassCard';

type Role = 'DRIVER' | 'TRANSPORTER' | 'SHIPPER';

const PRICING_DATA = {
  DRIVER: [
    { title: '1 Month', price: 1999, duration: 'mo', save: 0, bestValue: false },
    { title: '3 Months', price: 5499, duration: '3 mos', save: 498, bestValue: false },
    { title: '6 Months', price: 9999, duration: '6 mos', save: 1995, bestValue: false },
    { title: '1 Year', price: 17999, duration: 'yr', save: 5989, bestValue: true },
  ],
  TRANSPORTER: [
    { title: '1 Month', price: 2999, duration: 'mo', save: 0, bestValue: false },
    { title: '3 Months', price: 8499, duration: '3 mos', save: 498, bestValue: false },
    { title: '6 Months', price: 15999, duration: '6 mos', save: 1995, bestValue: false },
    { title: '1 Year', price: 28999, duration: 'yr', save: 6989, bestValue: true },
  ],
  SHIPPER: [
    { title: '1 Month', price: 3999, duration: 'mo', save: 0, bestValue: false },
    { title: '3 Months', price: 11499, duration: '3 mos', save: 498, bestValue: false },
    { title: '6 Months', price: 21999, duration: '6 mos', save: 1995, bestValue: false },
    { title: '1 Year', price: 39999, duration: 'yr', save: 7989, bestValue: true },
  ]
};

const FEATURES_DATA = {
  DRIVER: [
    'Unlimited Trip Access', 'Accept / Reject Trips', 'Live Trip Tracking', 'Digital LR Access',
    'POD Upload', 'Pickup Receipt Upload', 'Destination Receipt Upload', 'Earnings Dashboard',
    'Trip History', 'Invoice Access', 'Notification Center', 'Driver Mobile Dashboard',
    'Real-time Status Updates', 'Profile Management'
  ],
  TRANSPORTER: [
    'Unlimited Load Posting', 'Fleet Management', 'Driver Management', 'Vehicle Management',
    'Live Fleet Tracking', 'Route Monitoring', 'Assign Trips', 'Direct Driver Assignment',
    'Bid Management', 'POD Verification', 'LR Management', 'Invoice Management',
    'Analytics Dashboard', 'Revenue Reports', 'Carbon Emission Reports', 'Driver Performance Reports',
    'Subscription Management', 'Notification Center'
  ],
  SHIPPER: [
    'Unlimited Load Posting', 'Receive Multiple Bids', 'Bid Comparison', 'Live Shipment Tracking',
    'Route Monitoring', 'POD Verification', 'Digital LR Access', 'Delivery Confirmation',
    'Invoice Tracking', 'Analytics Dashboard', 'Shipment History', 'Carbon Emission Reports',
    'Notifications', 'Profile Management'
  ]
};

const FAQ_DATA = [
  { q: "How does the 60-day free trial work?", a: "Sign up today and get full access to all features immediately. You won't be charged until the 60 days are over. You can experience the complete TruckMitra ecosystem risk-free." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your dashboard settings. If you cancel during the free trial, you won't be charged." },
  { q: "What happens after trial?", a: "After the 60-day trial, your chosen payment method will be charged for the selected plan. You will receive an email reminder 3 days before the trial ends." },
  { q: "Which payment methods are supported?", a: "We support Razorpay, UPI (Google Pay, PhonePe, Paytm), Debit Cards, Credit Cards, and Net Banking." },
  { q: "Is GST included?", a: "All prices listed are exclusive of GST. An 18% GST will be applied at checkout as per government regulations." },
  { q: "Can I upgrade later?", a: "Absolutely. You can switch plans or upgrade your duration anytime. Remaining balance from your current plan will be prorated." }
];

export default function PricingPage() {
  const [role, setRole] = useState<Role>('TRANSPORTER');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans overflow-hidden">
      
      {/* ─── HERO & LAUNCH OFFER ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand/20 dark:bg-brand/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full mb-8"
        >
          <span className="text-xl">🎉</span>
          <span className="font-bold text-sm tracking-wide">TruckMitra Launch Offer</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400"
        >
          Start Today.<br />
          Pay After <span className="text-brand">60 Days.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium"
        >
          Enterprise logistics software for Drivers, Transporters, and Shippers. All plans include full access—no basic tiers, no hidden fees.
        </motion.p>
      </section>

      {/* ─── ROLE SELECTOR TABS ─────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-16 relative z-10">
        <div className="flex p-1 bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm">
          {(['DRIVER', 'TRANSPORTER', 'SHIPPER'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-4 text-sm md:text-base font-black capitalize transition-all rounded-xl relative ${
                role === r 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {role === r && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-brand rounded-xl shadow-lg shadow-brand/25"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{r.toLowerCase()}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── PRICING CARDS ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PRICING_DATA[role].map((plan, idx) => (
              <GlassCard 
                key={idx} 
                className={`relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl ${
                  plan.bestValue ? 'border-brand shadow-brand/20 shadow-xl' : 'hover:border-brand/50'
                }`}
              >
                {plan.bestValue && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-brand to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-md">
                    Best Value
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-4 uppercase tracking-widest text-sm">
                    {plan.title}
                  </h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-xl font-bold text-slate-400">₹</span>
                    <span className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mx-1">
                      {plan.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
                    per {plan.duration}
                  </div>

                  {plan.save > 0 ? (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-sm px-4 py-2 rounded-xl mb-8 flex items-center justify-center">
                      Save ₹{plan.save.toLocaleString()}
                    </div>
                  ) : (
                    <div className="h-10 mb-8" />
                  )}

                  <Button 
                    variant={plan.bestValue ? 'primary' : 'outline'} 
                    fullWidth 
                    className="py-4"
                  >
                    Start 60-Day Free Trial
                  </Button>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ─── FEATURES GRID ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-32 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-4">Everything you need to scale</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">All features included. No artificial limits.</p>
        </div>

        <GlassCard className="p-8 md:p-12 border-t-4 border-t-brand">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8"
            >
              {FEATURES_DATA[role].map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <HiCheckCircle className="w-5 h-5 text-brand" />
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm md:text-base">
                    {feat}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </section>

      {/* ─── PAYMENT SECURITY ───────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#1e293b] border-y border-slate-200 dark:border-slate-800 py-16 mb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">
            Bank-Grade Security & Trusted Payment Partners
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <SiRazorpay className="w-32 h-10 object-contain text-[#02042b] dark:text-white" />
            <div className="flex items-center space-x-2 text-2xl font-black text-slate-800 dark:text-white">
              <span className="text-[#008f68]">UPI</span>
            </div>
            <FaGooglePay className="w-20 h-auto text-slate-800 dark:text-white" />
            <SiPaytm className="w-24 h-auto text-[#00baf2]" />
            <FaCcVisa className="w-16 h-auto text-[#1a1f71] dark:text-white" />
            <FaCcMastercard className="w-16 h-auto text-[#eb001b]" />
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <HiShieldCheck className="w-5 h-5 text-emerald-500 mr-2" />
              256-bit SSL Encryption
            </div>
            <div className="flex items-center">
              <HiLockClosed className="w-5 h-5 text-emerald-500 mr-2" />
              Secure Payments
            </div>
            <div className="flex items-center">
              <HiCreditCard className="w-5 h-5 text-emerald-500 mr-2" />
              Trusted by Logistics Professionals
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 mb-32 relative z-10">
        <h2 className="text-3xl font-black mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ_DATA.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                <span className="text-slate-400">
                  {openFaq === idx ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
                </span>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 pt-0 text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
