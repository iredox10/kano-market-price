
// src/components/ShopOwnerCard.js
// A reusable card to display shop owner information.

import React from 'react';
import { Link } from 'react-router-dom';

const ShopOwnerCard = ({ owner }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transform hover:shadow-xl transition-shadow duration-300">
    <img src={owner.logo} alt={owner.name} className="w-16 h-16 rounded-full border-2 border-green-500" />
    <div>
      <h3 className="font-bold text-lg text-gray-800">{owner.name}</h3>
      <p className="text-gray-600">{owner.specialty}</p>
      <Link to={`/shop/${owner.id}`} className="text-sm text-blue-500 hover:underline mt-1 inline-block">View Products</Link>
    </div>
  </div>
);

export default ShopOwnerCard;
