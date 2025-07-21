
// src/pages/shopOwner/AddEditProductPage.js
// A form for shop owners to add a new product or edit an existing one.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { allProducts } from '../../data/mockData';
import { FiPackage, FiTag, FiDollarSign, FiFileText, FiImage, FiSave, FiChevronLeft } from 'react-icons/fi';

const AddEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stockStatus: 'In Stock',
    description: '',
    image: null,
  });

  useEffect(() => {
    if (isEditMode) {
      const existingProduct = allProducts.find(p => p.id === parseInt(id));
      if (existingProduct) {
        setProduct({
          name: existingProduct.name,
          category: existingProduct.category,
          price: existingProduct.currentPrice.owner,
          stockStatus: existingProduct.stockStatus,
          description: existingProduct.description,
          image: existingProduct.image,
        });
      }
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProduct(prev => ({ ...prev, image: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      console.log("Updating product:", product);
      alert("Product updated successfully!");
    } else {
      console.log("Adding new product:", product);
      alert("Product added successfully!");
    }
    navigate('/dashboard/products');
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/dashboard/products" className="inline-flex items-center text-green-600 hover:text-green-800 font-semibold">
          <FiChevronLeft className="mr-2" />
          Back to My Products
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <div className="relative">
                <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select name="category" id="category" value={product.category} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option value="">Select a category</option>
                  <option value="Grains">Grains</option>
                  <option value="Oils">Oils</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Tubers">Tubers</option>
                  <option value="Spices">Spices</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Meat">Meat</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required placeholder="e.g., 75000" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <div className="relative">
                <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select name="stockStatus" id="stockStatus" value={product.stockStatus} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-400" />
              <textarea name="description" id="description" rows="4" value={product.description} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="mt-1 flex items-center gap-4">
              {product.image && <img src={product.image} alt="Preview" className="w-24 h-24 object-cover rounded-md" />}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 p-2 border rounded-md">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right pt-4">
            <button
              type="submit"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <FiSave className="mr-2" />
              {isEditMode ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProductPage;
