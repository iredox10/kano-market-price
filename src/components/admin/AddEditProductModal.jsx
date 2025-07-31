
// src/components/admin/AddEditProductModal.js
// A modal for admins to add or edit products.

import React, { useState, useEffect } from 'react';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, CATEGORIES_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID } from '../../appwrite/constants';
import { ID, Query } from 'appwrite';
import { FiX, FiSave, FiPackage, FiTag, FiDollarSign, FiUser } from 'react-icons/fi';

const AddEditProductModal = ({ isOpen, onClose, product, onSave, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    ownerPrice: '',
    stockStatus: 'In Stock',
    shopOwnerId: '',
  });
  const [categories, setCategories] = useState([]);
  const [shopOwners, setShopOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories and shop owners for the dropdowns
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catRes, ownerRes] = await Promise.all([
          databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID),
          databases.listDocuments(DATABASE_ID, SHOP_OWNERS_COLLECTION_ID)
        ]);
        setCategories(catRes.documents);
        setShopOwners(ownerRes.documents);
      } catch (error) {
        console.error("Failed to fetch data for modal:", error);
        onError("Could not load required data for the form.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
      if (product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          ownerPrice: product.ownerPrice || '',
          stockStatus: product.stockStatus || 'In Stock',
          shopOwnerId: product.shopOwnerId || '',
        });
      } else {
        setFormData({ name: '', category: '', ownerPrice: '', stockStatus: 'In Stock', shopOwnerId: '' });
      }
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const selectedOwner = shopOwners.find(owner => owner.$id === formData.shopOwnerId);
      const dataToSave = {
        name: formData.name,
        category: formData.category,
        ownerPrice: parseFloat(formData.ownerPrice),
        stockStatus: formData.stockStatus,
        shopOwnerId: formData.shopOwnerId,
        market: selectedOwner?.market || '', // Add market from selected owner
        shop: selectedOwner?.name || '', // Add shop name from selected owner
      };

      if (product) {
        await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, product.$id, dataToSave);
      } else {
        await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, ID.unique(), dataToSave);
      }
      onSave(`Product "${formData.name}" has been saved.`);
      onClose();
    } catch (error) {
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.$id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ownerPrice" className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
              <input type="number" name="ownerPrice" id="ownerPrice" value={formData.ownerPrice} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="shopOwnerId" className="block text-sm font-medium text-gray-700 mb-1">Shop Owner</label>
              <select name="shopOwnerId" id="shopOwnerId" value={formData.shopOwnerId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="">Select Shop Owner</option>
                {shopOwners.map(owner => <option key={owner.$id} value={owner.$id}>{owner.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select name="stockStatus" id="stockStatus" value={formData.stockStatus} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400">
              <FiSave className="mr-2" /> {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProductModal;
