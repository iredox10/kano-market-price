import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { databases, storage } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, PRODUCT_IMAGES_BUCKET_ID, CATEGORIES_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID } from '../../appwrite/constants';
import { ID, Query } from 'appwrite';
import { FiPackage, FiTag, FiDollarSign, FiFileText, FiImage, FiSave, FiChevronLeft } from 'react-icons/fi';
import InfoModal from '../../components/InfoModal';

const AddEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    ownerPrice: '',
    stockStatus: 'In Stock',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [shopOwnerInfo, setShopOwnerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID);
        setCategories(catRes.documents);

        if (currentUser) {
          const ownerDoc = await databases.getDocument(DATABASE_ID, SHOP_OWNERS_COLLECTION_ID, currentUser.$id);
          setShopOwnerInfo(ownerDoc);
        }

        if (isEditMode) {
          const existingProduct = await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
          setProduct({
            name: existingProduct.name,
            category: existingProduct.category,
            ownerPrice: existingProduct.ownerPrice,
            stockStatus: existingProduct.stockStatus,
            description: existingProduct.description,
          });
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };
    fetchInitialData();
  }, [id, isEditMode, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !shopOwnerInfo) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'Could not verify shop owner details.', type: 'error' });
      return;
    }
    setIsLoading(true);

    try {
      let imageFileId = product.imageFileId || null;

      if (imageFile) {
        const uploadedFile = await storage.createFile(PRODUCT_IMAGES_BUCKET_ID, ID.unique(), imageFile);
        imageFileId = uploadedFile.$id;
      }

      const dataToSave = {
        ...product,
        ownerPrice: parseFloat(product.ownerPrice),
        shopOwnerId: currentUser.$id,
        imageFileId: imageFileId,
        // CORRECTED: Use the 'market' attribute that exists on the shop owner document.
        // For a more robust solution, the cloud function should be updated.
        marketId: shopOwnerInfo.market,
        shop: shopOwnerInfo.name,
      };

      if (isEditMode) {
        await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id, dataToSave);
        setModalInfo({ isOpen: true, title: 'Success!', message: 'Product has been updated successfully.', type: 'success' });
      } else {
        await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, ID.unique(), dataToSave);
        setModalInfo({ isOpen: true, title: 'Success!', message: 'Product has been added successfully.', type: 'success' });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setModalInfo({ isOpen: true, title: 'Error', message: `Failed to save product: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModalAndRedirect = () => {
    setModalInfo({ isOpen: false });
    if (modalInfo.type === 'success') {
      navigate('/dashboard/products');
    }
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={closeModalAndRedirect} />
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
                <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" id="category" value={product.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat.$id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="ownerPrice" className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                <input type="number" name="ownerPrice" id="ownerPrice" value={product.ownerPrice} onChange={handleChange} required placeholder="e.g., 75000" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>

              {/* Stock Status */}
              <div>
                <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                <select name="stockStatus" id="stockStatus" value={product.stockStatus} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" id="description" rows="4" value={product.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="mt-1 flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md" />}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none p-2 border rounded-md">
                    <FiImage className="inline-block mr-2" />
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
                disabled={isLoading}
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                <FiSave className="mr-2" />
                {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEditProductPage;
