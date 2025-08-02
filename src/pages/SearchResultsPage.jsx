
// src/pages/SearchResultsPage.js
// Displays search results with advanced filtering and sorting, powered by Appwrite.

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID, PRICE_CONTRIBUTIONS_COLLECTION_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import PriceListTable from '../components/PriceListTable';
import FilterControls from '../components/FilterControls';
import SearchSummary from '../components/SearchSummary';
import { FiSearch } from 'react-icons/fi';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'rice';

  const [products, setProducts] = useState([]);
  const [communityPrices, setCommunityPrices] = useState([]);
  const [shopOwnersMap, setShopOwnersMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [sortOption, setSortOption] = useState('price_asc');
  const [stockFilter, setStockFilter] = useState(false);
  const [marketFilter, setMarketFilter] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const ownersRes = await databases.listDocuments(DATABASE_ID, SHOP_OWNERS_COLLECTION_ID);
        const ownersMap = ownersRes.documents.reduce((acc, owner) => {
          acc[owner.$id] = owner;
          return acc;
        }, {});
        setShopOwnersMap(ownersMap);

        const productsRes = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.search('name', query)]
        );
        setProducts(productsRes.documents);

        if (productsRes.documents.length > 0) {
          const productIds = productsRes.documents.map(p => p.$id);
          const contributionsRes = await databases.listDocuments(
            DATABASE_ID,
            PRICE_CONTRIBUTIONS_COLLECTION_ID,
            [Query.equal('productId', productIds)]
          );
          setCommunityPrices(contributionsRes.documents);
        } else {
          setCommunityPrices([]);
        }

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
      setCommunityPrices([]);
    }
  }, [query]);

  const priceEntries = useMemo(() => {
    const initialEntries = [];

    products.forEach(product => {
      const shopOwner = shopOwnersMap[product.shopOwnerId];
      initialEntries.push({
        uniqueId: `${product.$id}-owner`, productId: product.$id, productName: product.name, productImage: product.imageFileId,
        price: product.ownerPrice, previousPrice: product.previousOwnerPrice,
        sourceName: shopOwner?.name || 'Unknown Shop', sourceType: 'Shop Owner', sourceId: shopOwner?.$id,
        market: shopOwner?.market, stockStatus: product.stockStatus, date: new Date(product.$createdAt), priceHistory: null,
      });
    });

    communityPrices.forEach(contribution => {
      const product = products.find(p => p.$id === contribution.productId);
      if (product) {
        initialEntries.push({
          uniqueId: `${contribution.$id}-community`, productId: product.$id, productName: product.name, productImage: product.imageFileId,
          price: contribution.price, sourceName: 'Community', sourceType: 'Community',
          market: contribution.marketName, stockStatus: 'In Stock', date: new Date(contribution.submittedAt), priceHistory: null,
        });
      }
    });

    return initialEntries;
  }, [products, communityPrices, shopOwnersMap]);

  const searchSummaryStats = useMemo(() => {
    if (priceEntries.length === 0) return { count: 0, lowestPrice: 0, highestPrice: 0 };
    const prices = priceEntries.map(p => p.price);
    return {
      count: priceEntries.length,
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices), // CORRECTED: Calculate highest price
    };
  }, [priceEntries]);

  const processedEntries = useMemo(() => {
    let entries = [...priceEntries];

    if (clientSearchTerm) {
      entries = entries.filter(entry => entry.productName.toLowerCase().includes(clientSearchTerm.toLowerCase()));
    }
    if (stockFilter) {
      entries = entries.filter(entry => entry.stockStatus === 'In Stock');
    }
    if (marketFilter.length > 0) {
      entries = entries.filter(entry => marketFilter.includes(entry.market));
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
  }, [priceEntries, sortOption, stockFilter, marketFilter, clientSearchTerm]);

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
          searchTerm={clientSearchTerm}
          setSearchTerm={setClientSearchTerm}
        />

        {loading ? (
          <p className="text-center">Searching...</p>
        ) : !hasResults && query ? (
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
