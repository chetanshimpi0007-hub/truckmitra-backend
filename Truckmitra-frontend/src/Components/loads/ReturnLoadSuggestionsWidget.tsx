import React, { useEffect, useState } from 'react';
import { ReturnLoadSuggestionResponse } from '../../types/load';
import { tripService } from '../../services/api/trip.service';
import { HiLocationMarker, HiOutlineCube, HiOutlineCurrencyRupee, HiChevronRight } from 'react-icons/hi';
import { format } from 'date-fns';

interface Props {
  completedTripId: number;
  deliveryCity: string;
}

export const ReturnLoadSuggestionsWidget: React.FC<Props> = ({ completedTripId, deliveryCity }) => {
  const [suggestions, setSuggestions] = useState<ReturnLoadSuggestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await tripService.getReturnLoadSuggestions(completedTripId);
        setSuggestions(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    if (completedTripId) {
      fetchSuggestions();
    }
  }, [completedTripId]);

  if (loading) {
    return <div className="p-4 text-center text-slate-500 animate-pulse">Loading return load suggestions...</div>;
  }

  if (error) {
    return null; // Fail gracefully
  }

  if (suggestions.length === 0) {
    return null; // Hide if no suggestions
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-emerald-900">Recommended Return Loads</h3>
          <p className="text-sm text-emerald-600">Smart matches from {deliveryCity}</p>
        </div>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
          {suggestions.length} Found
        </span>
      </div>
      
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {suggestions.map((load) => (
          <div key={load.loadId} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mb-1" />
                  <div className="w-0.5 h-4 bg-slate-200 mx-auto" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{load.sourceCity}</p>
                  <p className="font-medium text-slate-900 text-sm mt-1">{load.destinationCity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                  <HiOutlineCurrencyRupee /> {load.shipperAmount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Posted {format(new Date(load.createdAt), 'MMM dd')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                <HiOutlineCube className="text-slate-400" />
                <span>{load.material || 'General'}</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                <span className="font-medium">{load.weight}</span> Tons
              </div>
              
              <div className="ml-auto text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs font-medium">
                View Details <HiChevronRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
