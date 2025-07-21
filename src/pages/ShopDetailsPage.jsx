
// src/pages/ShopDetailsPage.js
// Displays a rich, detailed page for a single shop owner, using a table for products.

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allShopOwners, allProducts } from '../data/mockData';
import ContactShopModal from '../components/ContactShopModal';
import ShopProductTable from '../components/ShopProductTable'; // Import the new table component
import { FiMapPin, FiClock, FiPhone, FiFacebook, FiInstagram } from 'react-icons/fi';

const ShopDetailsPage = () => {
  const { id } = useParams();
  const shop = allShopOwners.find(s => s.id === parseInt(id));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shopProducts = allProducts.filter(p => p.shop === shop?.name);

  if (!shop) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">Shop not found</h2>
        <Link to="/shops" className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
          Back to All Shops
        </Link>
      </div>
    );
  }

  return (
    <>
      <ContactShopModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shop={shop} />
      <div className="bg-gray-50 min-h-screen">
        {/* Shop Header */}
        <section className="bg-white py-12 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <img src={shop.logo} alt={shop.name} className="w-32 h-32 rounded-full border-4 border-green-500 mb-4 md:mb-0 md:mr-8" />
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-800">{shop.name}</h1>
                <p className="text-xl text-gray-600 mt-1">{shop.specialty}</p>
                <div className="flex items-center justify-center md:justify-start text-gray-500 mt-2 space-x-4">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2" />
                    <Link to={`/market/${shop.market.replace(/\s+/g, '-')}`} className="hover:text-green-600 hover:underline">
                      {shop.market}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>{shop.openingHours}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-auto flex-shrink-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-transform hover:scale-105"
                >
                  <FiPhone className="mr-3" />
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: About and Socials */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">About {shop.name}</h3>
                <p className="text-gray-700 leading-relaxed">{shop.bio}</p>

                {(shop.socials?.facebook || shop.socials?.instagram) && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                      {shop.socials.facebook && <a href={shop.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><FiFacebook size={24} /></a>}
                      {shop.socials.instagram && <a href={shop.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600"><FiInstagram size={24} /></a>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Products Table */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Products from this Shop</h2>
              <ShopProductTable products={shopProducts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetailsPage;
