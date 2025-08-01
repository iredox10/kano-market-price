import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, PRICE_CONTRIBUTIONS_COLLECTION_ID } from '../appwrite/constants';
import { ID, Query } from 'appwrite';
import { FiSearch, FiTag, FiShoppingBag, FiMapPin, FiSend } from 'react-icons/fi';
import InfoModal from '../components/InfoModal';

const ContributePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [productSearch, setProductSearch] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [price, setPrice] = useState('');
  const [shopName, setShopName] = useState('');
  const [marketName, setMarketName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // Fetch all product names once for the search suggestions
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID);
        setAllProducts(response.documents);
      } catch (error) {
        console.error("Failed to fetch products for search:", error);
      }
    };
    fetchAllProducts();
  }, []);

  const searchResults = useMemo(() => {
    if (!productSearch) return [];
    const uniqueNames = [...new Set(allProducts.map(p => p.name))];
    return uniqueNames.filter(name =>
      name.toLowerCase().includes(productSearch.toLowerCase())
    ).slice(0, 5);
  }, [productSearch, allProducts]);

  const handleSelectProduct = (name) => {
    const product = allProducts.find(p => p.name === name);
    setSelectedProduct(product);
    setProductSearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !price) {
      setModalInfo({ isOpen: true, title: 'Missing Information', message: 'Please select a product and enter a price.', type: 'error' });
      return;
    }
    setIsLoading(true);

    try {
      await databases.createDocument(
        DATABASE_ID,
        PRICE_CONTRIBUTIONS_COLLECTION_ID,
        ID.unique(),
        {
          productId: selectedProduct.$id,
          productName: selectedProduct.name, // Denormalize for easier display
          price: parseFloat(price),
          shopName: shopName || 'Unknown Shop',
          marketName: marketName || 'Unknown Market',
          userId: currentUser.$id,
          submittedAt: new Date().toISOString(),
        }
      );

      setModalInfo({ isOpen: true, title: 'Thank You!', message: 'Your price contribution has been successfully submitted.', type: 'success' });

    } catch (error) {
      console.error("Error submitting contribution:", error);
      setModalInfo({ isOpen: true, title: 'Submission Failed', message: 'There was an error submitting your contribution.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModalAndReset = () => {
    setModalInfo({ isOpen: false });
    if (modalInfo.type === 'success') {
      setSelectedProduct(null);
      setPrice('');
      setShopName('');
      setMarketName('');
    }
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={closeModalAndReset} />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-800">Contribute a Price</h1>
              <p className="mt-3 text-lg text-gray-600">Help the community by sharing the latest market prices you've seen.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Select Product */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Step 1: Find the Product
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search for a product (e.g., Rice)"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={!!selectedProduct}
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="bg-gray-50 border rounded-md mt-2">
                      {searchResults.map(name => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => handleSelectProduct(name)}
                          className="w-full text-left p-3 hover:bg-green-100"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedProduct && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex justify-between items-center">
                      <span className="font-semibold">{selectedProduct.name}</span>
                      <button type="button" onClick={() => setSelectedProduct(null)} className="font-bold text-sm hover:underline">Change</button>
                    </div>
                  )}
                </div>

                {/* Step 2: Add Details */}
                {selectedProduct && (
                  <>
                    <div>
                      <label htmlFor="price" className="block text-lg font-bold text-gray-700 mb-2">
                        Step 2: Enter the Price (in ₦)
                      </label>
                      <div className="relative">
                        <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="price"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g., 75000"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">
                        Step 3: Add Details (Optional)
                      </label>
                      <div className="space-y-4">
                        <div className="relative">
                          <FiShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="Shop Name (e.g., Adamu & Sons)"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={marketName}
                            onChange={(e) => setMarketName(e.target.value)}
                            placeholder="Market Name (e.g., Kantin Kwari)"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                      >
                        <FiSend className="mr-3" />
                        {isLoading ? 'Submitting...' : 'Submit Price'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContributePage;
