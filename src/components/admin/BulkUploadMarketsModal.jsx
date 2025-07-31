
import React, { useState } from 'react';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, MARKETS_COLLECTION_ID } from '../../appwrite/constants';
import { ID } from 'appwrite';
import { FiX, FiUpload, FiDownload, FiCheckCircle } from 'react-icons/fi';
import * as XLSX from 'xlsx'; // Using the xlsx library for parsing

const BulkUploadMarketsModal = ({ isOpen, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setUploadStatus('Reading file...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const markets = XLSX.utils.sheet_to_json(worksheet);

        setUploadStatus(`Found ${markets.length} markets. Uploading...`);

        // Create all documents in parallel
        const uploadPromises = markets.map(market => {
          const slug = market.name.toLowerCase().replace(/\s+/g, '-');
          return databases.createDocument(
            DATABASE_ID,
            MARKETS_COLLECTION_ID,
            ID.unique(),
            {
              name: market.name,
              description: market.description,
              location: market.location,
              openingHours: market.openingHours,
              slug: slug,
            }
          );
        });

        await Promise.all(uploadPromises);

        setUploadStatus(`Successfully uploaded ${markets.length} markets!`);
        onSave(); // Trigger a re-fetch on the parent page
        setTimeout(onClose, 2000); // Close modal after 2 seconds on success

      } catch (error) {
        console.error("Failed to upload markets:", error);
        setUploadStatus(`Error: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { name: 'Kantin Kwari Market', description: 'Largest textile market...', location: 'Kano City', openingHours: 'Mon-Sat: 8am-6pm' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Markets");
    XLSX.writeFile(wb, "market_upload_template.xlsx");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Bulk Upload Markets</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload an Excel (.xlsx) file with the following columns: <strong>name, description, location, openingHours</strong>.
          </p>
          <button onClick={downloadTemplate} className="inline-flex items-center text-sm text-green-600 hover:underline font-semibold">
            <FiDownload className="mr-2" /> Download Template
          </button>
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".xlsx, .xls"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          {uploadStatus && (
            <div className="p-3 bg-gray-100 rounded-md text-center text-sm text-gray-700">
              {uploadStatus}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
          <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            <FiUpload className="mr-2" />
            {isUploading ? 'Uploading...' : 'Upload and Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadMarketsModal;
