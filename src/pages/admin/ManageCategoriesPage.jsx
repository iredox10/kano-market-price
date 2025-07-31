import React, { useState } from 'react';
import { FiTag, FiPlus, FiTrash2 } from 'react-icons/fi';

const initialCategories = [
  'Grains', 'Oils', 'Vegetables', 'Tubers', 'Spices', 'Meat', 'Pasta'
];

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory].sort());
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FiTag className="text-2xl text-red-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Manage Product Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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

        {/* Existing Categories List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">{category}</span>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-red-500 hover:text-red-700"
                  title={`Delete ${category}`}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesPage;
