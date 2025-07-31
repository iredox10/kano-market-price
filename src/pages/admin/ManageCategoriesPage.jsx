
// src/pages/admin/ManageCategoriesPage.js
// A redesigned page for admins to manage and explore product categories using a dedicated collection.

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, CATEGORIES_COLLECTION_ID } from '../../appwrite/constants';
import { ID, Query } from 'appwrite';
import { FiTag, FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import InfoModal from '../../components/InfoModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const CategoryCard = ({ category, count }) => (
  <Link
    to={`/admin/manage-categories/${encodeURIComponent(category.name)}`}
    className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:border-green-500 transition-all duration-300 flex justify-between items-center"
  >
    <div>
      <h4 className="text-lg font-bold text-gray-800">{category.name}</h4>
      <p className="text-sm text-gray-500">{count} {count === 1 ? 'product' : 'products'}</p>
    </div>
    <FiArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
  </Link>
);

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [modal, setModal] = useState({ type: null, data: null });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID);

      // For each category, get the count of products
      const categoriesWithCounts = await Promise.all(response.documents.map(async (cat) => {
        const productCountRes = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.equal('category', cat.name), Query.limit(1)] // Limit 1 is enough to get the total
        );
        return { ...cat, count: productCountRes.total };
      }));

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setModal({ type: 'info', data: { title: 'Error', message: 'Failed to load categories.', type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory && !categories.find(c => c.name === newCategory)) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          CATEGORIES_COLLECTION_ID,
          ID.unique(),
          { name: newCategory }
        );
        setNewCategory('');
        fetchCategories(); // Refresh the list
        setModal({ type: 'info', data: { title: 'Success', message: `Category "${newCategory}" has been added.`, type: 'success' } });
      } catch (error) {
        setModal({ type: 'info', data: { title: 'Error', message: 'Failed to add category.', type: 'error' } });
      }
    }
  };

  const handleDelete = async (category) => {
    try {
      await databases.deleteDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, category.$id);
      fetchCategories(); // Refresh the list
      setModal({ type: 'info', data: { title: 'Success', message: `Category "${category.name}" has been deleted.`, type: 'success' } });
    } catch (error) {
      setModal({ type: 'info', data: { title: 'Error', message: 'Failed to delete category.', type: 'error' } });
    }
  };

  const sortedCategories = useMemo(() => categories.sort((a, b) => a.name.localeCompare(b.name)), [categories]);

  return (
    <>
      <InfoModal
        isOpen={modal.type === 'info'}
        onClose={() => setModal({ type: null })}
        {...modal.data}
      />
      <ConfirmationModal
        isOpen={modal.type === 'confirmDelete'}
        onClose={() => setModal({ type: null })}
        onConfirm={() => {
          handleDelete(modal.data);
          setModal({ type: null });
        }}
        title="Delete Category?"
        message={`Are you sure you want to permanently delete the "${modal.data?.name}" category? This cannot be undone.`}
      />
      <div>
        <div className="flex items-center mb-6">
          <FiTag className="text-2xl text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Manage Product Categories</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g., Fruits"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              <FiPlus className="mr-2" /> Add
            </button>
          </form>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCategories.map(category => (
              <div key={category.$id} className="relative">
                <CategoryCard category={category} count={category.count} />
                <button
                  onClick={() => setModal({ type: 'confirmDelete', data: category })}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                  title={`Delete ${category.name}`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageCategoriesPage;
