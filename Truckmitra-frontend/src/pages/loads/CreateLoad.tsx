import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import protectedApi from '../../services/api/protectedAndPublicAPI';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/auth.hook';
import DriverSelectionModal from '../../Components/loads/DriverSelectionModal';
import { HiMicrophone, HiStop } from 'react-icons/hi';
import { voiceService } from '../../services/api/voice.service';

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const CreateLoad: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [createdLoadId, setCreatedLoadId] = useState<number | null>(null);
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  
  const [transporters, setTransporters] = useState<any[]>([]);
  const [assignmentType, setAssignmentType] = useState('OPEN_MARKET');
  const [selectedTransporterId, setSelectedTransporterId] = useState<number | ''>('');

  React.useEffect(() => {
    if (assignmentType === 'DIRECT_TRANSPORTER') {
      protectedApi.get('/transporters').then(res => {
        setTransporters(res.data);
      }).catch(err => {
        console.error("Failed to load transporters", err);
      });
    }
  }, [assignmentType]);

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

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'hi-IN'; // Default to Hindi/Marathi locale which often shares speech patterns

      rec.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscriptText(text);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Microphone error: ' + event.error);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      if (!recognition) {
        toast.error('Speech recognition is not supported in your browser.');
        return;
      }
      setTranscriptText('');
      recognition.start();
      setIsListening(true);
    }
  };

  // Process transcript once listening stops if there's text
  React.useEffect(() => {
    if (!isListening && transcriptText) {
      processVoiceInput(transcriptText);
    }
  }, [isListening]);

  const processVoiceInput = async (text: string) => {
    try {
      toast.loading('Parsing voice input...', { id: 'voice-parse' });
      const res = await voiceService.parseLoadTranscript(text);
      const data = res.data?.data || res.data;
      
      setFormData(prev => ({
        ...prev,
        source: data.sourceCity || prev.source,
        destination: data.destinationCity || prev.destination,
        weight: data.weight ? data.weight.toString() : prev.weight,
        materialType: data.material || prev.materialType,
        budget: data.amount ? data.amount.toString() : prev.budget,
        description: data.vehicleType ? `Requested Vehicle: ${data.vehicleType}` : prev.description
      }));
      
      toast.success('Fields auto-filled from voice!', { id: 'voice-parse' });
      if (data.confidenceScore < 0.6) {
        toast.error('Some details were missing. Please review and complete manually.', { duration: 4000 });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse voice input. Please enter manually.', { id: 'voice-parse' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        ...formData,
        weight: parseFloat(formData.weight),
        budget: parseFloat(formData.budget),
        assignmentType: assignmentType
      };
      if (assignmentType === 'DIRECT_TRANSPORTER') {
        payload.transporterId = selectedTransporterId;
        payload.isBiddingEnabled = false;
      }
      const response = await protectedApi.post('/loads', payload);
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
        <div className="bg-blue-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Post a New Load</h2>
            <p className="text-blue-100 mt-1">Fill in the details to find the best transporter.</p>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className={`p-4 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}
            title="Speak to auto-fill (Marathi, Hindi, English)"
          >
            {isListening ? <HiStop className="w-8 h-8 text-white" /> : <HiMicrophone className="w-8 h-8" />}
          </button>
        </div>

        {transcriptText && (
          <div className="bg-blue-50 px-8 py-3 border-b border-blue-100">
            <p className="text-sm text-blue-800 font-medium">
              <span className="font-bold">Heard:</span> "{transcriptText}"
              {isListening && <span className="ml-2 animate-pulse text-blue-500">...</span>}
            </p>
          </div>
        )}

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

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignmentType"
                    value="OPEN_MARKET"
                    checked={assignmentType === 'OPEN_MARKET'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="mr-2"
                  />
                  Open Marketplace
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignmentType"
                    value="DIRECT_TRANSPORTER"
                    checked={assignmentType === 'DIRECT_TRANSPORTER'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="mr-2"
                  />
                  Direct Transporter
                </label>
              </div>
            </div>

            {assignmentType === 'DIRECT_TRANSPORTER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Transporter</label>
                <select
                  required
                  value={selectedTransporterId}
                  onChange={(e) => setSelectedTransporterId(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a Transporter --</option>
                  {transporters.map(t => (
                    <option key={t.id} value={t.id}>{t.companyName || t.fullName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {assignmentType === 'OPEN_MARKET' && (
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
          )}

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
        shipperAmount={parseFloat(formData.budget) || 0}
        onClose={() => navigate('/transporter/dashboard')}
        onSuccess={() => navigate('/transporter/dashboard')}
      />
    )}
    </>
  );
};

export default CreateLoad;