
import React from 'react';
import { FiTarget, FiEye, FiUsers } from 'react-icons/fi';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <div className="flex items-center mb-4">
      <div className="mr-4 text-green-600">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{children}</p>
  </div>
);

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold">About KanoPrice</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Empowering the Kano community with transparent, real-time market price information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Our Mission Section */}
          <div className="text-center mb-12">
            <FiTarget className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-800">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our mission is to bring transparency and fairness to the Kano marketplace. We believe that everyone—from everyday shoppers to dedicated shop owners—deserves access to accurate, up-to-date price information to make the best economic decisions. We aim to create a central, community-driven hub that fosters trust and empowers smarter commerce.
            </p>
          </div>

          {/* How It Works Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard icon={<FiEye size={24} />} title="Price Transparency">
              We provide a platform where anyone can search for a product and see its latest prices from various sellers across different markets in Kano. No more guesswork, just clear, actionable data.
            </FeatureCard>
            <FeatureCard icon={<FiUsers size={24} />} title="Community Powered">
              KanoPrice is built by the community, for the community. Every price you see is contributed by either a verified shop owner or a fellow shopper, ensuring the data is fresh, relevant, and reflects the true market.
            </FeatureCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
