import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import protectedApi from '../../services/api/protectedAndPublicAPI';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/auth.hook';
import DriverSelectionModal from '../../Components/loads/DriverSelectionModal';

const CreateLoad: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [createdLoadId, setCreatedLoadId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    weight: '',
    materialType: '',
    pickupDate: '',
    budget: '',
    isBiddingEnabled: true,
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await protectedApi.post('/api/loads', {
        ...formData,
        weight: parseFloat(formData.weight),
        budget: parseFloat(formData.budget)
      });
      toast.success('Load posted successfully!');
      
      if (user?.role === 'TRANSPORTER') {
        const loadId = response.data?.data?.id || response.data?.id;
        setCreatedLoadId(loadId);
        setShowDriverModal(true);
      } else {
        navigate('/shipper/dashboard');
      }
    } catch (error) {
      toast.error('Failed to post load. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Post a New Load</h2>
          <p className="text-blue-100 mt-1">Fill in the details to find the best transporter.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Source City</label>
              <input
                type="text"
                name="source"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Mumbai"
                value={formData.source}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination City</label>
              <input
                type="text"
                name="destination"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Pune"
                value={formData.destination}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (Tons)</label>
              <input
                type="number"
                name="weight"
                required
                step="0.1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Material Type</label>
              <select
                name="materialType"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.materialType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Construction">Construction</option>
                <option value="Textiles">Textiles</option>
                <option value="Electronics">Electronics</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
              <input
                type="datetime-local"
                name="pickupDate"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.pickupDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget (₹)</label>
              <input
                type="number"
                name="budget"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isBiddingEnabled"
              id="isBiddingEnabled"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.isBiddingEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, isBiddingEnabled: e.target.checked }))}
            />
            <label htmlFor="isBiddingEnabled" className="ml-2 block text-sm text-gray-900">
              Enable Open Bidding
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Load'}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    {showDriverModal && createdLoadId && (
      <DriverSelectionModal 
        loadId={createdLoadId} 
        onClose={() => navigate('/transporter/dashboard')}
        onSuccess={() => navigate('/transporter/dashboard')}
      />
    )}
    </>
  );
};

export default CreateLoad;