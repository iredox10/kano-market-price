
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { databases } from '../appwrite/config';
import { DATABASE_ID, MARKETS_COLLECTION_ID } from '../appwrite/constants';
import { Link } from 'react-router-dom';

// Fix for default Leaflet icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const MapPage = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, MARKETS_COLLECTION_ID);
        setMarkets(response.documents);
      } catch (error) {
        console.error("Failed to fetch markets for map:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  // Default center for the map (centered on Kano)
  const mapCenter = [12.0022, 8.5920];

  return (
    <div className="relative h-screen">
      {loading && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">Loading map...</p>}
      <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markets.map(market => (
          (market.latitude && market.longitude) && (
            <Marker key={market.$id} position={[market.latitude, market.longitude]}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-lg mb-1">{market.name}</h3>
                  <p className="text-sm text-gray-600">{market.description.substring(0, 50)}...</p>
                  <Link to={`/market/${market.slug}`} className="mt-2 inline-block text-green-600 font-semibold hover:underline">
                    Explore Market &rarr;
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
