import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom py-16">
        <h1 className="text-4xl font-display font-bold text-center text-zoo-800 mb-6">Contact Us</h1>
        <div className="max-w-2xl mx-auto">
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full rounded-xl border border-gray-200 p-3" />
            <input type="email" placeholder="Email" className="w-full rounded-xl border border-gray-200 p-3" />
            <textarea placeholder="Message" rows={5} className="w-full rounded-xl border border-gray-200 p-3"></textarea>
            <button className="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;