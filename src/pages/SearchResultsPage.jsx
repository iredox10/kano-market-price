// src/pages/SearchResultsPage.js
// Displays search results with advanced filtering and sorting, powered by Appwrite.

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import PriceListTable from '../components/PriceListTable';
import FilterControls from '../components/FilterControls';
import SearchSummary from '../components/SearchSummary';
import { FiSearch } from 'react-icons/fi';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'rice';

  const [products, setProducts] = useState([]);
  const [shopOwnersMap, setShopOwnersMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [sortOption, setSortOption] = useState('price_asc');
  const [stockFilter, setStockFilter] = useState(false);
  const [marketFilter, setMarketFilter] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // 1. Fetch all shop owners to create a map of ID to name for easy lookup
        const ownersRes = await databases.listDocuments(DATABASE_ID, SHOP_OWNERS_COLLECTION_ID);
        const ownersMap = ownersRes.documents.reduce((acc, owner) => {
          acc[owner.$id] = owner;
          return acc;
        }, {});
        setShopOwnersMap(ownersMap);

        // 2. Fetch products matching the search query
        // This Query.search performs a full-text search on the 'name' attribute.
        // It will find "rice" inside "Rice (50kg Bag)", "Local Rice", etc.
        const productsRes = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.search('name', query)]
        );
        setProducts(productsRes.documents);

      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [query]);

  const priceEntries = useMemo(() => {
    const initialEntries = [];
    products.forEach(product => {
      const shopOwner = shopOwnersMap[product.shopOwnerId];
      // Owner price entry
      initialEntries.push({
        uniqueId: `${product.$id}-owner`, productId: product.$id, productName: product.name, productImage: product.imageFileId,
        price: product.ownerPrice, previousPrice: product.previousOwnerPrice,
        sourceName: shopOwner?.name || 'Unknown Shop', sourceType: 'Shop Owner', sourceId: shopOwner?.$id,
        market: shopOwner?.market, stockStatus: product.stockStatus, date: new Date(product.$createdAt), priceHistory: null,
      });
    });
    return initialEntries;
  }, [products, shopOwnersMap]);

  const searchSummaryStats = useMemo(() => {
    if (priceEntries.length === 0) return { count: 0, lowestPrice: 0, averagePrice: 0 };
    const prices = priceEntries.map(p => p.price);
    return {
      count: priceEntries.length,
      lowestPrice: Math.min(...prices),
      averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
    };
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
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
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

        {loading ? (
          <p className="text-center">Searching...</p>
        ) : !hasResults && query ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <FiSearch className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Matching Results Found</h2>
            <p className="mt-2 text-gray-500">
              Try searching for a different term.
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
