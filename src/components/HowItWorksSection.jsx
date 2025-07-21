
// src/components/HowItWorksSection.js
// A section explaining how the platform works in three simple steps.

import React from 'react';
import { FiSearch, FiBarChart2, FiPlusCircle } from 'react-icons/fi';

const StepCard = ({ icon, title, description }) => (
  <div className="text-center p-6">
    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Get Started in 3 Simple Steps
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Saving money on your market runs has never been easier.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            icon={<FiSearch size={28} />}
            title="1. Search for a Product"
            description="Use our powerful search to find any item you need, from rice and oil to fresh vegetables, across all major Kano markets."
          />
          <StepCard
            icon={<FiBarChart2 size={28} />}
            title="2. Compare Prices"
            description="Instantly see and compare prices from different shop owners and the community to find the best deal for your budget."
          />
          <StepCard
            icon={<FiPlusCircle size={28} />}
            title="3. Contribute & Help"
            description="Saw a price? Share it in seconds. Your contributions help create a transparent market for everyone."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
