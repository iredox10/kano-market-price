import React, { useState, useEffect, useMemo } from 'react';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, MARKETS_COLLECTION_ID } from '../../appwrite/constants';
import { Query } from 'appwrite';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiUpload } from 'react-icons/fi';
import AddEditMarketModal from '../../components/admin/AddEditMarketModal';
import BulkUploadMarketsModal from '../../components/admin/BulkUploadMarketsModal';

const ITEMS_PER_PAGE = 8;

const ManageMarketsPage = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);

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

  useEffect(() => {
    fetchMarkets();
  }, []);

  const filteredMarkets = useMemo(() => {
    return markets.filter(market =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, markets]);

  const totalPages = Math.ceil(filteredMarkets.length / ITEMS_PER_PAGE);
  const currentMarkets = filteredMarkets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenAddModal = () => {
    setEditingMarket(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (market) => {
    setEditingMarket(market);
    setIsAddEditModalOpen(true);
  };

  const handleSave = () => {
    fetchMarkets(); // Re-fetch data after saving
  };

  return (
    <>
      <AddEditMarketModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        market={editingMarket}
        onSave={handleSave}
      />
      <BulkUploadMarketsModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onSave={handleSave}
      />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Markets</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkUploadModalOpen(true)}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <FiUpload className="mr-2" /> Upload Excel
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" /> Add New Market
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by market name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {loading ? (
            <p className="p-12 text-center text-gray-500">Loading markets...</p>
          ) : (
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="px-5 py-3 font-semibold">Market Name</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMarkets.map(market => (
                  <tr key={market.$id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-gray-900 font-semibold whitespace-no-wrap">{market.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700 whitespace-no-wrap truncate max-w-md">{market.description}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleOpenEditModal(market)}
                          className="text-blue-500 hover:text-blue-700" title="Edit Market">
                          <FiEdit size={20} />
                        </button>
                        <button className="text-red-500 hover:text-red-700" title="Delete Market">
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="mr-2" /> Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <FiChevronRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageMarketsPage;
