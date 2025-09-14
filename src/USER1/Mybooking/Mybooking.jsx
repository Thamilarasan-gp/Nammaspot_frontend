import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Mybooking.css';

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({ upcoming: [], completed: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://nammaspot-backend.onrender.com/getconfirmbo');
      const fetchedBookings = response.data;
      const currentDate = new Date();

      const upcomingBookings = fetchedBookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return !booking.date || bookingDate > currentDate;
      });

      const completedBookings = fetchedBookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return booking.date && bookingDate <= currentDate;
      });

      setBookings({
        upcoming: upcomingBookings,
        completed: completedBookings,
        cancelled: [],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const fetchCancelledBookings = async () => {
    try {
      const response = await axios.get('https://nammaspot-backend.onrender.com/getcancelledbo');
      const cancelledBookings = response.data;
      setBookings((prevBookings) => ({
        ...prevBookings,
        cancelled: cancelledBookings,
      }));
    } catch (error) {
      console.error('Error fetching cancelled bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchCancelledBookings();
  }, []);

  const cancelBooking = async (booking) => {
    try {
      await axios.delete(`https://nammaspot-backend.onrender.com/deleteupcoming/${booking._id}`);
      await axios.post('https://nammaspot-backend.onrender.com/cancellbooking', booking);

      setBookings((prevBookings) => {
        const updatedUpcoming = prevBookings.upcoming.filter((b) => b._id !== booking._id);
        return {
          ...prevBookings,
          upcoming: updatedUpcoming,
          cancelled: [...prevBookings.cancelled, booking],
        };
      });

      console.log(`Cancelled booking with ID: ${booking._id}`);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const navigateToRouteMap = (city) => {
    navigate('/routemap', { state: { endLocation: city } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderBookings = (type) => {
    if (bookings[type].length === 0) {
      return (
        <div className="mb-empty-state">
          <h3>No {type} bookings</h3>
          <p>You don't have any {type} bookings at the moment.</p>
        </div>
      );
    }

    return bookings[type].map((booking) => (
      <div key={booking._id} className={`mb-booking-card mb-booking-${type}`}>
        <div className="mb-booking-header">
          <h3 className="mb-booking-title">
            {type === 'upcoming' ? 'Upcoming Booking' : 
             type === 'completed' ? 'Completed Booking' : 'Cancelled Booking'}
          </h3>
          <span className={`mb-status-badge mb-status-${type}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        
        <div className="mb-booking-details">
          <div className="mb-detail-item">
            <span className="mb-detail-label">Date:</span>
            <span className="mb-detail-value">{formatDate(booking.date)}</span>
          </div>
          <div className="mb-detail-item">
            <span className="mb-detail-label">City:</span>
            <span className="mb-detail-value mb-city-truncate">{booking.city ? booking.city : 'N/A'}</span>
          </div>
          <div className="mb-detail-item">
            <span className="mb-detail-label">Slot:</span>
            <span className="mb-detail-value">
              {booking.slotNumbers && booking.slotNumbers.length > 0 ? 
               booking.slotNumbers.join(', ') : 'N/A'}
            </span>
          </div>
          <div className="mb-detail-item">
            <span className="mb-detail-label">Amount:</span>
            <span className="mb-detail-value mb-amount">
              {booking.totalAmount ? `₹${booking.totalAmount.toFixed(2)}` : 'N/A'}
            </span>
          </div>
        </div>
        
        {type === 'upcoming' && (
          <div className="mb-booking-actions">
            <button className="mb-btn mb-btn-cancel" onClick={() => cancelBooking(booking)}>
              Cancel Booking
            </button>
            <button className="mb-btn mb-btn-route" onClick={() => navigateToRouteMap(booking.city)}>
              Get Directions
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="mb-body">
        <div className="mb-container">
          <div className="mb-loading">
            <div className="mb-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-body">
      <div className="mb-container">
        <div className="mb-header">
          <h1 className="mb-title">My Bookings</h1>
          <p className="mb-subtitle">Manage your upcoming, completed, and cancelled bookings</p>
        </div>
        
        <div className="mb-tabs">
          <button 
            className={`mb-tab ${activeTab === 'upcoming' ? 'mb-tab-active' : ''}`} 
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
            <span className="mb-tab-badge">{bookings.upcoming.length}</span>
          </button>
          <button 
            className={`mb-tab ${activeTab === 'completed' ? 'mb-tab-active' : ''}`} 
            onClick={() => setActiveTab('completed')}
          >
            Completed
            <span className="mb-tab-badge">{bookings.completed.length}</span>
          </button>
          <button 
            className={`mb-tab ${activeTab === 'cancelled' ? 'mb-tab-active' : ''}`} 
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
            <span className="mb-tab-badge">{bookings.cancelled.length}</span>
          </button>
        </div>
        
        <div className="mb-content">
          {activeTab === 'upcoming' && renderBookings('upcoming')}
          {activeTab === 'completed' && renderBookings('completed')}
          {activeTab === 'cancelled' && renderBookings('cancelled')}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;