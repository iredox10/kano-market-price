
// src/pages/admin/ManageMarketsPage.js
// Page for admins to add, edit, and manage markets.

import React, { useState } from 'react';
import { allMarkets } from '../../data/mockData';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
// We would create this modal component next. For now, we'll just have the button.
// import AddEditMarketModal from '../../components/admin/AddEditMarketModal';

const ManageMarketsPage = () => {
  // In a real app, this state would be managed with API calls
  const [markets, setMarkets] = useState(allMarkets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);

  const handleOpenAddModal = () => {
    setEditingMarket(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (market) => {
    setEditingMarket(market);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* <AddEditMarketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} market={editingMarket} /> */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Markets</h1>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Market
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                <th className="px-5 py-3 font-semibold">Market Name</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map(market => (
                <tr key={market.slug} className="border-b border-gray-200 hover:bg-gray-50">
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
        </div>
      </div>
    </>
  );
};

export default ManageMarketsPage;
