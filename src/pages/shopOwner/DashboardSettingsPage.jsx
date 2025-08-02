
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { databases, storage } from '../../appwrite/config';
import { DATABASE_ID, SHOP_OWNERS_COLLECTION_ID, SHOP_LOGOS_BUCKET_ID } from '../../appwrite/constants';
import { ID } from 'appwrite';
import { FiShoppingBag, FiSave, FiTag, FiFileText, FiPhone, FiMessageSquare, FiClock, FiImage } from 'react-icons/fi';
import InfoModal from '../../components/InfoModal';
import ImageWithFallback from '../../components/ImageWithFallback';

const DashboardSettingsPage = () => {
  const { currentUser } = useAuth();
  const [shopInfo, setShopInfo] = useState({
    name: '',
    specialty: '',
    bio: '',
    phone: '',
    whatsapp: '',
    openingHours: '',
    logoFileId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (currentUser) {
      const fetchShopInfo = async () => {
        try {
          const doc = await databases.getDocument(
            DATABASE_ID,
            SHOP_OWNERS_COLLECTION_ID,
            currentUser.$id
          );
          setShopInfo({
            name: doc.name || '',
            specialty: doc.specialty || '',
            bio: doc.bio || '',
            phone: doc.phone || '',
            whatsapp: doc.whatsapp || '',
            openingHours: doc.openingHours || '',
            logoFileId: doc.logoFileId || '',
          });
        } catch (error) {
          console.error("Failed to fetch shop info:", error);
          setModalInfo({ isOpen: true, title: 'Error', message: 'Could not load your shop information.', type: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchShopInfo();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setShopInfo({ ...shopInfo, [e.target.name]: e.target.value });
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
    setIsSaving(true);
    try {
      let newLogoFileId = shopInfo.logoFileId;

      // 1. If a new image is selected, upload it to storage
      if (imageFile) {
        // Optional: Delete the old logo file from storage first
        if (shopInfo.logoFileId) {
          await storage.deleteFile(SHOP_LOGOS_BUCKET_ID, shopInfo.logoFileId);
        }
        const uploadedFile = await storage.createFile(SHOP_LOGOS_BUCKET_ID, ID.unique(), imageFile);
        newLogoFileId = uploadedFile.$id;
      }

      // 2. Prepare the data to be saved in the database
      const dataToSave = {
        ...shopInfo,
        logoFileId: newLogoFileId,
      };

      // 3. Update the shop owner's document in the database
      await databases.updateDocument(
        DATABASE_ID,
        SHOP_OWNERS_COLLECTION_ID,
        currentUser.$id,
        dataToSave
      );

      setModalInfo({ isOpen: true, title: 'Success!', message: 'Your shop information has been updated.', type: 'success' });
    } catch (error) {
      console.error("Error updating shop info:", error);
      setModalInfo({ isOpen: true, title: 'Update Failed', message: 'There was an error saving your information.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading settings...</p>;

  return (
    <>
      <InfoModal {...modalInfo} onClose={() => setModalInfo({ isOpen: false })} />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shop Settings</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Logo Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo</label>
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  fileId={shopInfo.logoFileId}
                  bucketId={SHOP_LOGOS_BUCKET_ID}
                  fallbackText={shopInfo.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none p-2 border rounded-md">
                  <FiImage className="inline-block mr-2" />
                  <span>{imageFile ? "Change image" : "Upload image"}</span>
                  <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
                {imagePreview && <img src={imagePreview} alt="New logo preview" className="w-24 h-24 object-cover rounded-full border-2 border-green-400" />}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input type="text" name="name" id="name" value={shopInfo.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <input type="text" name="specialty" id="specialty" value={shopInfo.specialty} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" name="phone" id="phone" value={shopInfo.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input type="text" name="whatsapp" id="whatsapp" value={shopInfo.whatsapp} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
            <div>
              <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
              <input type="text" name="openingHours" id="openingHours" value={shopInfo.openingHours} onChange={handleChange} placeholder="e.g., Mon - Sat: 8am - 6pm" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">About Your Shop</label>
              <textarea name="bio" id="bio" rows="4" value={shopInfo.bio} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            <div className="text-right pt-4 border-t">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400"
              >
                <FiSave className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DashboardSettingsPage;
