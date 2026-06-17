import React, { useEffect, useState } from 'react';
import { HiHeart, HiCheckCircle, HiExclamationCircle, HiTrendingUp, HiInformationCircle } from 'react-icons/hi';
import { businessHealthService } from '../../services/api/businessHealth.service';

export const BusinessHealthWidget: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    businessHealthService.getHealthScore()
      .then(res => {
        setData(res.data?.data || res.data);
      })
      .catch(err => console.error("Failed to fetch business health", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (!data) return null;

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (grade.includes('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.includes('C')) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getIndicatorText = (grade: string) => {
    if (grade.includes('A')) return 'Excellent';
    if (grade.includes('B')) return 'Good';
    if (grade.includes('C')) return 'Needs Attention';
    return 'Critical';
  };

  const gradeStyle = getGradeColor(data.grade);

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <HiHeart className="w-48 h-48" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-6">
          <HiTrendingUp className="w-6 h-6 text-indigo-400" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">TruckMitra Business Health & AI Coach</h3>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8">
          <div>
            <div className="flex items-baseline space-x-3 mb-2">
              <span className="text-6xl font-black">{data.overallScore}</span>
              <span className="text-xl font-bold text-indigo-300">/ 100</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${gradeStyle}`}>
                Grade {data.grade}
              </span>
              <span className="text-sm font-bold text-slate-300">{getIndicatorText(data.grade)}</span>
            </div>
          </div>

          {/* Breakdown mini-stats */}
          <div className="flex gap-4 opacity-80">
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-[9px] uppercase font-black text-indigo-300 mb-1">Driver Util</div>
              <div className="font-bold">{data.driverUtilizationScore}%</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-[9px] uppercase font-black text-indigo-300 mb-1">Fleet Util</div>
              <div className="font-bold">{data.fleetUtilizationScore}%</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-[9px] uppercase font-black text-indigo-300 mb-1">POD Comp</div>
              <div className="font-bold">{data.podComplianceScore}%</div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-4 flex items-center">
            <HiInformationCircle className="w-4 h-4 mr-2" /> Operations AI Recommendations
          </h4>
          <ul className="space-y-3">
            {data.recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="flex items-start">
                {data.grade.includes('A') ? (
                  <HiCheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                ) : (
                  <HiExclamationCircle className="w-5 h-5 text-amber-400 mr-3 shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium text-slate-200 leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
