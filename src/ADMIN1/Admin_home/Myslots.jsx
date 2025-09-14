import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  MapPin,
  Building,
  DollarSign,
  Map,
  Info,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Calendar,
  User,
  Sliders,
  CheckCircle,
  AlertCircle,
  Star,
  Grid,
  List,
} from "lucide-react";
import "./Myslots.css";

const Myslot = () => {
  const [slotsData, setSlotsData] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    locations: "",
    city: "",
    seat: "",
    place: "",
    company: "",
    price: "",
    des: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    company: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchSlotsData();
  }, []);

  useEffect(() => {
    filterAndSortSlots();
  }, [slotsData, searchTerm, filters, sortBy]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const fetchSlotsData = async () => {
    try {
      const response = await axios.get(
        "https://nammaspot-backend.onrender.com/getmapslots"
      );
      setSlotsData(response.data);
      showNotification("Slots loaded successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Error loading slots", "error");
    }
  };

  const filterAndSortSlots = () => {
    let result = [...slotsData];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (slot) =>
          slot.locations.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slot.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slot.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slot.place.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.city) {
      result = result.filter((slot) => slot.city === filters.city);
    }

    if (filters.company) {
      result = result.filter((slot) => slot.company === filters.company);
    }

    if (filters.minPrice) {
      result = result.filter(
        (slot) => Number(slot.price) >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      result = result.filter(
        (slot) => Number(slot.price) <= Number(filters.maxPrice)
      );
    }

    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "city") {
      result.sort((a, b) => a.city.localeCompare(b.city));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.locations.localeCompare(b.locations));
    }

    setFilteredSlots(result);
    setCurrentPage(1);
  };

  const handleEdit = (slot) => {
    setEditData({
      id: slot._id,
      locations: slot.locations,
      city: slot.city,
      seat: slot.seat,
      place: slot.place,
      company: slot.company,
      price: slot.price,
      des: slot.des,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://nammaspot-backend.onrender.com/getmapslots/${editData.id}`,
        editData
      );
      fetchSlotsData();
      setEditData({
        id: "",
        locations: "",
        city: "",
        seat: "",
        place: "",
        company: "",
        price: "",
        des: "",
      });
      showNotification("Slot updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      showNotification("Error updating slot", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await axios.delete(
          `https://nammaspot-backend.onrender.com/getmapslots/${id}`
        );
        setSlotsData(slotsData.filter((slot) => slot._id !== id));
        showNotification("Slot deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        showNotification("Error deleting slot", "error");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      minPrice: "",
      maxPrice: "",
      company: "",
    });
    setSearchTerm("");
    setSortBy("");
    showNotification("Filters cleared");
  };

  // Get current slots for pagination
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = filteredSlots.slice(indexOfFirstSlot, indexOfLastSlot);
  const totalPages = Math.ceil(filteredSlots.length / slotsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get unique values for filter dropdowns
  const cities = [...new Set(slotsData.map((slot) => slot.city))];
  const companies = [...new Set(slotsData.map((slot) => slot.company))];

  return (
    <div className="ad-ms-container">
      {notification.show && (
        <div
          className={`ad-ms-notification ad-ms-notification-${notification.type}`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={30} />
          ) : (
            <AlertCircle size={30} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="ad-ms-header">
        <h1 className="ad-ms-title">
          <MapPin size={32} />
          My Parking Slots
        </h1>
        <div className="ad-ms-header-actions">
          <div className="ad-ms-view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={30} />
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              <List size={30} />
            </button>
          </div>
        </div>
      </div>

      <div className="ad-ms-controls">
        <div className="ad-ms-search-container">
          <div className="ad-ms-search">
            <Search size={30} />
            <input
              type="text"
              placeholder="Search by location, city, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="ad-ms-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Sliders size={30} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="ad-ms-controls-right">
          <select
            className="ad-ms-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="city">City</option>
          </select>

          <button className="ad-ms-add-button">
            <Plus size={30} />
            Add New Slot
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="ad-ms-filters-panel">
          <div className="ad-ms-filters-header">
            <h3>Filter Slots</h3>
            <button onClick={clearFilters} className="ad-ms-clear-all">
              Clear All
            </button>
          </div>

          <div className="ad-ms-filter-grid">
            <div className="ad-ms-filter-group">
              <label>City</label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="ad-ms-filter-group">
              <label>Company</label>
              <select
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div className="ad-ms-filter-group">
              <label>Min Price</label>
              <div className="ad-ms-price-input">
                <DollarSign size={30} />
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                />
              </div>
            </div>

            <div className="ad-ms-filter-group">
              <label>Max Price</label>
              <div className="ad-ms-price-input">
                <DollarSign size={30} />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ad-ms-stats">
        <p>
          {filteredSlots.length} {filteredSlots.length === 1 ? "slot" : "slots"}{" "}
          found
        </p>
        {Object.values(filters).some((filter) => filter !== "") ||
        searchTerm ? (
          <button onClick={clearFilters} className="ad-ms-clear-filters-btn">
            <X size={30} />
            Clear filters
          </button>
        ) : null}
      </div>

      <div className={`ad-ms-slots-${viewMode}`}>
        {currentSlots.length > 0 ? (
          currentSlots.map((slot) => (
            <div key={slot._id} className="ad-ms-slot-card">
              <div className="ad-ms-slot-image">
                <div className="ad-ms-slot-price">
                  ${slot.price}
                  <span>/hour</span>
                </div>
                <div className="ad-ms-slot-featured">
                  <Star size={25} fill="currentColor" />
                  Verified
                </div>
              </div>

              <div className="ad-ms-slot-content">
                <div className="ad-ms-slot-header">
                  <h3 className="ad-ms-slot-title">{slot.locations}</h3>
                  <span className="ad-ms-slot-status">Available</span>
                </div>

                <div className="ad-ms-slot-location">
                  <MapPin size={30} />
                  <span>
                    {slot.city}, {slot.place}
                  </span>
                </div>

                <div className="ad-ms-slot-details">
                  <div className="ad-ms-slot-detail">
                    <Building size={30} />
                    <span>{slot.company}</span>
                  </div>

                  <div className="ad-ms-slot-detail">
                    <User size={30} />
                    <span>Seat: {slot.seat}</span>
                  </div>
                </div>

                {/* {slot.des && (
                  <div className="ad-ms-slot-description">
                    <Info size={30} />
                    <span>{slot.des}</span>
                  </div>
                )} */}

                <div className="ad-ms-slot-actions">
                  <button
                    className="ad-ms-edit-btn"
                    onClick={() => handleEdit(slot)}
                  >
                    <Edit size={30} />
                    Edit
                  </button>
                  <button
                    className="ad-ms-delete-btn"
                    onClick={() => handleDelete(slot._id)}
                  >
                    <Trash2 size={30} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="ad-ms-no-slots">
            <div className="ad-ms-no-slots-content">
              <Map size={48} />
              <h3>No parking slots found</h3>
              <p>
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <button onClick={clearFilters}>Clear all filters</button>
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="ad-ms-pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="ad-ms-pagination-btn"
          >
            <ChevronLeft size={30} />
            Previous
          </button>

          <div className="ad-ms-pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`ad-ms-pagination-btn ${
                    currentPage === number ? "active" : ""
                  }`}
                >
                  {number}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ad-ms-pagination-btn"
          >
            Next
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      {editData.id && (
        <div className="ad-ms-edit-modal">
          <div className="ad-ms-edit-form">
            <div className="ad-ms-edit-header">
              <h2>
                <Edit size={30} />
                Edit Parking Slot
              </h2>
              <button
                onClick={() =>
                  setEditData({
                    id: "",
                    locations: "",
                    city: "",
                    seat: "",
                    place: "",
                    company: "",
                    price: "",
                    des: "",
                  })
                }
                className="ad-ms-close-btn"
              >
                <X size={30} />
              </button>
            </div>

            <div className="ad-ms-form-grid">
              <div className="ad-ms-input-group">
                <label>Location Name</label>
                <div className="ad-ms-input-with-icon">
                  <MapPin size={30} />
                  <input
                    type="text"
                    name="locations"
                    value={editData.locations}
                    onChange={handleInputChange}
                    placeholder="Enter location name"
                  />
                </div>
              </div>

              <div className="ad-ms-input-group">
                <label>City</label>
                <div className="ad-ms-input-with-icon">
                  <MapPin size={30} />
                  <input
                    type="text"
                    name="city"
                    value={editData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="ad-ms-input-group">
                <label>Seat Number</label>
                <div className="ad-ms-input-with-icon">
                  <User size={30} />
                  <input
                    type="number"
                    name="seat"
                    value={editData.seat}
                    onChange={handleInputChange}
                    placeholder="Enter seat number"
                  />
                </div>
              </div>

              <div className="ad-ms-input-group">
                <label>Place/Address</label>
                <div className="ad-ms-input-with-icon">
                  <Map size={30} />
                  <input
                    type="text"
                    name="place"
                    value={editData.place}
                    onChange={handleInputChange}
                    placeholder="Enter place or address"
                  />
                </div>
              </div>

              <div className="ad-ms-input-group">
                <label>Company</label>
                <div className="ad-ms-input-with-icon">
                  <Building size={30} />
                  <input
                    type="text"
                    name="company"
                    value={editData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="ad-ms-input-group">
                <label>Price ($/hour)</label>
                <div className="ad-ms-input-with-icon">
                  <DollarSign size={30} />
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price per hour"
                  />
                </div>
              </div>
            </div>

            <div className="ad-ms-input-group">
              <label>Description</label>
              <div className="ad-ms-input-with-icon">
                <Info size={30} />
                <input
                  type="text"
                  name="des"
                  value={editData.des}
                  onChange={handleInputChange}
                  placeholder="Enter description (optional)"
                />
              </div>
            </div>

            <div className="ad-ms-form-actions">
              <button
                className="ad-ms-cancel-btn"
                onClick={() =>
                  setEditData({
                    id: "",
                    locations: "",
                    city: "",
                    seat: "",
                    place: "",
                    company: "",
                    price: "",
                    des: "",
                  })
                }
              >
                Cancel
              </button>
              <button className="ad-ms-update-btn" onClick={handleUpdate}>
                <Save size={30} />
                Update Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myslot;
