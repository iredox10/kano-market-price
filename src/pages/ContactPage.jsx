
// src/pages/ContactPage.js
// A page with a contact form and other ways to get in touch.

import React, { useState } from 'react';
import { FiSend, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In a real app, you would send this data to a backend or email service.
    console.log("Form submitted:", formData);
    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white py-8 shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Get In Touch</h1>
          <p className="mt-2 text-gray-600">We'd love to hear from you. Send us a message or find us at our office.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" id="message" rows="4" value={formData.message} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
              </div>
              <div className="text-right">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400">
                  <FiSend className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <FiMail className="text-2xl text-green-600 mr-4 mt-1" />
              <div>
                <h4 className="font-bold text-lg">Email</h4>
                <p className="text-gray-600">Our team will get back to you within 24 hours.</p>
                <a href="mailto:contact@kanoprice.com" className="text-green-600 font-semibold hover:underline">contact@kanoprice.com</a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <FiPhone className="text-2xl text-green-600 mr-4 mt-1" />
              <div>
                <h4 className="font-bold text-lg">Phone</h4>
                <p className="text-gray-600">Mon - Fri, 9am - 5pm WAT</p>
                <a href="tel:+2348012345678" className="text-green-600 font-semibold hover:underline">+234 801 234 5678</a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
              <FiMapPin className="text-2xl text-green-600 mr-4 mt-1" />
              <div>
                <h4 className="font-bold text-lg">Office</h4>
                <p className="text-gray-600">Zoo Road Kano</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
