import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { Role } from '../../interfaces/auth.interface';
import { 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiLockClosed, 
  HiLocationMarker, 
  HiIdentification,
  HiCloudUpload,
  HiArrowRight,
  HiArrowLeft,
  HiCheckCircle,
  HiChevronRight,
  HiEye,
  HiEyeOff
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import CloudinaryService from '../../services/profile/cloudinary.service';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';

const DriverRegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, register: registerUser, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    // Step 1: Basic
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    
    // Step 2: Address
    address: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    
    // Step 3: Identity
    aadhaarNumber: '',
    aadhaarFrontImageUrl: '',
    aadhaarBackImageUrl: '',
    panNumber: '',
    panCardImageUrl: '',
    drivingLicenseNumber: '',
    licenseImageUrl: '',
    licenseExpiryDate: '',
    
    // Step 4: Vehicle
    vehicleNumber: '',
    vehicleCapacity: '',
    vehiclePucImageUrl: '',
    vehicleFrontImageUrl: '',
    vehicleBackImageUrl: '',
    vehicleInsuranceImageUrl: '',
    vehicleFuelType: 'DIESEL'});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await CloudinaryService.uploadImage(file);
      setFormData(prev => ({ ...prev, [fieldName]: url }));
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const registrationData = {
      ...formData,
      role: Role.DRIVER,
      preferredLoginType: 'EMAIL_PASSWORD'};

    // If a transporter is adding a driver, use the specialized endpoint
    if (user && user.role === 'TRANSPORTER') {
      try {
        setIsUploading(true); // Reuse uploading state for submit loading
        await protectedApi.post('/drivers/register-sub-driver', registrationData, {
          params: { transporterId: user.id }
        });
        toast.success('Driver registered successfully under your agency!');
        navigate('/transporter/dashboard');
        return;
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to register driver');
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const success = await registerUser(registrationData);
    if (success) {
      toast.success('Registration successful! Please wait for admin approval.');
      navigate('/pending-approval');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className={`flex flex-col items-center relative`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              step >= i ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {step > i ? <HiCheckCircle className="w-6 h-6" /> : i}
            </div>
            <span className={`absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider ${
              step >= i ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {i === 1 ? 'Contact' : i === 2 ? 'Address' : i === 3 ? 'Identity' : 'Vehicle'}
            </span>
          </div>
          {i < 4 && (
            <div className={`w-12 h-0.5 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Info */}
        <div className="md:w-1/3 bg-blue-700 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="text-3xl font-black tracking-tight mb-4 italic">TruckMitra</div>
            <h2 className="text-2xl font-bold mb-6 leading-tight">Begin Your Journey as a Partner Driver</h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Join India's fastest growing logistics network. Get verified and start earning more.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-sm">
                <div className="p-1 bg-blue-600 rounded-full mr-3"><HiCheckCircle /></div>
                Real-time load matching
              </li>
              <li className="flex items-center text-sm">
                <div className="p-1 bg-blue-600 rounded-full mr-3"><HiCheckCircle /></div>
                Transparent payment system
              </li>
              <li className="flex items-center text-sm">
                <div className="p-1 bg-blue-600 rounded-full mr-3"><HiCheckCircle /></div>
                24/7 Roadside assistance
              </li>
            </ul>
          </div>
          <div className="text-xs text-blue-300">
            © 2026 TruckMitra Logistics. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-10 md:p-14">
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit} className="mt-12">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 gap-6">
                  <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} icon={<HiUser />} placeholder="Enter your full name" required />
                  <InputField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} icon={<HiPhone />} placeholder="10-digit mobile number" required minLength={10} maxLength={10} pattern="[6-9][0-9]{9}" title="Enter a valid 10-digit Indian mobile number starting with 6-9" />
                  <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} icon={<HiMail />} placeholder="yourName@example.com" required />
                  <InputField label="Created Password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} icon={<HiLockClosed />} rightIcon={showPassword ? <HiEyeOff /> : <HiEye />} onRightIconClick={() => setShowPassword(!showPassword)} placeholder="Minimum 6 characters" required minLength={6} />
                </div>
                <div className="pt-6">
                  <button type="button" onClick={nextStep} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center">
                    Next: Address Details <HiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputField label="Detailed Address" name="address" value={formData.address} onChange={handleChange} icon={<HiLocationMarker />} placeholder="House No, Street, Apartment" required />
                  </div>
                  <InputField label="Landmark" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Near Bus Stand" />
                  <InputField label="Area" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Civil Lines" />
                  <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" required />
                  <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Maharashtra" required />
                  <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit PIN" required />
                </div>
                <div className="flex space-x-4 pt-6">
                  <button type="button" onClick={prevStep} className="flex-1 border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center">
                    <HiArrowLeft className="mr-2" /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center">
                    Next: Identity <HiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Identity */}
            {step === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-blue-800 font-bold mb-4 flex items-center"><HiIdentification className="mr-2" /> Aadhaar Verification</h3>
                    <InputField label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="12-digit number" required />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <FileUpload label="Aadhaar Front" fieldName="aadhaarFrontImageUrl" value={formData.aadhaarFrontImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                      <FileUpload label="Aadhaar Back" fieldName="aadhaarBackImageUrl" value={formData.aadhaarBackImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-gray-800 font-bold mb-4 flex items-center"><HiIdentification className="mr-2" /> PAN & License</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" required />
                      <FileUpload label="PAN Card Photo" fieldName="panCardImageUrl" value={formData.panCardImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                    </div>
                    <div className="h-px bg-gray-200 my-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="License Number" name="drivingLicenseNumber" value={formData.drivingLicenseNumber} onChange={handleChange} placeholder="MH-XX-YYYYYYYY" required />
                      <InputField label="License Expiry" type="date" name="licenseExpiryDate" value={formData.licenseExpiryDate} onChange={handleChange} required />
                      <div className="md:col-span-2">
                         <FileUpload label="License Photo" fieldName="licenseImageUrl" value={formData.licenseImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 pt-6">
                  <button type="button" onClick={prevStep} className="flex-1 border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center">
                    <HiArrowLeft className="mr-2" /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center">
                    Final Step: Vehicle <HiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Vehicle */}
            {step === 4 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="MH01AB1234" required />
                  <InputField label="Vehicle Capacity" name="vehicleCapacity" value={formData.vehicleCapacity} onChange={handleChange} placeholder="e.g. 10 Tons" required />
                  
                  <div className="md:col-span-2 bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                    <h3 className="text-yellow-800 font-bold mb-4">Vehicle Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FileUpload label="PUC Certificate" fieldName="vehiclePucImageUrl" value={formData.vehiclePucImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                      <FileUpload label="Insurance" fieldName="vehicleInsuranceImageUrl" value={formData.vehicleInsuranceImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <FileUpload label="Vehicle Front" fieldName="vehicleFrontImageUrl" value={formData.vehicleFrontImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                    <FileUpload label="Vehicle Back" fieldName="vehicleBackImageUrl" value={formData.vehicleBackImageUrl} onUpload={handleFileUpload} isUploading={isUploading} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['DIESEL', 'PETROL', 'CNG'].map(fuel => (
                        <button key={fuel} type="button" onClick={() => setFormData(p => ({...p, vehicleFuelType: fuel}))} className={`py-3 rounded-xl font-bold text-sm transition ${
                          formData.vehicleFuelType === fuel ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-gray-100 text-gray-500 hover:bg-gray-50'
                        }`}>
                          {fuel}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-10">
                  <button type="button" onClick={prevStep} className="flex-1 border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center">
                    <HiArrowLeft className="mr-2" /> Back
                  </button>
                  <button type="submit" disabled={isLoading || isUploading} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-xl flex items-center justify-center disabled:opacity-50">
                    {isLoading ? 'Creating Profile...' : 'Complete Registration'} <HiChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

          </form>

          <div className="mt-10 text-center text-sm text-gray-500">
            Already registered? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InputField: React.FC<any> = ({ label, type = 'text', name, value, onChange, icon, rightIcon, onRightIconClick, placeholder, required = false, ...rest }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
        className={`block w-full ${icon ? 'pl-11' : 'pl-4'} ${rightIcon ? 'pr-12' : 'pr-4'} py-3.5 bg-gray-50 border-2 border-gray-50 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-400 text-gray-800 font-medium`}
        placeholder={placeholder}
        required={required}
      />
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
        >
          {rightIcon}
        </button>
      )}
    </div>
  </div>
);

const FileUpload: React.FC<any> = ({ label, fieldName, value, onUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">{label}</label>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
          value ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 bg-white text-gray-400 hover:border-blue-400 hover:text-blue-500'
        }`}
      >
        {value ? (
          <>
            <HiCheckCircle className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-bold">Uploaded</span>
          </>
        ) : isUploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
        ) : (
          <>
            <HiCloudUpload className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-bold">Click to Upload</span>
          </>
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onUpload(e, fieldName)}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default DriverRegisterForm;
