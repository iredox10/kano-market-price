
// src/pages/ProductsPage.js
// A redesigned catalog page with a compact, mobile-first design.

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID } from '../appwrite/constants';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { FiChevronLeft, FiChevronRight, FiInbox } from 'react-icons/fi';

const PRODUCTS_PER_PAGE = 10;

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID);
        setAllProducts(response.documents);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const uniqueProducts = useMemo(() => {
    const unique = new Map();
    allProducts.forEach(product => {
      if (!unique.has(product.name)) {
        unique.set(product.name, product);
      }
    });
    return Array.from(unique.values());
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let products = uniqueProducts;

    if (searchTerm) {
      products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter) {
      products = products.filter(p => p.category === categoryFilter);
    }
    if (stockFilter) {
      products = products.filter(p => p.stockStatus === 'In Stock');
    }
    return products;
  }, [searchTerm, categoryFilter, stockFilter, uniqueProducts]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white py-8 shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800">All Products</h1>
          <p className="mt-2 text-gray-600">Browse, search, and filter our entire catalog of products.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
        />

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading products...</p>
        ) : currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {currentProducts.map(p => <ProductCard key={p.$id} product={p} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="mr-2" /> Previous
                </button>
                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <FiChevronRight className="ml-2" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <FiInbox className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Products Found</h2>
            <p className="mt-2 text-gray-500">
              No products match your current filters. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
