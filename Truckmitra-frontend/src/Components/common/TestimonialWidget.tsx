import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api/protectedAndPublicAPI';
import { HiStar } from 'react-icons/hi';

interface Testimonial {
  id: number;
  authorName: string;
  authorRole: string;
  company: string;
  content: string;
  rating: number;
  imageUrl: string;
}

export const TestimonialWidget: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    publicApi.get('/api/testimonials')
      .then(res => {
        if (res.data) setTestimonials(res.data);
      })
      .catch(err => console.error('Failed to fetch testimonials', err));
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-emerald-500 font-black tracking-widest uppercase text-sm mb-3">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">Trusted by Industry Leaders</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 shadow-xl"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`w-5 h-5 ${i < t.rating ? 'text-amber-400' : 'text-slate-600'}`} />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic leading-relaxed">"{t.content}"</p>
              <div className="flex items-center space-x-4">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.authorName} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-black">
                    {t.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-white font-bold">{t.authorName}</h4>
                  <p className="text-sm text-slate-400">{t.authorRole} {t.company && `at ${t.company}`}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
