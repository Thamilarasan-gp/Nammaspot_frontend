import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder";
import "./USER1/Map.css";
import Navbar from "./USER1/Homepage/Navbar";
import {
  Building,
  Car,
  MapPin,
  AlignLeft,
  Home,
  MessageCircle,
  Calendar, Route
} from "lucide-react";
const Map = () => {
  const [usLoLocations, setUsLoLocations] = useState([]);
  const [usLoFilteredLocations, setUsLoFilteredLocations] = useState([]);
  const [usLoCurrentMarker, setUsLoCurrentMarker] = useState(null);
  const [usLoMarkerInfo, setUsLoMarkerInfo] = useState({});
  const [usLoShowBooking, setUsLoShowBooking] = useState(false);
  const [usLoShowFilter, setUsLoShowFilter] = useState(false);
  const [usLoSearch, setUsLoSearch] = useState("");
  const [usLoMinPrice, setUsLoMinPrice] = useState("");
  const [usLoMaxPrice, setUsLoMaxPrice] = useState("");
  const [usLoMinRating, setUsLoMinRating] = useState(1);
  const [usLoMaxRating, setUsLoMaxRating] = useState(5);
  const usLoMapRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { searchValue } = location.state || { searchValue: "" };

  const usLoDefaultIcon = L.icon({
    iconUrl:
      "https://www.iconpacks.net/icons/2/free-location-map-icon-2956-thumb.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const usLoStatusIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/929/929426.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const usLoHandleNavigate = () => {
    navigate("/booking", { state: { city: usLoMarkerInfo.city } });
  };

  useEffect(() => {
    axios
      .get("https://nammaspot-backend.onrender.com/get")
      .then((res) => {
        setUsLoLocations(res.data);
        setUsLoFilteredLocations(res.data);
        usLoMarkAllLocations(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const leafletMap = L.map("us-lo-map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);
    usLoMapRef.current = leafletMap;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userMarker = L.marker([latitude, longitude], {
            icon: usLoDefaultIcon,
          })
            .addTo(usLoMapRef.current)
            .bindPopup("You are here")
            .openPopup();
          usLoMapRef.current.setView([latitude, longitude], 10);
          setUsLoCurrentMarker(userMarker);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      if (usLoMapRef.current) {
        usLoMapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (searchValue) {
      setUsLoSearch(searchValue);
      usLoHandleSearch(searchValue);
    }
  }, [searchValue]);

  const usLoMarkAllLocations = async (locations) => {
    for (const location of locations) {
      await usLoMarkLocation(location);
    }
  };

  const usLoMarkLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location.locations
        )}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const icon = location.status ? usLoStatusIcon : usLoDefaultIcon;
        L.marker([lat, lon], { icon: icon })
          .addTo(usLoMapRef.current)
          .bindPopup(`<b>${location.locations}</b>`)
          .on("click", () => usLoHandleMarkerClick(location));
      }
    } catch (error) {
      console.error("Error marking location:", error);
    }
  };

  const usLoHandleSearch = async (search) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          search
        )}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const marker = L.marker([lat, lon], { icon: usLoDefaultIcon })
          .addTo(usLoMapRef.current)
          .bindPopup(search)
          .openPopup();
        usLoMapRef.current.setView([lat, lon], 15);
        setUsLoCurrentMarker(marker);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const usLoHandleFormSubmit = (event) => {
    event.preventDefault();
    usLoHandleSearch(usLoSearch);
  };

  const usLoHandleMarkerClick = (location) => {
    setUsLoMarkerInfo(location);
    setUsLoShowBooking(true);
  };

  const usLoToggleFilter = () => {
    setUsLoShowFilter(!usLoShowFilter);
  };

  const usLoHandleFilterSubmit = (event) => {
    event.preventDefault();
    const min = parseFloat(usLoMinPrice);
    const max = parseFloat(usLoMaxPrice);
    const minRate = parseFloat(usLoMinRating);
    const maxRate = parseFloat(usLoMaxRating);

    if (!isNaN(min) && !isNaN(max) && !isNaN(minRate) && !isNaN(maxRate)) {
      const filtered = usLoLocations.filter(
        (loc) =>
          loc.price >= min &&
          loc.price <= max &&
          loc.averagerate >= minRate &&
          loc.averagerate <= maxRate
      );
      setUsLoFilteredLocations(filtered);
      usLoUpdateMapWithFilteredLocations(filtered);
      setUsLoShowFilter(false);
    }
  };

  const usLoUpdateMapWithFilteredLocations = (locations) => {
    if (usLoMapRef.current) {
      usLoMapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          usLoMapRef.current.removeLayer(layer);
        }
      });
      usLoMarkAllLocations(locations);
    }
  };

  const usLoHandleRoute = () => {
    navigate("/routemap", { state: { endLocation: usLoMarkerInfo.city } });
  };

  const usLoHandleReview = () => {
    navigate("/review", { state: { cityd: usLoMarkerInfo.city } });
  };

  return (
    <>
      <Navbar />
      <div className="us-lo-container">
        <div className="us-lo-search-container">
          <form className="us-lo-search-form" onSubmit={usLoHandleFormSubmit}>
            <input
              type="text"
              value={usLoSearch}
              onChange={(e) => setUsLoSearch(e.target.value)}
              placeholder="Search for a location"
              className="us-lo-search-input"
              onKeyPress={(e) =>
                e.key === "Enter" && usLoHandleSearch(usLoSearch)
              }
            />
            <button className="us-lo-search-btn" type="submit">
              Search
            </button>
          </form>
          <button className="us-lo-filter-btn" onClick={usLoToggleFilter}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5" />
            </svg>
          </button>
        </div>

        {usLoShowFilter && (
          <div className="us-lo-filter-container">
            <form
              className="us-lo-filter-form"
              onSubmit={usLoHandleFilterSubmit}
            >
              <h4 className="us-lo-filter-title">Filter By Price</h4>
              <input
                type="number"
                value={usLoMinPrice}
                onChange={(e) => setUsLoMinPrice(e.target.value)}
                placeholder="Min Price"
                className="us-lo-filter-input"
              />
              <input
                type="number"
                value={usLoMaxPrice}
                onChange={(e) => setUsLoMaxPrice(e.target.value)}
                placeholder="Max Price"
                className="us-lo-filter-input"
              />
              <h4 className="us-lo-filter-title">Filter By Ratings</h4>
              <input
                type="number"
                value={usLoMinRating}
                onChange={(e) => setUsLoMinRating(e.target.value)}
                placeholder="Min Rating (1-5)"
                min="1"
                max="5"
                step="0.1"
                className="us-lo-filter-input"
              />
              <input
                type="number"
                value={usLoMaxRating}
                onChange={(e) => setUsLoMaxRating(e.target.value)}
                placeholder="Max Rating (1-5)"
                min="1"
                max="5"
                step="0.1"
                className="us-lo-filter-input"
              />
              <button className="us-lo-apply-btn" type="submit">
                Apply
              </button>
            </form>
          </div>
        )}

        {usLoShowBooking && (
          <div className="us-lo-details-panel">
            <div className="us-lo-info-card">
              <div className="us-lo-title-card-header">
                <p className="us-lo-park-title">BOOK FOR PARK</p>
                <span className="us-lo-route-btn" onClick={usLoHandleRoute}>
                  <Route size={30} />
                  Get Directions
                </span>
              </div>

              <div className="us-lo-info-grid">
                <div className="us-lo-info-item">
                  <MapPin size={30} color="currentColor" strokeWidth={2} />
                  <div>
                    <span className="us-lo-info-label">Place</span>
                    <span className="us-lo-info-value">
                      {usLoMarkerInfo.place}
                    </span>
                  </div>
                </div>

                <div className="us-lo-info-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <div>
                    <span className="us-lo-info-label">Company</span>
                    <span className="us-lo-info-value">
                      {usLoMarkerInfo.company}
                    </span>
                  </div>
                </div>

                <div className="us-lo-info-item">
                  <Building size={30} color="currentColor" strokeWidth={2} />

                  <div>
                    <span className="us-lo-info-label">City</span>
                    <span className="us-lo-info-value">
                      {usLoMarkerInfo.city}
                    </span>
                  </div>
                </div>

                <div className="us-lo-info-item">
                  <Car size={30} color="currentColor" strokeWidth={2} />
                  <div>
                    <span className="us-lo-info-label">Seats Available</span>
                    <span className="us-lo-info-value">
                      {usLoMarkerInfo.seat}
                    </span>
                  </div>
                </div>
              </div>

              <div className="us-lo-price-section">
                <div className="us-lo-price-tag">
                  <span className="us-lo-price-label">Price : </span>
                  <span className="us-lo-price-value">
                    ₹ {usLoMarkerInfo.price}
                  </span>
                </div>

                {usLoMarkerInfo.averagerate && (
                  <div className="us-lo-rating">
                    <div className="us-lo-stars">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={
                            i < Math.floor(usLoMarkerInfo.averagerate)
                              ? "#FFD700"
                              : "none"
                          }
                          stroke={
                            i < Math.floor(usLoMarkerInfo.averagerate)
                              ? "#FFD700"
                              : "#ccc"
                          }
                          strokeWidth="1.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span>
                      {usLoMarkerInfo.averagerate.toFixed(1)} out of 5
                    </span>
                  </div>
                )}
              </div>

              <button className="us-lo-book-btn" onClick={usLoHandleNavigate}>
                <Calendar size={30} />
                BOOK NOW
              </button>

              <div className="us-lo-description">
                <div className="us-lo-section-header">
                  <div className="us-lo-section-title">
                    <AlignLeft size={30} />
                    <h3>Description</h3>
                  </div>
                  <p>{usLoMarkerInfo.des}</p>
                </div>

                <div className="us-lo-section-header">
                  <div className="us-lo-section-title">
                    <Home size={30} />
                    <h3>How to Park</h3>
                  </div>
                  <p>
                    Upon arrival, show parking pass to the attendant for
                    validation
                  </p>
                </div>
              </div>

              <div className="us-lo-review-section">
                <div className="us-lo-section-header">
                  <div className="us-lo-section-title">
                    <MessageCircle size={30} />
                    <h3>Review this Spot</h3>
                  </div>
                  <p>Share your thoughts with other customers</p>
                </div>
                <button className="us-lo-review-btn" onClick={usLoHandleReview}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="12" x2="12" y1="8" y2="16" />
                    <line x1="8" x2="16" y1="12" y2="12" />
                  </svg>
                  Write Your Review
                </button>
              </div>

              {usLoMarkerInfo.reviews && usLoMarkerInfo.reviews.length > 0 && (
                <div className="us-lo-reviews">
                  <div className="us-lo-section-header">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <h3>Reviews</h3>
                  </div>
                  {usLoMarkerInfo.reviews.map((review, index) => (
                    <div key={index} className="us-lo-review-item">
                      <div className="us-lo-review-header">
                        <h4>{review.header}</h4>
                        <div className="us-lo-review-stars">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={i < review.starcount ? "#FFD700" : "none"}
                              stroke={i < review.starcount ? "#FFD700" : "#ccc"}
                              strokeWidth="1.5"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p>{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
         </div>
        )}

        <div id="us-lo-map" className="us-lo-map"></div>
      </div>

      <div className="us-lo-marquee">
        <div className="us-lo-marquee-text">
          Note* Stay Tuned with us - Find Your Perfect Spot!
        </div>
      </div>
    </>
  );
};

export default Map;
