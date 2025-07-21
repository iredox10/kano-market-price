
// src/pages/admin/ManageShopsPage.js
// Page for admins to manage all verified shop owners on the platform, powered by Firestore.

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FiCheck, FiX, FiTrash2, FiSearch, FiPlus, FiUpload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AddShopOwnerModal from '../../components/admin/AddShopOwnerModal';

const ITEMS_PER_PAGE = 7;

const ManageShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Query to get all documents from 'allShopOwners' where status is 'Verified'
    const q = query(collection(db, "allShopOwners"), where("status", "==", "Verified"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const verifiedShops = [];
      querySnapshot.forEach((doc) => {
        verifiedShops.push({ id: doc.id, ...doc.data() });
      });
      setShops(verifiedShops);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredShops = useMemo(() => {
    return shops.filter(shop =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, shops]);

  const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);
  const currentShops = filteredShops.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleUploadClick = () => {
    alert("Upload Excel functionality would be implemented here.");
  };

  return (
    <>
      <AddShopOwnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Manage Shop Owners</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Manually
            </button>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <FiUpload className="mr-2" />
              Upload Excel
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by shop name or specialty..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {loading ? (
            <p className="p-12 text-center text-gray-500">Loading shops...</p>
          ) : (
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="px-5 py-3 font-semibold">Shop Name</th>
                  <th className="px-5 py-3 font-semibold">Specialty</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentShops.map(shop => (
                  <tr key={shop.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <img src={shop.logo || 'https://placehold.co/100x100/ccc/fff?text=Shop'} alt={shop.name} className="w-12 h-12 rounded-full mr-4 flex-shrink-0" />
                        <p className="text-gray-900 font-semibold whitespace-no-wrap">{shop.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700 whitespace-no-wrap">{shop.specialty}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                        <span className="relative">{shop.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex space-x-2">
                        <button className="text-yellow-600 hover:text-yellow-800 p-2 bg-yellow-100 rounded-full" title="Suspend Shop"><FiX size={18} /></button>
                        <button className="text-red-500 hover:text-red-700 p-2 bg-red-100 rounded-full" title="Delete Shop"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
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
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <FiChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ManageShopsPage;
