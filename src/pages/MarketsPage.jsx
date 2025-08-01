import React, { useState, useEffect, useMemo } from 'react';
import { databases } from '../appwrite/config';
import { DATABASE_ID, MARKETS_COLLECTION_ID } from '../appwrite/constants';
import MarketCard from '../components/MarketCard';
import { FiSearch, FiInbox } from 'react-icons/fi';

const MarketsPage = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          MARKETS_COLLECTION_ID
        );
        setMarkets(response.documents);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  const filteredMarkets = useMemo(() => {
    if (!searchTerm) {
      return markets;
    }
    return markets.filter(market =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, markets]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white py-8 shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800">Explore Kano's Markets</h1>
          <p className="mt-2 text-gray-600">Discover the hubs of commerce where prices are set and deals are made.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a market..."
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading markets...</p>
        ) : filteredMarkets.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMarkets.map(market => (
              <MarketCard key={market.$id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiInbox className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Markets Found</h2>
            <p className="mt-2 text-gray-500">
              We couldn't find any markets matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketsPage;
