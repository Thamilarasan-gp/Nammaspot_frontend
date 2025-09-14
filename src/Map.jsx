import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ParkingCircle, Plus, X, Search, Navigation } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminMap = () => {
  const [locations, setLocations] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [eParking, setEParking] = useState(true);
  const [showAddSpotModal, setShowAddSpotModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // Create custom icons using inline SVG
  const createCustomIcon = (isEParking) => {
    const svgContent = isEParking 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="#007AFF" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="#007AFF" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    
    return L.divIcon({
      html: `<div class="ad-map-marker ${isEParking ? 'ad-map-eparking-marker' : ''}">${svgContent}</div>`,
      className: 'ad-map-custom-icon',
      iconSize: [52, 52],
      iconAnchor: [52, 52]
    });
  };

  useEffect(() => {
    const leafletMap = L.map('ad-map-container').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);
    
    mapRef.current = leafletMap;
    leafletMap.on('click', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleMapClick = async (e) => {
    if (currentMarker) {
      mapRef.current.removeLayer(currentMarker);
    }
    
    const { lat, lng } = e.latlng;
    const address = await fetchCityAddress(e.latlng);
    
    const marker = L.marker([lat, lng], { 
      icon: createCustomIcon(eParking)
    }).addTo(mapRef.current);
    
    setCurrentMarker(marker);
    setSelectedLocation({ lat, lng, address });
    setShowAddSpotModal(true);
  };

  const fetchCityAddress = async (latLng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json`);
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unknown location";
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      setSearchResults(data);
      setShowSearchResults(true);
      
      if (data.length > 0) {
        // Zoom to the first result
        const firstResult = data[0];
        mapRef.current.setView([firstResult.lat, firstResult.lon], 13);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleResultClick = (result) => {
    mapRef.current.setView([result.lat, result.lon], 15);
    setSearchQuery(result.display_name);
    setShowSearchResults(false);
    
    // Add a marker at the searched location
    if (currentMarker) {
      mapRef.current.removeLayer(currentMarker);
    }
    
    const marker = L.marker([result.lat, result.lon], { icon: createCustomIcon(false) })
      .addTo(mapRef.current)
      .bindPopup(`<div class="ad-map-search-popup">${result.display_name}</div>`)
      .openPopup();
    
    setCurrentMarker(marker);
  };

  const handleAddSpot = () => {
    if (!selectedLocation) return;
    
    const newLocation = {
      ...selectedLocation,
      isEParking: eParking
    };
    
    setLocations([...locations, newLocation]);
    
    axios.post('https://nammaspot-backend.onrender.com/add', { locations: [...locations, newLocation] })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    
    navigate(`/book?city=${encodeURIComponent(selectedLocation.address)}&eparking=${eParking ? 'on' : 'off'}`);
    
    setShowAddSpotModal(false);
    setSelectedLocation(null);
  };

  const handleCloseModal = () => {
    if (currentMarker) {
      mapRef.current.removeLayer(currentMarker);
      setCurrentMarker(null);
    }
    setShowAddSpotModal(false);
    setSelectedLocation(null);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current.setView([latitude, longitude], 15);
          
          // Add marker at current location
          if (currentMarker) {
            mapRef.current.removeLayer(currentMarker);
          }
          
          const marker = L.marker([latitude, longitude], { icon: createCustomIcon(false) })
            .addTo(mapRef.current)
            .bindPopup('<div class="ad-map-search-popup">Your Current Location</div>')
            .openPopup();
          
          setCurrentMarker(marker);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location. Please check your location settings.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="ad-map-page">
      <div className="ad-map-search-container">
        <div className="ad-map-search-bar">
          <div className="ad-map-search-input-container">
            <Search size={30} className="ad-map-search-icon" />
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="ad-map-search-input"
            />
            {searchQuery && (
              <button 
                className="ad-map-clear-search" 
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
              >
                <X size={30} />
              </button>
            )}
          </div>
          <button className="ad-map-search-btn" onClick={handleSearch}>
            Search
          </button>
          <button className="ad-map-location-btn" onClick={handleCurrentLocation} title="Use current location">
            <Navigation size={30} />
          </button>
        </div>

        {showSearchResults && searchResults.length > 0 && (
          <div className="ad-map-search-results">
            {searchResults.slice(0, 5).map((result, index) => (
              <div 
                key={index} 
                className="ad-map-search-result"
                onClick={() => handleResultClick(result)}
              >
                <MapPin size={30} />
                <span>{result.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="ad-map-container" className="ad-map-container"></div>
      
      {showAddSpotModal && (
        <div className="ad-map-modal-overlay">
          <div className="ad-map-modal">
            <div className="ad-map-modal-header">
              <h2>Add Parking Spot</h2>
              <button className="ad-map-close-btn" onClick={handleCloseModal}>
                <X size={30} />
              </button>
            </div>
            
            <div className="ad-map-modal-body">
              <div className="ad-map-location-info">
                <p className="ad-map-address">{selectedLocation?.address}</p>
                <p className="ad-map-coordinates">
                  Lat: {selectedLocation?.lat.toFixed(4)}, Lng: {selectedLocation?.lng.toFixed(4)}
                </p>
              </div>
              
              <div className="ad-map-option">
                <label className="ad-map-toggle">
                  <span className="ad-map-toggle-label">E-Parking Available</span>
                  <div className="ad-map-toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={eParking} 
                      onChange={() => setEParking(!eParking)} 
                    />
                    <span className="ad-map-slider"></span>
                  </div>
                </label>
                <p className="ad-map-toggle-description">
                  {eParking 
                    ? "This spot has electric vehicle charging capabilities" 
                    : "Standard parking without EV charging"}
                </p>
              </div>
            </div>
            
            <div className="ad-map-modal-footer">
              <button className="ad-map-cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="ad-map-confirm-btn" onClick={handleAddSpot}>
                <Plus size={30} />
                Add Spot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMap;