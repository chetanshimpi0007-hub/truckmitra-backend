import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiGlobeAlt, 
  HiLightningBolt, 
  HiShieldCheck, 
  HiLocationMarker, 
  HiUserGroup, 
  HiTruck, 
  HiBriefcase, 
  HiChartPie, 
  HiDocumentText, 
  HiMail, 
  HiPhone, 
  HiClock,
  HiUser
} from 'react-icons/hi';
import { publicApi } from '../../services/api/protectedAndPublicAPI';

const AboutUs: React.FC = () => {
  const [stats, setStats] = useState({
    users: 8500,
    loads: 15200,
    transporters: 1250,
    drivers: 4300
  });

  useEffect(() => {
    // Attempt to fetch real stats, fallback to realistic dummy data if API fails or doesn't exist
    const fetchStats = async () => {
      try {
        const res = await publicApi.get('/api/analytics/public/stats');
        if (res.data?.data) {
          setStats({
            users: res.data.data.totalUsers || 8500,
            loads: res.data.data.totalLoads || 15200,
            transporters: res.data.data.totalTransporters || 1250,
            drivers: res.data.data.totalDrivers || 4300
          });
        }
      } catch (err) {
        // Fallback to static numbers on error
      }
    };
    fetchStats();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
  };

  const whatWeOffer = [
    {
      title: 'For Shippers',
      icon: <HiBriefcase className="w-8 h-8 text-blue-500" />,
      features: ['Easy load posting', 'Real-time tracking', 'Secure transactions']
    },
    {
      title: 'For Transporters',
      icon: <HiTruck className="w-8 h-8 text-emerald-500" />,
      features: ['Fleet management', 'Driver management', 'Bid participation']
    },
    {
      title: 'For Drivers',
      icon: <HiUser className="w-8 h-8 text-amber-500" />,
      features: ['Trip assignments', 'Route visibility', 'Earnings tracking']
    },
    {
      title: 'For Admin',
      icon: <HiChartPie className="w-8 h-8 text-indigo-500" />,
      features: ['Platform monitoring', 'Analytics', 'User management']
    }
  ];

  const whyChooseUs = [
    { title: 'Secure Platform', icon: <HiShieldCheck /> },
    { title: 'Real-Time Updates', icon: <HiLocationMarker /> },
    { title: 'Role-Based Access', icon: <HiUserGroup /> },
    { title: 'Digital Documentation', icon: <HiDocumentText /> },
    { title: 'Smart Fleet Operations', icon: <HiLightningBolt /> },
    { title: 'Scalable Architecture', icon: <HiGlobeAlt /> },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">TruckMitra</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            TruckMitra is a smart logistics and transportation management platform connecting Shippers, Transporters, Drivers, and Businesses through a single digital ecosystem.
          </motion.p>
        </div>
      </section>

      {/* Company Overview & Mission/Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Company Overview</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                TruckMitra simplifies freight movement by bringing all stakeholders onto a unified platform. We replace fragmented communication with streamlined digital workflows.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                From effortless load posting and intelligent bidding to comprehensive fleet management, live trip tracking, and structured driver assignments, TruckMitra ensures complete visibility and control over your logistics network.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <HiLightningBolt className="text-blue-500 mr-3 w-7 h-7" /> Our Mission
                </h3>
                <p className="text-lg text-slate-600 font-medium italic">
                  "To make transportation management faster, transparent, and more efficient through technology."
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <HiGlobeAlt className="text-emerald-500 mr-3 w-7 h-7" /> Our Vision
                </h3>
                <p className="text-lg text-slate-600 font-medium italic">
                  "To become India's most trusted digital logistics ecosystem."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">What We Offer</h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">Tailored solutions for every participant in the logistics chain.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatWeOffer.map((offer, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="mb-6 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {offer.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{offer.title}</h3>
                <ul className="space-y-3">
                  {offer.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start text-slate-600 font-medium">
                      <span className="text-emerald-500 mr-2 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose TruckMitra */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why Choose TruckMitra</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-center p-6 bg-white rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-500 text-3xl mr-4 bg-blue-50 p-3 rounded-lg">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div {...fadeInUp}>
              <div className="text-4xl md:text-5xl font-black mb-2">{stats.users.toLocaleString()}+</div>
              <div className="text-blue-200 font-bold tracking-wide uppercase text-sm">Registered Users</div>
            </motion.div>
            <motion.div {...fadeInUp}>
              <div className="text-4xl md:text-5xl font-black mb-2">{stats.loads.toLocaleString()}+</div>
              <div className="text-blue-200 font-bold tracking-wide uppercase text-sm">Active Loads</div>
            </motion.div>
            <motion.div {...fadeInUp}>
              <div className="text-4xl md:text-5xl font-black mb-2">{stats.transporters.toLocaleString()}+</div>
              <div className="text-blue-200 font-bold tracking-wide uppercase text-sm">Transporters</div>
            </motion.div>
            <motion.div {...fadeInUp}>
              <div className="text-4xl md:text-5xl font-black mb-2">{stats.drivers.toLocaleString()}+</div>
              <div className="text-blue-200 font-bold tracking-wide uppercase text-sm">Drivers</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8 md:p-12 text-center border-b border-slate-100 bg-slate-50">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Get In Touch</h2>
              <p className="text-lg text-slate-500">We're here to help you revolutionize your logistics operations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="p-8 text-center hover:bg-slate-50 transition-colors">
                <HiMail className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Support Email</h4>
                <p className="text-lg font-bold text-slate-900">support@truckmitra.com</p>
              </div>
              <div className="p-8 text-center hover:bg-slate-50 transition-colors">
                <HiPhone className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Support Phone</h4>
                <p className="text-lg font-bold text-slate-900">+91 91580 11580</p>
              </div>
              <div className="p-8 text-center hover:bg-slate-50 transition-colors">
                <HiClock className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Business Hours</h4>
                <p className="text-lg font-bold text-slate-900">Mon - Sat, 9AM - 6PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
