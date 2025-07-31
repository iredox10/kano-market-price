import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID } from '../../appwrite/constants';
import { FiTag, FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';

const CategoryCard = ({ category, count }) => (
  <Link
    to={`/admin/manage-categories/${encodeURIComponent(category)}`}
    className="group bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:border-green-500 transition-all duration-300 flex justify-between items-center"
  >
    <div>
      <h4 className="text-lg font-bold text-gray-800">{category}</h4>
      <p className="text-sm text-gray-500">{count} {count === 1 ? 'product' : 'products'}</p>
    </div>
    <FiArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
  </Link>
);

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchProductsAndGroup = async () => {
      try {
        // In a real app with many products, you'd paginate this or use a dedicated 'categories' collection.
        const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID);
        const grouped = response.documents.reduce((acc, product) => {
          const cat = product.category;
          if (cat) {
            acc[cat] = (acc[cat] || 0) + 1;
          }
          return acc;
        }, {});
        setCategories(grouped);
      } catch (error) {
        console.error("Failed to fetch products for categorization:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndGroup();
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories[newCategory]) {
      // This just adds it to the UI. In a real app, you'd save this to a 'categories' collection.
      setCategories(prev => ({ ...prev, [newCategory]: 0 }));
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    // This is a UI-only delete. A real implementation would require a backend function.
    const { [categoryToDelete]: _, ...rest } = categories;
    setCategories(rest);
  };

  const sortedCategories = useMemo(() => Object.keys(categories).sort(), [categories]);

  return (
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
            <div key={category} className="relative">
              <CategoryCard category={category} count={categories[category]} />
              <button
                onClick={() => handleDeleteCategory(category)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                title={`Delete ${category}`}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCategoriesPage;
