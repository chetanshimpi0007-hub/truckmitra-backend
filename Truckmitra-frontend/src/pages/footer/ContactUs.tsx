import React, { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { publicApi } from '../../services/api/protectedAndPublicAPI';
import toast from 'react-hot-toast';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicApi.post('/support/contact', formData);
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-blue-900">Contact Us</h2>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600">We're here to help and answer any question you might have.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600 shrink-0">
                <HiMail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Support</h3>
                <p className="text-gray-600 mt-1">Our team typically replies within 24 hours.</p>
                <a href="mailto:support@truckmitra.com" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                  support@truckmitra.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600 shrink-0">
                <HiPhone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Phone Support</h3>
                <p className="text-gray-600 mt-1">Mon-Fri from 9am to 6pm (IST).</p>
                <a href="tel:+919876543210" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
                <HiLocationMarker className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Office Address</h3>
                <p className="text-gray-600 mt-1">
                  TruckMitra Headquarters<br />
                  123 Logistics Park, Sector 4<br />
                  Gurgaon, Haryana 122001<br />
                  India
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="How can we help?" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Write your message here..."></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
