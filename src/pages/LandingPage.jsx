
// src/pages/LandingPage.js
// The main landing page that assembles several components.

import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ProductCard from '../components/ProductCard'; // Ensure this path is correct
import ShopOwnerCard from '../components/ShopOwnerCard';
import { allProducts, allShopOwners } from '../data/mockData';

const LandingPage = () => {
  // Get first 4 items for the landing page
  const featuredProducts = allProducts.slice(0, 4);
  const topShopOwners = allShopOwners.slice(0, 4);

  return (
    <div className="bg-gray-50">
      <HeroSection />

      <HowItWorksSection />

      {/* Redesigned Featured Products Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Today's Market <span className="text-emerald-400">Highlights</span>
            </h2>
            <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
              A snapshot of the latest prices on essential items across Kano.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-16">
            <Link
              to="/products"
              className="bg-emerald-500 text-white px-8 py-3 rounded-full hover:bg-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/30 text-lg transform hover:scale-105"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Trusted Shop Owners</h2>
          <p className="text-center text-gray-600 mb-12">Buy from the most reliable sellers in the market.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {topShopOwners.map(o => <ShopOwnerCard key={o.id} owner={o} />)}
          </div>
          <div className="text-center mt-16">
            <Link to="/shops" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-semibold">
              Discover More Shops
            </Link>
          </div>
        </div>
      </section>

      <section className="aurora-background text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">See a Price? Share the Knowledge.</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Your 10-second contribution helps thousands of people in Kano make smarter shopping decisions. Be a community hero.
          </p>
          <Link to="/contribute" className="bg-white text-green-700 px-10 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg">
            Contribute a Price
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
