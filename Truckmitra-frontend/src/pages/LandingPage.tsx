import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiLocationMarker, 
  HiTruck, 
  HiDocumentText, 
  HiCurrencyRupee,
  HiLightningBolt,
  HiShieldCheck,
  HiChartBar,
  HiPhone,
  HiUser
} from 'react-icons/hi';
import { LogisticsHero } from '../Components/illustrations/LogisticsHero';
import { TestimonialWidget } from '../Components/common/TestimonialWidget';

const fadeInUp: any = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-100px" }
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          {/* Removed login-hero.png per visual identity requirement */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900"></div>
          <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
                <span className="text-sm font-bold tracking-wide uppercase">Next-Gen Logistics Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                Freight Transport <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Reimagined.
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl font-medium">
                The enterprise SaaS platform connecting shippers, transporters, and drivers. Real-time tracking, digital PODs, and automated payments.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex justify-center items-center px-8 py-4 rounded-xl text-white bg-blue-600 hover:bg-blue-500 font-bold tracking-wide transition shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                  Get Started Free
                </Link>
                <Link to="/login" className="inline-flex justify-center items-center px-8 py-4 rounded-xl text-white bg-slate-800 hover:bg-slate-700 font-bold tracking-wide border border-slate-700 transition">
                  Login to Dashboard
                </Link>
              </div>
            </motion.div>

            {/* Hero Driver Mockup */}
            <motion.div 
              className="hidden lg:block relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <LogisticsHero className="w-full max-w-md mx-auto drop-shadow-2xl" />
              </motion.div>
              {/* Decorative Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. LIVE TRACKING SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-blue-500 font-black tracking-widest uppercase text-sm mb-3">Visibility</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Live Isometric Tracking</h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Monitor your entire fleet in real-time with our high-end 3D mapping interface. Get accurate ETAs, active trip status, and route optimizations instantly.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: HiLocationMarker, text: "Real-time GPS tracking" },
                  { icon: HiLightningBolt, text: "Instant ETA calculations" },
                  { icon: HiShieldCheck, text: "Secure geo-fencing" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-300 font-medium">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4 border border-blue-500/20 text-blue-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              {...fadeInUp}
              className="relative group rounded-2xl overflow-hidden border border-slate-700/50"
            >
              <img src="/assets/marketing/live-tracking.png" alt="Live Tracking Dashboard" className="w-full object-cover transform group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FLEET MANAGEMENT SECTION */}
      <section className="py-24 bg-slate-800/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              {...fadeInUp}
              className="order-2 lg:order-1 relative group rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl"
            >
              <img src="/assets/marketing/fleet-management.png" alt="Fleet Management" className="w-full object-cover transform group-hover:scale-105 transition duration-700" />
            </motion.div>

            <motion.div {...fadeInUp} className="order-1 lg:order-2">
              <h2 className="text-emerald-500 font-black tracking-widest uppercase text-sm mb-3">Control Center</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Enterprise Fleet Management</h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Take control of your transport operations. Assign drivers to vehicles, monitor availability status, and analyze performance metrics through our premium dashboard.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: HiTruck, text: "Seamless vehicle assignments" },
                  { icon: HiChartBar, text: "Advanced data visualization" },
                  { icon: HiUser, text: "Driver availability tracking" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-300 font-medium">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 border border-emerald-500/20 text-emerald-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 4. POD VERIFICATION SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-indigo-400 font-black tracking-widest uppercase text-sm mb-3">Digital Workflows</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Smart POD Verification</h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Eliminate paperwork. Drivers can upload Pickup and Destination photos directly via the mobile app, triggering instant digital approvals and seamless invoicing.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: HiDocumentText, text: "Digital Lorry Receipts (LR)" },
                  { icon: HiShieldCheck, text: "Instant status checkmarks" },
                  { icon: HiCurrencyRupee, text: "Automated payment triggers" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-300 font-medium">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-4 border border-indigo-500/20 text-indigo-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              {...fadeInUp}
              className="relative group rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_50px_-15px_rgba(79,70,229,0.3)]"
            >
              <img src="/assets/marketing/pod-verification.png" alt="POD Verification" className="w-full object-cover transform group-hover:scale-105 transition duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <TestimonialWidget />

      {/* 6. CTA SECTION */}
      <section className="py-24 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-800">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to scale your logistics?</h2>
          <p className="text-xl text-slate-400 mb-10">Join thousands of transporters and shippers already using TruckMitra.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-4 rounded-xl text-white bg-blue-600 hover:bg-blue-500 font-bold tracking-wide transition">
              Create Free Account
            </Link>
            <Link to="/contact" className="px-8 py-4 rounded-xl text-white bg-slate-700 hover:bg-slate-600 font-bold tracking-wide transition border border-slate-600">
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default LandingPage;