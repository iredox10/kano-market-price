
// src/pages/SearchResultsPage.js
// Displays search results with advanced filtering and sorting capabilities.

import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { allProducts, allShopOwners } from '../data/mockData';
import PriceListTable from '../components/PriceListTable';
import FilterControls from '../components/FilterControls';
import SearchSummary from '../components/SearchSummary';
import { FiSearch } from 'react-icons/fi';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'rice';

  // State for filters and sorting
  const [sortOption, setSortOption] = useState('price_asc');
  const [stockFilter, setStockFilter] = useState(false);
  const [marketFilter, setMarketFilter] = useState([]);

  const priceEntries = useMemo(() => {
    const initialEntries = [];
    const filteredProducts = query
      ? allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      : [];

    filteredProducts.forEach(product => {
      const shopOwner = allShopOwners.find(owner => owner.name === product.shop);
      if (product.currentPrice?.owner) {
        initialEntries.push({
          uniqueId: `${product.id}-owner`, productId: product.id, productName: product.name, productImage: product.image,
          price: product.currentPrice.owner, previousPrice: product.currentPrice.previousOwnerPrice,
          sourceName: product.shop, sourceType: 'Shop Owner', sourceId: shopOwner?.id,
          market: shopOwner?.market, stockStatus: product.stockStatus, date: new Date('2025-07-13T10:00:00Z'), priceHistory: product.priceHistory,
        });
      }
      if (product.currentPrice?.community) {
        initialEntries.push({
          uniqueId: `${product.id}-community`, productId: product.id, productName: product.name, productImage: product.image,
          price: product.currentPrice.community, sourceName: 'Community', sourceType: 'Community',
          market: 'Various', stockStatus: 'In Stock', date: new Date('2025-07-12T12:00:00Z'), priceHistory: product.priceHistory,
        });
      }
    });
    return initialEntries;
  }, [query]);

  const searchSummaryStats = useMemo(() => {
    if (priceEntries.length === 0) {
      return { count: 0, lowestPrice: 0, averagePrice: 0 };
    }
    const prices = priceEntries.map(p => p.price);
    const lowestPrice = Math.min(...prices);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    return { count: priceEntries.length, lowestPrice, averagePrice };
  }, [priceEntries]);

  const processedEntries = useMemo(() => {
    let entries = [...priceEntries];
    if (stockFilter) {
      entries = entries.filter(entry => entry.stockStatus === 'In Stock');
    }
    switch (sortOption) {
      case 'price_asc':
        entries.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        entries.sort((a, b) => b.price - a.price);
        break;
      case 'date_desc':
        entries.sort((a, b) => b.date - a.date);
        break;
      default:
        break;
    }
    if (entries.length > 0 && sortOption === 'price_asc') {
      entries[0] = { ...entries[0], bestPrice: true };
    }
    return entries;
  }, [priceEntries, sortOption, stockFilter]);

  const hasResults = processedEntries.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white py-8 shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-gray-600">
            Use the controls below to filter and sort the results.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchSummary {...searchSummaryStats} />
        <FilterControls
          sortOption={sortOption}
          setSortOption={setSortOption}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          marketFilter={marketFilter}
          setMarketFilter={setMarketFilter}
        />

        {!hasResults && query ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <FiSearch className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Matching Results Found</h2>
            <p className="mt-2 text-gray-500">
              Try adjusting your filters or searching for a different term.
            </p>
            <Link to="/" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 font-semibold">
              Back to Home
            </Link>
          </div>
        ) : (
          <PriceListTable products={processedEntries} />
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
