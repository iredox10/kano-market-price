import React, { useState, useEffect } from 'react';
import { databases, storage } from '../../appwrite/config';
import { DATABASE_ID, MARKETS_COLLECTION_ID, MARKET_IMAGES_BUCKET_ID } from '../../appwrite/constants';
import { ID } from 'appwrite';
import { FiX, FiSave, FiMap, FiFileText, FiClock, FiTag, FiImage } from 'react-icons/fi';

const AddEditMarketModal = ({ isOpen, onClose, market, onSave, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    specialties: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (market) {
        setFormData({
          name: market.name || '',
          description: market.description || '',
          location: market.location || '',
          openingHours: market.openingHours || '',
          specialties: (market.specialties || []).join(', '),
        });
        // In a real app, you would fetch the image preview URL from Appwrite Storage
        setImagePreview('');
      } else {
        // Reset form for adding a new market
        setFormData({ name: '', description: '', location: '', openingHours: '', specialties: '' });
        setImagePreview('');
        setImageFile(null);
      }
    }
  }, [market, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setIsLoading(true);
    try {
      let imageFileId = market?.imageFileId || '';

      if (imageFile) {
        // TODO: If editing, delete the old image from storage first
        const uploadedFile = await storage.createFile(MARKET_IMAGES_BUCKET_ID, ID.unique(), imageFile);
        imageFileId = uploadedFile.$id;
      }

      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const specialtiesArray = formData.specialties.split(',').map(s => s.trim()).filter(Boolean);

      const dataToSave = {
        ...formData,
        slug,
        specialties: specialtiesArray,
        imageFileId: imageFileId
      };

      if (market) {
        await databases.updateDocument(
          DATABASE_ID,
          MARKETS_COLLECTION_ID,
          market.$id,
          dataToSave
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          MARKETS_COLLECTION_ID,
          ID.unique(),
          dataToSave
        );
      }
      onSave(`Market "${formData.name}" has been saved successfully.`);
      onClose();
    } catch (error) {
      console.error("Failed to save market:", error);
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{market ? 'Edit Market' : 'Add New Market'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Market Name</label>
            <div className="relative">
              <FiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-400" />
              <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} placeholder="e.g., Fagge, Kano City" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
              <input type="text" name="openingHours" id="openingHours" value={formData.openingHours} onChange={handleChange} placeholder="e.g., Mon - Sat: 8am - 6pm" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div>
            <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="specialties" id="specialties" value={formData.specialties} onChange={handleChange} placeholder="Enter comma-separated values (e.g., Grains, Textiles)" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Image</label>
            <div className="mt-1 flex items-center gap-4">
              {imagePreview && <img src={imagePreview} alt="Market preview" className="w-24 h-24 object-cover rounded-md" />}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="marketImage" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none p-2 border rounded-md">
                  <FiImage className="inline-block mr-2" />
                  <span>Upload an image</span>
                  <input id="marketImage" name="marketImage" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400">
              <FiSave className="mr-2" />
              {isLoading ? 'Saving...' : 'Save Market'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditMarketModal;
