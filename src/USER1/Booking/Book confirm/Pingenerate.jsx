import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import QRCode from "qrcode.react";  // Import the QR code library
import "./Pingenerate.css"; // Import CSS file

const Pin = () => {
  const location = useLocation();
  const { pin } = location.state || {};
  const [recentData, setRecentData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [lastUserName, setLastUserName] = useState('');

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

  return (
    <div className="ticket-container">
      <h1 className="ticket-header">Ticket</h1>
      {recentData && (
        <div className="ticket-details">
        
          <QRCode id="qrcode" value={pin} size={128} /> {/* QR code generation */}
          <b>Token Number: <h6>{pin}</h6></b>
          <b>Location: <h6>{recentData.city}</h6></b>
          <b>Date: <h6>{recentData.date}</h6></b>
          <b>Vehicle Number: <h6>{recentData.vehicleno}</h6></b>
          <b>Entry Time: <h6>{recentData.entryTime}</h6></b>
          <b>Exit Time: <h6>{recentData.exitTime}</h6></b>
          <b>Slot Numbers: <h6>{recentData.slotNumbers.join(', ')}</h6></b>
          <b>Payment Price: <h6>${recentData.totalAmount}</h6></b>
          <Link to="/"><button className="btttn"><h5>OK</h5></button></Link>
        </div>
      )}
     <div id="marque"> 
    <div className="stay-tuned">Note* Make a Screenshot of Your Ticket </div>
</div>

    </div>
    
  );
};

export default Pin;
