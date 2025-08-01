
// src/pages/LandingPage.js
// The main landing page, now fetching featured content from Appwrite.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ProductCard from '../components/ProductCard';
import ShopOwnerCard from '../components/ShopOwnerCard';

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topShopOwners, setTopShopOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      setLoading(true);
      try {
        const productsPromise = databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.limit(4)] // Get the first 4 products
        );

        const shopsPromise = databases.listDocuments(
          DATABASE_ID,
          SHOP_OWNERS_COLLECTION_ID,
          [Query.limit(4)] // Get the first 4 shop owners
        );

        const [productsRes, shopsRes] = await Promise.all([productsPromise, shopsPromise]);

        setFeaturedProducts(productsRes.documents);
        setTopShopOwners(shopsRes.documents);
      } catch (error) {
        console.error("Failed to fetch featured data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  return (
    <div className="bg-gray-50">
      <HeroSection />

      <HowItWorksSection />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Featured Products</h2>
          <p className="text-center text-gray-600 mb-10">Check out the latest prices on popular items.</p>
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(p => <ProductCard key={p.$id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/products" className="bg-white border-2 border-green-600 text-green-600 px-8 py-3 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 font-semibold">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Trusted Shop Owners</h2>
          <p className="text-center text-gray-600 mb-10">Buy from the most reliable sellers in the market.</p>
          {loading ? (
            <p className="text-center">Loading shops...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {topShopOwners.map(o => <ShopOwnerCard key={o.$id} owner={o} />)}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/shops" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-semibold">
              Discover More Shops
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-green-700 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Help the Community!</h2>
          <p className="text-green-200 max-w-2xl mx-auto mb-8">
            Just saw a price? Share it with thousands of others. Your contribution helps everyone shop smarter.
          </p>
          <Link to="/contribute" className="bg-white text-green-700 px-10 py-4 rounded-full hover:bg-gray-200 transition-colors font-bold text-lg">
            Contribute a Price
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
