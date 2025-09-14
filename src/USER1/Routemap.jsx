import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import {
  Navigation,
  Clock,
  Car,
  MapPin,
  User,
  Route,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import "./Routemap.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons using Lucide icons
const createCustomIcon = (color, iconType = "default") => {
  // Car icon SVG (simplified version of Lucide's car icon)
  const carSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"></path><path d="M17 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"></path><path d="M5 17H3v-4.2a2 2 0 0 1 .2-.9L7 5h10l3.8 6.9a2 2 0 0 1 .2.9V17h-2"></path><path d="M14 7h-4"></path></svg>`;

  let iconHtml = "";

  switch (iconType) {
    case "user":
      iconHtml = '<i class="us-map-marker-icon user"></i>';
      break;
    case "car":
      iconHtml = `<div class="us-map-car-icon">${carSvg}</div>`;
      break;
    case "destination":
      iconHtml = '<i class="us-map-marker-icon destination"></i>';
      break;
    default:
      iconHtml = '<i class="us-map-marker-icon default"></i>';
  }

  return L.divIcon({
    className: `us-map-custom-marker us-map-${iconType}-marker`,
    html: `
      <div class="us-map-marker-pin" style="background-color: ${color};">
        ${iconHtml}
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
};

function DisplayRoute({
  startCoords,
  endCoords,
  setDistance,
  setTime,
  setRouteData,
}) {
  const map = useMap();

  useEffect(() => {
    if (!startCoords || !endCoords) return;

    const accessToken =
      "pk.eyJ1IjoidGhhbWlsYXJhc2FuZ3AiLCJhIjoiY2x4M214cjRsMTF1NTJpczk5bXJrMWdldSJ9.eWOzqy3c1K2314DXbe5orA";
    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[1]},${startCoords[0]};${endCoords.lng},${endCoords.lat}?geometries=geojson&access_token=${accessToken}`;

    fetch(routeUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch route: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const geojson = data.routes[0].geometry;
        const routeLayer = L.geoJSON(geojson, {
          style: {
            color: "#007AFF",
            weight: 5,
            opacity: 0.8,
          },
        }).addTo(map);

        const distanceInKm = data.routes[0].distance / 1000;
        const durationInSecs = data.routes[0].duration;
        const durationInHours = Math.floor(durationInSecs / 3600);
        const durationInMinutes = Math.floor((durationInSecs % 3600) / 60);

        setDistance(distanceInKm.toFixed(2));
        setTime({ hours: durationInHours, minutes: durationInMinutes });
        setRouteData(data.routes[0]);

        map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
      })
      .catch((error) => {
        alert(`Failed to fetch route: ${error.message}`);
        console.error(error);
      });
  }, [startCoords, endCoords, map, setDistance, setTime, setRouteData]);

  return null;
}

function Routemap() {
  const location = useLocation();
  const { endLocation } = location.state || {};

  const [userLocation, setUserLocation] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setIsLoading(false);
        },
        (error) => {
          setError(
            "Unable to retrieve your location. Please check your location settings."
          );
          setIsLoading(false);
          console.error(error);
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const getCoordinates = async (location) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            location
          )}&format=json`
        );
        const data = await response.json();
        if (data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        return null;
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setError("Unable to find the specified location.");
        return null;
      }
    };

    const fetchEndCoords = async () => {
      if (endLocation) {
        setIsLoading(true);
        const coords = await getCoordinates(endLocation);
        if (coords) {
          setEndCoords(coords);
        } else {
          setError("Unable to find the specified location.");
        }
        setIsLoading(false);
      }
    };

    fetchEndCoords();
  }, [endLocation]);

  return (
    <div className="us-map-container">
      <div className="us-map-overlay-panel">
        <div className="us-map-header">
          <h2>Route Details</h2>
          <div className="us-map-route-summary">
            <div className="us-map-route-line">
              <div className="us-map-location-dot us-map-start-dot">
                <Car size={30} />
              </div>
              <div className="us-map-location-text">
                <span className="us-map-location-label">Your Location</span>
                <span className="us-map-location-address">
                  Current Position
                </span>
              </div>
            </div>

            <div className="us-map-route-line">
              <div className="us-map-location-dot us-map-end-dot">
                <MapPin size={30} />
              </div>
              <div className="us-map-location-text">
                <span className="us-map-location-label">Destination</span>
                <span className="us-map-location-address">
                  {endLocation || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="us-map-info-cards">
          <div className="us-map-info-card">
            <div className="us-map-info-icon">
              <Route size={30} />
            </div>
            <div className="us-map-info-content">
              <h3>Distance</h3>
              <p>{distance ? `${distance} km` : "Calculating..."}</p>
            </div>
          </div>

          <div className="us-map-info-card">
            <div className="us-map-info-icon">
              <Clock size={30} />
            </div>
            <div className="us-map-info-content">
              <h3>Estimated Time</h3>
              <p>
                {time.hours > 0 ? `${time.hours} hr ` : ""}
                {time.minutes > 0 ? `${time.minutes} min` : "Calculating..."}
              </p>
            </div>
          </div>

          <div className="us-map-info-card">
            <div className="us-map-info-icon">
              <Car size={30} />
            </div>
            <div className="us-map-info-content">
              <h3>Route Type</h3>
              <p>Driving</p>
            </div>
          </div>
        </div>

        {routeData && (
          <div className="us-map-directions">
            <h3>
              <Navigation size={30} style={{ marginRight: "8px" }} />
              Directions
            </h3>
            <div className="us-map-steps">
              <p>
                Follow the route on the map. Turn-by-turn navigation is not
                available in this view.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="us-map-error">
            <AlertTriangle size={16} style={{ marginRight: "10px" }} />
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="us-map-main">
        {isLoading && (
          <div className="us-map-loading">
            <Loader2 className="us-map-spinner" size={40} />
            <p>Loading map and route information...</p>
          </div>
        )}

        <MapContainer
          center={userLocation || [0, 0]}
          zoom={userLocation ? 13 : 2}
          className="us-map-leaflet-container"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {userLocation && (
            <Marker
              position={userLocation}
              icon={createCustomIcon("#007AFF", "car")}
            >
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {endCoords && (
            <Marker
              position={[endCoords.lat, endCoords.lng]}
              icon={createCustomIcon("#FF3B30", "destination")}
            >
              <Popup>Your destination</Popup>
            </Marker>
          )}

          {userLocation && endCoords && (
            <DisplayRoute
              startCoords={userLocation}
              endCoords={endCoords}
              setDistance={setDistance}
              setTime={setTime}
              setRouteData={setRouteData}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Routemap;