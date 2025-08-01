
// src/pages/MarketDetailsPage.js
// A redesigned page for a single market with a creative and informative image overlay header.

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases, storage } from '../appwrite/config';
import { DATABASE_ID, MARKETS_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID, MARKET_IMAGES_BUCKET_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import MarketShopTable from '../components/MarketShopTable';
import { FiClock, FiTag, FiMapPin, FiSearch, FiInbox } from 'react-icons/fi';

const MarketDetailsPage = () => {
  const { marketName } = useParams(); // This is the slug
  const [market, setMarket] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const marketRes = await databases.listDocuments(
          DATABASE_ID,
          MARKETS_COLLECTION_ID,
          [Query.equal('slug', marketName)]
        );

        if (marketRes.documents.length > 0) {
          const foundMarket = marketRes.documents[0];
          setMarket(foundMarket);

          if (foundMarket.imageFileId) {
            const url = storage.getFilePreview(MARKET_IMAGES_BUCKET_ID, foundMarket.imageFileId);
            setImageUrl(url.href);
          }

          const shopsRes = await databases.listDocuments(
            DATABASE_ID,
            SHOP_OWNERS_COLLECTION_ID,
            [Query.equal('market', foundMarket.name)]
          );
          setShops(shopsRes.documents);
        } else {
          console.error("Market not found");
        }
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [marketName]);

  const filteredShops = useMemo(() => {
    if (!searchTerm) {
      return shops;
    }
    return shops.filter(shop =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, shops]);

  if (loading) {
    return <p className="text-center p-12">Loading market details...</p>;
  }

  if (!market) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">Market not found</h2>
        <Link to="/markets" className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
          Back to All Markets
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* New Image Overlay Header */}
      <div
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${imageUrl || 'https://placehold.co/1920x1080/e2e8f0/e2e8f0'})`,
          height: '40vh',
          minHeight: '320px'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">{market.name}</h1>
          <p className="mt-2 text-lg text-gray-200 max-w-3xl drop-shadow-md">{market.description}</p>
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-2 text-gray-200">
            <div className="flex items-center">
              <FiClock size={16} className="mr-2 text-emerald-300" />
              <span className="font-semibold">{market.openingHours || 'Not available'}</span>
            </div>
            <div className="flex items-center">
              <FiTag size={16} className="mr-2 text-emerald-300" />
              <span className="font-semibold">
                {market.specialties && market.specialties.length > 0 ? market.specialties.join(', ') : 'General Goods'}
              </span>
            </div>
            <div className="flex items-center">
              <FiMapPin size={16} className="mr-2 text-emerald-300" />
              <span className="font-semibold">
                {market.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Shops in {market.name}</h2>
            <div className="relative w-full sm:w-auto sm:max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          {filteredShops.length > 0 ? (
            <MarketShopTable shops={filteredShops} />
          ) : (
            <div className="text-center py-12">
              <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">No shops found matching your search in this market.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDetailsPage;
