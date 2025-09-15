import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import QRCode from "qrcode.react";
import "./Pingenerate.css";

const Pin = () => {
  const location = useLocation();
  const { pin } = location.state || {};
  const [recentData, setRecentData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [lastUserName, setLastUserName] = useState('');
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await axios.get('https://nammaspot-backend.onrender.com/getuserdata');
        const userNameResponse = await axios.get('https://nammaspot-backend.onrender.com/getname');

        setMapData(userDataResponse.data);
        setLastUserName(userNameResponse.data.name);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (mapData && lastUserName) {
      axios.post('https://nammaspot-backend.onrender.com/postconfirmbooking', {
        slotNumbers: mapData.slotNumbers,
        name: lastUserName,
        date: mapData.date,
        vehicleno: mapData.vehicleno,
        totalAmount: mapData.totalAmount,
        city: mapData.city
      })
        .then(result => console.log('Data posted successfully', result.data))
        .catch(err => console.log(err));
    }
  }, [mapData, lastUserName]);
  
  useEffect(() => {
    axios.get('https://nammaspot-backend.onrender.com/getuserconfirmdata')
      .then(result => {
        setRecentData(result.data);

        if (result.data) {
          // Send update request after setting recentData
          axios.post('https://nammaspot-backend.onrender.com/updatepins', {
            city: result.data.city,
            slots: result.data.slotNumbers
          })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }, []);

  // Update QR code value when recentData is available
  useEffect(() => {
    if (pin && recentData) {
      const qrData = {
        token: pin,
        slots: recentData.slotNumbers,
        vehicle: recentData.vehicleno,
        location: recentData.city,
        exitTime: recentData.exitTime
      };
      setQrValue(JSON.stringify(qrData));
    }
  }, [pin, recentData]);

  return (
    <div className="us-pin-container">
      <div className="us-pin-card">
        <div className="us-pin-header">
          <div className="us-pin-logo-container">
            <div className="us-pin-logo">NS</div>
            <h1>NammaSpot Ticket</h1>
          </div>
          <div className="us-pin-ribbon">CONFIRMED</div>
        </div>
        
        <div className="us-pin-content">
          <div className="us-pin-details">
            <div className="us-pin-detail-row">
              <div className="us-pin-detail-item">
                <span className="us-pin-detail-label">Token Number</span>
                <span className="us-pin-detail-value us-pin-highlight">{pin}</span>
              </div>
              <div className="us-pin-detail-item">
                <span className="us-pin-detail-label">Date</span>
                <span className="us-pin-detail-value">{recentData?.date || 'N/A'}</span>
              </div>
            </div>
            
            <div className="us-pin-detail-row">
              <div className="us-pin-detail-item">
                <span className="us-pin-detail-label">Location</span>
                <span className="us-pin-detail-value">{recentData?.city || 'N/A'}</span>
              </div>
              <div className="us-pin-detail-item">
                <span className="us-pin-detail-label">Vehicle No</span>
                <span className="us-pin-detail-value">{recentData?.vehicleno || 'N/A'}</span>
              </div>
            </div>
            
            <div className="us-pin-detail-row">
              <div className="us-pin-detail-item">
                <span className="us-pin-detail-label">Entry Time</span>
                <span className="us-pin-detail-value">{recentData?.entryTime || 'N/A'}</span>
              </div>
              <div className="us-pin-detail-item">
                <span className="us-pin-detail-label">Exit Time</span>
                <span className="us-pin-detail-value">{recentData?.exitTime || 'N/A'}</span>
              </div>
            </div>
            
            <div className="us-pin-detail-row">
              <div className="us-pin-detail-item us-pin-full-width">
                <span className="us-pin-detail-label">Slot Numbers</span>
                <span className="us-pin-detail-value us-pin-slot-numbers">
                  {recentData?.slotNumbers?.join(', ') || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="us-pin-detail-row">
              <div className="us-pin-detail-item us-pin-full-width">
                <span className="us-pin-detail-label">Total Amount</span>
                <span className="us-pin-detail-value us-pin-price">₹{recentData?.totalAmount || '0.00'}</span>
              </div>
            </div>
          </div>
          
          <div className="us-pin-qr-section">
            <div className="us-pin-qr-container">
              {qrValue ? (
                <QRCode value={qrValue} size={140} />
              ) : (
                <div className="us-pin-qr-placeholder">Loading QR Code...</div>
              )}
              <p className="us-pin-scan-text">Scan QR code at entry</p>
              <p className="us-pin-qr-info">Contains token & slot info</p>
            </div>
          </div>
        </div>
        
        <div className="us-pin-footer">
          <div className="us-pin-notice">
            <i className="us-pin-icon">📸</i> Please take a screenshot of this ticket
          </div>
          <Link to="/" className="us-pin-confirm-button">
            Done
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pin;