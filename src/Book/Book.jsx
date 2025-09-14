import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { MapPin, Building2, FileText, IndianRupee, Save, ArrowLeft } from 'lucide-react';
import './Book.css';

const AddDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [price, setPrice] = useState("");
  const [seat, setSeat] = useState("");
  const [des, setDes] = useState("");
  const [place, setPlace] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const city = new URLSearchParams(location.search).get('city');
  const status = new URLSearchParams(location.search).get('status') || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    axios.post('https://nammaspot-backend.onrender.com/adddata', { 
      city, place, seat, des, company, price, status 
    })
      .then(res => {
        console.log(res);
        setIsSubmitting(false);
        navigate("/AdminHome");
      })
      .catch(err => {
        console.log(err);
        setIsSubmitting(false);
        alert('Error saving data. Please try again.');
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="ad-slt-body">
      <div className="ad-slt-container">
        <div className="ad-slt-card">
          <div className="ad-slt-header">
            <button className="ad-slt-back-btn" onClick={handleGoBack}>
              <ArrowLeft size={30} />
            </button>
            <h2 className="ad-slt-title">Add Parking Spot Details</h2>
            <div className="ad-slt-city-badge">
              <MapPin size={30} />
              <span>{city}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="ad-slt-form">
            <div className="ad-slt-form-group">
              <label htmlFor="place" className="ad-slt-label">
                <MapPin size={30} />
                <span>Place Name</span>
              </label>
              <input 
                type="text" 
                id="place" 
                name="place" 
                className="ad-slt-input" 
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Enter specific place name or landmark"
              />
            </div>

            <div className="ad-slt-form-group">
              <label htmlFor="company" className="ad-slt-label">
                <Building2 size={30} />
                <span>Company Name</span>
              </label>
              <input 
                required 
                type="text" 
                id="company" 
                name="company" 
                className="ad-slt-input" 
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company or parking lot name"
              />
            </div>

            <div className="ad-slt-form-group">
              <label htmlFor="description" className="ad-slt-label">
                <FileText size={30} />
                <span>Description</span>
              </label>
              <textarea 
                required 
                id="description" 
                name="description" 
                className="ad-slt-textarea" 
                onChange={(e) => setDes(e.target.value)}
                placeholder="Describe the parking facility, amenities, etc."
                rows="3"
              />
            </div>

            <div className="ad-slt-form-row">
              <div className="ad-slt-form-group ad-slt-form-group-half">
                <label htmlFor="seats" className="ad-slt-label">
                  <FileText size={30} />
                  <span>Available Spaces</span>
                </label>
                <input 
                  type="number" 
                  id="seats" 
                  name="seats" 
                  required 
                  className="ad-slt-input" 
                  onChange={(e) => setSeat(e.target.value)}
                  min="1"
                  placeholder="0"
                />
              </div>

              <div className="ad-slt-form-group ad-slt-form-group-half">
                <label htmlFor="price" className="ad-slt-label">
                  <IndianRupee size={30} />
                  <span>Price per Hour (₹)</span>
                </label>
                <input 
                  required 
                  type="number" 
                  id="price" 
                  name="price" 
                  className="ad-slt-input" 
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  step="5"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="ad-slt-feature-tag">
              <div className={`ad-slt-feature ${status ? 'ad-slt-feature-active' : ''}`}>
                <span>⚡ E-Parking {status ? 'Available' : 'Not Available'}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`ad-slt-save-btn ${isSubmitting ? 'ad-slt-saving' : ''}`} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="ad-slt-spinner"></div>
              ) : (
                <>
                  <Save size={30} />
                  <span>Save Parking Spot</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDetailsForm;