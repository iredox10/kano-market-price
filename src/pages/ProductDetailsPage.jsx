
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID, PRICE_CONTRIBUTIONS_COLLECTION_ID, PRICE_HISTORY_COLLECTION_ID, PRODUCT_IMAGES_BUCKET_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import PriceDisplay from '../components/PriceDisplay';
import PriceHistoryChart from '../components/PriceHistoryChart';
import ImageWithFallback from '../components/ImageWithFallback';
import SkeletonLoader from '../components/SkeletonLoader';
import OtherSellersTable from '../components/OtherSellersTable'; // Import the new component
import { FiChevronLeft } from 'react-icons/fi';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [shopOwner, setShopOwner] = useState(null);
  const [communityPrice, setCommunityPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productDoc = await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
        setProduct(productDoc);

        const [shopOwnerDoc, contributionsRes, historyRes] = await Promise.all([
          databases.getDocument(DATABASE_ID, SHOP_OWNERS_COLLECTION_ID, productDoc.shopOwnerId),
          databases.listDocuments(DATABASE_ID, PRICE_CONTRIBUTIONS_COLLECTION_ID, [Query.equal('productId', id)]),
          databases.listDocuments(DATABASE_ID, PRICE_HISTORY_COLLECTION_ID, [Query.equal('productid', id), Query.orderDesc('updatedAt')])
        ]);

        setShopOwner(shopOwnerDoc);

        if (contributionsRes.documents.length > 0) {
          const total = contributionsRes.documents.reduce((sum, doc) => sum + doc.price, 0);
          setCommunityPrice(Math.round(total / contributionsRes.documents.length));
        }

        const historyData = {
          daily: historyRes.documents.map(doc => ({ date: new Date(doc.updatedAt).toLocaleDateString(), ownerPrice: doc.price })),
          weekly: [],
          monthly: []
        };
        setPriceHistory(historyData);

      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setProduct(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SkeletonLoader className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <SkeletonLoader className="h-64 w-full rounded-lg" />
              <SkeletonLoader className="h-8 w-3/4 mt-4" />
              <SkeletonLoader className="h-4 w-1/2 mt-2" />
              <SkeletonLoader className="h-20 w-full mt-4" />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <SkeletonLoader className="h-40 w-full rounded-lg" />
              <SkeletonLoader className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The product you are looking for does not exist or may have been removed.</p>
        <Link to="/products" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 font-semibold">
          Back to All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Link to="/products" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
          <FiChevronLeft className="mr-1" />
          Back to All Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image and Description */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <ImageWithFallback
                fileId={product.imageFileId}
                bucketId={PRODUCT_IMAGES_BUCKET_ID}
                fallbackText={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h1 className="text-3xl font-bold text-gray-800 mt-4">{product.name}</h1>
              {shopOwner && (
                <p className="text-md text-gray-500">
                  Sold by <Link to={`/shop/${shopOwner.$id}`} className="text-blue-500 hover:underline">{shopOwner.name}</Link>
                </p>
              )}
              <p className="mt-4 text-gray-700">{product.description}</p>
            </div>
          </div>

          {/* Right Column: Price Info, Chart, and Other Sellers */}
          <div className="lg:col-span-2">
            <PriceDisplay
              ownerPrice={product.ownerPrice}
              communityPrice={communityPrice}
            />
            <PriceHistoryChart priceHistory={priceHistory} />
            <OtherSellersTable
              productName={product.name}
              currentProductId={product.$id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
