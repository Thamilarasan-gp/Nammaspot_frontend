import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Confirm.css";
import axios from "axios";
import {
  Calendar,
  Clock,
  Car,
  CreditCard,
  CheckCircle,
  Edit,
  MapPin,
  DollarSign,
  Shield,
  Zap,
  Camera,
  Users,
  ArrowLeft,
  BadgeCheck,
  Ticket,
} from "lucide-react";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    slotNumbers = [],
    entryTime = "",
    exitTime = "",
    date = "",
    vehicleno = "",
    totalAmount = "0",
    city = "",
  } = location.state || {};

  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePin = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);
  };

  useEffect(() => {
    generatePin();
  }, []);

  let KEY_ID = "rzp_test_CMsB4Ic9wCgo4O";

  const initPayment = (data) => {
    const options = {
      key: KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "NammaSpot Parking",
      description: "Secure Parking Reservation",
      image: "https://nammaspot.com/logo.png",
      order_id: data.id,
      handler: async (response) => {
        try {
          setIsProcessing(true);
          const verifyUrl =
            "https://nammaspot-backend.onrender.com/api/payment/verify";
          const { data } = await axios.post(verifyUrl, response);
          console.log(data);

          await axios.post(
            "https://nammaspot-backend.onrender.com/adddetails",
            {
              slotNumbers,
              entryTime,
              exitTime,
              date,
              vehicleno,
              totalAmount,
              pin,
              city,
            }
          );

          navigate("/pin", { state: { pin, slotNumbers, vehicleno } });
        } catch (error) {
          console.log(error);
          setIsProcessing(false);
        }
      },
      theme: {
        color: "#007AFF",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const orderUrl =
        "https://nammaspot-backend.onrender.com/api/payment/orders";
      const { data } = await axios.post(orderUrl, {
        amount: parseInt(totalAmount * 100),
      });
      initPayment(data.data);
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bc-container">
      <div className="bc-card">
        {/* Header */}
        <div className="bc-header">
          <div className="bc-icon">
            <BadgeCheck size={32} />
          </div>
          <h1>Booking Confirmation</h1>
          <p>Review your parking reservation details</p>
        </div>

        {/* Booking Details */}
        <div className="bc-details">
          <div className="bc-top-content">
            <div className="bc-grid">
              <div className="bc-item-part">
                <div className="bc-item">
                  <div className="bc-item-icon">
                    <MapPin size={30} />
                  </div>
                  <div className="bc-item-content">
                    <span className="bc-label">Location</span>
                    <span className="bc-value">{city}</span>
                  </div>
                </div>

                <div className="bc-item">
                  <div className="bc-item-icon">
                    <Car size={30} />
                  </div>
                  <div className="bc-item-content">
                    <span className="bc-label">Vehicle Number</span>
                    <span className="bc-value">{vehicleno}</span>
                  </div>
                </div>

                <div className="bc-item">
                  <div className="bc-item-icon">
                    <Ticket size={30} />
                  </div>
                  <div className="bc-item-content">
                    <span className="bc-label">Parking Slots</span>
                    <span className="bc-value">{slotNumbers.join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="bc-item-part">
                <div className="bc-item">
                  <div className="bc-item-icon">
                    <Calendar size={30} />
                  </div>
                  <div className="bc-item-content">
                    <span className="bc-label">Date</span>
                    <span className="bc-value">{formatDate(date)}</span>
                  </div>
                </div>

                <div className="bc-item">
                  <div className="bc-item-icon">
                    <Clock size={30} />
                  </div>
                  <div className="bc-item-content">
                    <span className="bc-label">Entry Time</span>
                    <span className="bc-value">{entryTime}</span>
                  </div>
                </div>

                <div className="bc-item">
                  <div className="bc-item-icon">
                    <Clock size={30} />
                  </div>
                  <div className="bc-item-content">
                    <span className="bc-label">Exit Time</span>
                    <span className="bc-value">{exitTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bc-price">
              <h3>Price Breakdown</h3>
              <div className="bc-price-item">
                <span>Parking Fee ({slotNumbers.length} slots)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="bc-price-item">
                <span>Security Fee</span>
                <span>₹0</span>
              </div>
              <div className="bc-price-item">
                <span>Taxes</span>
                <span>₹0</span>
              </div>
              <div className="bc-price-total">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="bc-security">
            <h3>
              <Shield size={30} />
              Security Included
            </h3>
            <div className="bc-features-grid">
              <div className="bc-feature-item">
                <Camera size={50} />
                <span>24/7 CCTV Monitoring</span>
              </div>
              <div className="bc-feature-item">
                <Shield size={40} />
                <span>Secure Access</span>
              </div>
              <div className="bc-feature-item">
                <Users size={40} />
                <span>Security Personnel</span>
              </div>
              <div className="bc-feature-item">
                <Zap size={40} />
                <span>Well-lit Area</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bc-actions">
          <Link to="/booking" state={location.state}>
            <button className="bc-btn-secondary">
              <Edit size={30} />
              Edit Details
            </button>
          </Link>

          <button
            onClick={handlePayment}
            className="bc-btn-primary"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="bc-spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={30} />
                Pay ₹{totalAmount}
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <div className="bc-footer">
          <p>
            <CheckCircle size={30} />
            Your spot will be reserved for 15 minutes during payment processing
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
