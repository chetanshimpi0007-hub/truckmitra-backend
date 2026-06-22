// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { Role } from '../../interfaces/auth.interface';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | ''>('');
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Driver fields
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    preferredVehicleType: 'TRUCK',
    emergencyContactName: '',
    emergencyContactNumber: '',
    
    // Shipper fields
    companyName: '',
    gstNumber: '',
    businessType: '',
    industryType: '',
    
    // Transporter fields
    agencyName: '',
    fleetSize: '',
    serviceAreas: '',
    experienceInYears: ''});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  const validateStep1 = () => {
    if (!role) {
      setError('Please select an account type');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Basic validation
    if (!formData.fullName || !formData.mobile || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    // Address validation
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill address details');
      return false;
    }

    return true;
  };

  const validateRoleSpecificFields = () => {
    if (role === 'DRIVER') {
      if (!formData.drivingLicenseNumber || !formData.licenseExpiryDate || 
          !formData.emergencyContactName || !formData.emergencyContactNumber) {
        setError('Please fill all driver details');
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(formData.emergencyContactNumber)) {
        setError('Please enter a valid emergency contact number');
        return false;
      }
    }

    if (role === 'SHIPPER' && (!formData.companyName || !formData.gstNumber || 
        !formData.businessType || !formData.industryType)) {
      setError('Please fill all business details');
      return false;
    }

    if (role === 'TRANSPORTER' && (!formData.agencyName || !formData.fleetSize || 
        !formData.serviceAreas || !formData.experienceInYears)) {
      setError('Please fill all transporter details');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRoleSpecificFields()) {
      return;
    }

    const data = {
      fullName: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password,
      role: role as Role,
      preferredLoginType: 'EMAIL_PASSWORD',
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      
      // Driver fields
      drivingLicenseNumber: formData.drivingLicenseNumber,
      licenseExpiryDate: formData.licenseExpiryDate,
      preferredVehicleType: formData.preferredVehicleType,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactNumber: formData.emergencyContactNumber,
      
      // Shipper fields
      companyName: formData.companyName,
      gstNumber: formData.gstNumber,
      businessType: formData.businessType,
      industryType: formData.industryType,
      
      // Transporter fields
      agencyName: formData.agencyName,
      fleetSize: formData.fleetSize ? parseInt(formData.fleetSize) : undefined,
      serviceAreas: formData.serviceAreas,
      experienceInYears: formData.experienceInYears ? parseInt(formData.experienceInYears) : undefined};
    const success = await registerUser(data);
    if (success) {
      // After registration, user will have REGISTERED status
      navigate('/profile'); // Redirect to profile completion
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className="ml-2 text-sm font-medium text-gray-900">Account Type</div>
        </div>
        <div className="flex-1 mx-4 h-0.5 bg-gray-200">
          <div className={`h-full bg-blue-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className="ml-2 text-sm font-medium text-gray-900">Personal Info</div>
        </div>
        <div className="flex-1 mx-4 h-0.5 bg-gray-200">
          <div className={`h-full bg-blue-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
          <div className="ml-2 text-sm font-medium text-gray-900">Details</div>
        </div>
      </div>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/driver/register')}
        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">Driver</h3>
        <p className="text-sm text-gray-500">Looking for loads to transport</p>
      </button>

      <button
        type="button"
        onClick={() => navigate('/shipper/register')}
        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">Shipper</h3>
        <p className="text-sm text-gray-500">I want to move goods and find trucks</p>
      </button>

      <button
        type="button"
        onClick={() => navigate('/transporter/register')}
        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">Transporter</h3>
        <p className="text-sm text-gray-500">I own trucks and provide transport services</p>
      </button>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password *</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 z-10 mt-1"
          >
            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Address Details</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">City *</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderRoleSpecificFields = () => {
    if (role === 'DRIVER') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Driver Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Driving License Number *</label>
            <input
              type="text"
              name="drivingLicenseNumber"
              value={formData.drivingLicenseNumber}
              onChange={handleChange}
              placeholder="e.g., BR02-20260099887"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Expiry Date *</label>
            <input
              type="date"
              name="licenseExpiryDate"
              value={formData.licenseExpiryDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Vehicle Type *</label>
            <select
              name="preferredVehicleType"
              value={formData.preferredVehicleType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="TRUCK">Truck</option>
              <option value="CONTAINER">Container</option>
              <option value="TRAILER">Trailer</option>
              <option value="TRUCK_12_WHEELER">12 Wheeler Truck</option>
              <option value="TRUCK_16_WHEELER">16 Wheeler Truck</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Name *</label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Number *</label>
            <input
              type="tel"
              name="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      );
    }

    if (role === 'SHIPPER') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Business Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">GST Number *</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Business Type</option>
              <option value="MANUFACTURING">Manufacturing</option>
              <option value="TRADING">Trading</option>
              <option value="RETAIL">Retail</option>
              <option value="WHOLESALE">Wholesale</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Industry Type *</label>
            <input
              type="text"
              name="industryType"
              value={formData.industryType}
              onChange={handleChange}
              placeholder="e.g., Automotive, FMCG, etc."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      );
    }

    if (role === 'TRANSPORTER') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Transport Business Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agency Name *</label>
            <input
              type="text"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fleet Size *</label>
            <input
              type="number"
              name="fleetSize"
              value={formData.fleetSize}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service Areas *</label>
            <input
              type="text"
              name="serviceAreas"
              value={formData.serviceAreas}
              onChange={handleChange}
              placeholder="e.g., Maharashtra, Gujarat, Delhi-NCR"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (Years) *</label>
            <input
              type="number"
              name="experienceInYears"
              value={formData.experienceInYears}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join TruckMitra today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStepIndicator()}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {step === 1 && renderRoleSelection()}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              {renderPersonalInfo()}
              {renderAddressInfo()}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              {renderRoleSpecificFields()}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;