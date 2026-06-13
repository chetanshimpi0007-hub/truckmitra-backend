// src/Components/laouts/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt 
} from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
        { label: 'Blog', path: '/blog' },
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'For Shippers', path: '/shipper' },
        { label: 'For Transporters', path: '/transporter' },
        { label: 'For Drivers', path: '/driver' },
        { label: 'Pricing', path: '/pricing' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'FAQs', path: '/faqs' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
      ]
    }
  ];

  const contactInfo = [
    { icon: <FaPhone className="mt-1 flex-shrink-0" />, text: 'Mr. Chetan Shimpi: +91 9158011580' },
    { icon: <FaPhone className="mt-1 flex-shrink-0" />, text: 'Mr. Rupesh Patil: +91 9975661172' },
    { icon: <FaPhone className="mt-1 flex-shrink-0" />, text: 'Mr. Shubham Sankpal: +91 8767778028' },
    { icon: <FaEnvelope className="mt-1 flex-shrink-0" />, text: 'support@truckmitra.com' },
    { icon: <FaMapMarkerAlt className="mt-1 flex-shrink-0" />, text: 'Nashik, Maharashtra, India' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: 'https://facebook.com/truckmitra', label: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://twitter.com/truckmitra', label: 'Twitter' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com/company/truckmitra', label: 'LinkedIn' },
    { icon: <FaInstagram />, url: 'https://instagram.com/truckmitra', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-1">TruckMitra</h3>
            <p className="text-sm text-blue-400 mb-4 font-semibold tracking-wide">
              A project by Arnav infoweb.in
            </p>
            <p className="text-gray-400 mb-6">
              India's fastest growing logistics platform connecting shippers, 
              transporters, and drivers for seamless cargo movement.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start text-gray-400">
                  <span className="mr-3 text-blue-400">{item.icon}</span>
                  <span className="leading-tight">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Arnav infoweb.in. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;