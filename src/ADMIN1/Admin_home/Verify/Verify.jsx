

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLanguage } from "../../../USER1/Homepage/LanguageContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Verify.css";

const translations = {
  en: {
    verify: "Verify",
    enterPin: "Enter PIN",
    verifyButton: "Verify",
    enterSeats: "Enter seats to free (comma separated)",
    in: "IN",
    out: "Out",
    userDetails: "User Details",
    slotNumbers: "Slot Numbers",
    date: "Date",
    vehicleNumber: "Vehicle Number",
    totalAmount: "Total Amount",
    city: "City",
    successMatch: "Successfully matched",
    noMatch: "No match found",
    slotsFreed: "Slots freed successfully",
    pinNotFound: "PIN not found",
    youAreIn: "YOU ARE IN",
    youAreOut: "YOU ARE OUT",
    loadingError: "Error loading data",
    tokenNumber: "Token Number",
    exitTime: "Exit Time",
    location: "Location",
    scanQrCode: "Scan QR Code",
    scannedData: "Scanned Data",
    freeSlots: "Free Slots",
  },
  ta: {
    verify: "சரிபார்க்கவும்",
    enterPin: "பின் எண் உள்ளிடவும்",
    verifyButton: "சரிபார்க்கவும்",
    enterSeats: "விடுவதற்கான இடங்களை உள்ளிடவும் (கமா பிரித்து)",
    in: "உள்",
    out: "வெளியே",
    userDetails: "பயனர் விவரங்கள்",
    slotNumbers: "இட எண்கள்",
    date: "தேதி",
    vehicleNumber: "வாகன எண்",
    totalAmount: "மொத்த தொகை",
    city: "நகரம்",
    successMatch: "வெற்றிகரமாக பொருந்தியது",
    noMatch: "பொருந்துதல் இல்லை",
    slotsFreed: "இடங்கள் வெற்றிகரமாக விடுவிக்கப்பட்டது",
    pinNotFound: "பின் எண் காணப்படவில்லை",
    youAreIn: "நீங்கள் உள்ளே உள்ளீர்கள்",
    youAreOut: "நீங்கள் வெளியே உள்ளீர்கள்",
    loadingError: "தரவுகளை ஏற்றுவதில் பிழை",
    tokenNumber: "டோக்கன் எண்",
    exitTime: "வெளியேறும் நேரம்",
    location: "இடம்",
    scanQrCode: "QR குறியீட்டை ஸ்கேன் செய்யவும்",
    scannedData: "ஸ்கேன் செய்யப்பட்ட தரவு",
    freeSlots: "இலவச இடங்கள்",
  },
  hi: {
    verify: "सत्यापित करें",
    enterPin: "पिन दर्ज करें",
    verifyButton: "सत्यापित करें",
    enterSeats: "मुक्त करने के लिए सीटें दर्ज करें (अल्पविराम से अलग करें)",
    in: "अंदर",
    out: "बाहर",
    userDetails: "उपयोगकर्ता विवरण",
    slotNumbers: "स्लॉट नंबर",
    date: "तारीख",
    vehicleNumber: "वाहन नंबर",
    totalAmount: "कुल राशि",
    city: "शहर",
    successMatch: "सफलतापूर्वक मेल खाया",
    noMatch: "कोई मेल नहीं मिला",
    slotsFreed: "स्लॉट सफलतापूर्वक मुक्त किए गए",
    pinNotFound: "पिन नहीं मिला",
    youAreIn: "आप अंदर हैं",
    youAreOut: "आप बाहर हैं",
    loadingError: "डेटा लोड करने में त्रुटि",
    tokenNumber: "टोकन संख्या",
    exitTime: "बाहर निकलने का समय",
    location: "स्थान",
    scanQrCode: "QR कोड स्कैन करें",
    scannedData: "स्कैन किया गया डेटा",
    freeSlots: "मुफ्त स्लॉट",
  },
};

const Verify = () => {
  const { language } = useLanguage();
  const [data, setData] = useState([]);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [seatsToFree, setSeatsToFree] = useState("");
  const [matchedDoc, setMatchedDoc] = useState(null);
  const [latestNumber, setLatestNumber] = useState();
  const [otp, setOTP] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [noti, setNoti] = useState("");
  const [scannedData, setScannedData] = useState(null);

  const {
    verify,
    enterPin,
    verifyButton,
    enterSeats,
    in: inButton,
    out,
    userDetails,
    slotNumbers,
    date,
    vehicleNumber,
    totalAmount,
    city,
    successMatch,
    noMatch,
    slotsFreed,
    pinNotFound,
    youAreIn,
    youAreOut,
    loadingError,
    tokenNumber,
    exitTime,
    location,
    scanQrCode,
    scannedData: scannedDataText,
    freeSlots,
  } = translations[language] || translations.en;

  useEffect(() => {
    axios
      .get("https://nammaspot-backend.onrender.com/getpins")
      .then((result) => setData(result.data))
      .catch((err) => {
        console.error(loadingError, err);
        toast.error(loadingError);
      });

    axios
      .get("https://nammaspot-backend.onrender.com/getnumber")
      .then((result) => setLatestNumber(result.data.number))
      .catch((err) => {
        console.error(err);
        toast.error("Error loading latest number");
      });

    axios
      .get("https://nammaspot-backend.onrender.com/getname")
      .then((result) => setEmail(result.data.email))
      .catch((err) => {
        console.log(err);
        toast.error("Error loading email");
      });
  }, [loadingError]);

  const handleVerify = () => {
    // First check if we have scanned data from QR code
    if (scannedData) {
      const pinData = data.find(
        (item) => item.pin === parseInt(scannedData.token)
      );
      if (pinData) {
        setMessage(successMatch);
        setMatchedDoc(pinData);
        console.log(pinData)
        setPin(scannedData.token);
        toast.success(successMatch);
        return;
      }
    }

    // Fall back to manual PIN entry
    const pinData = data.find((item) => item.pin === parseInt(pin));
    if (pinData) {
      setMessage(successMatch);
      setMatchedDoc(pinData);
      toast.success(successMatch);
    } else {
      setMessage(noMatch);
      setMatchedDoc(null);
      toast.error(noMatch);
    }
  };

  const handleOut = () => {
    const pinToUse = scannedData ? scannedData.token : pin;
    const pinData = data.find((item) => item.pin === parseInt(pinToUse));
    if (pinData) {
      axios
        .post("https://nammaspot-backend.onrender.com/freeupslots", {
          pin: parseInt(pinToUse),
          seatsToFree: seatsToFree.split(",").map((seat) => seat.trim()),
        })
        .then(() => {
          setMessage(slotsFreed);
          toast.success(slotsFreed);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error freeing slots");
        });
    } else {
      setMessage(pinNotFound);
      toast.error(pinNotFound);
    }
  };

  const handleIn = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://nammaspot-backend.onrender.com/putnoti", {
        noti: youAreIn,
      });
      sendNotification(youAreIn);
      toast.success(youAreIn);
      console.log("toast");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Error processing IN action");
    }
  };

  const handleOutButton = async () => {
    if (!otpVerified) {
      try {
        await requestOTP();
        setOTPSent(true);
        toast.info("OTP sent successfully");
      } catch (error) {
        console.error("Error requesting OTP:", error);
        toast.error("Error sending OTP");
      }
    } else {
      setNoti(youAreOut);
      try {
        await axios.post("https://nammaspot-backend.onrender.com/putnoti", {
          noti: youAreOut,
        });
        sendNotification(youAreOut);
        toast.success(youAreOut);
        handleOut();
      } catch (error) {
        console.error("Error sending notification:", error);
        toast.error("Error processing OUT action");
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch(
        "https://nammaspot-backend.onrender.com/verifyOTPnew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      const data = await response.json();
      if (data.message === "OTP Verified Successfully") {
        setOTPVerified(true);
        setNoti(youAreOut);
        try {
          await axios.post("https://nammaspot-backend.onrender.com/putnoti", {
            noti: youAreOut,
          });
          sendNotification(youAreOut);
          toast.success("OTP verified successfully");
          handleOut();
        } catch (error) {
          console.error("Error sending notification:", error);
          toast.error("Error processing OUT action");
        }
      } else {
        console.log("Invalid OTP");
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
    }
  };

  const requestOTP = async () => {
    try {
      const response = await fetch(
        "https://nammaspot-backend.onrender.com/reqOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      setMessage(data.message);
      if (data.message === "OTP Sent Successfully") {
        setOTPSent(true);
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setMessage("Failed to request OTP. Please try again later.");
      toast.error("Failed to request OTP");
    }
  };

  const sendNotification = (notificationMessage) => {
    axios
      .post("https://nammaspot-backend.onrender.com/sendNotification", {
        number: latestNumber,
        message: notificationMessage,
      })
      .then((response) => {
        console.log("Notification sent:", response.data);
      })
      .catch((err) => {
        console.error("Error sending notification:", err);
        toast.error("Error sending notification");
      });
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "ad-vf-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const handleScanSuccess = (decodedText) => {
      try {
        // Parse the QR code data
        const parsedData = JSON.parse(decodedText);
        setScannedData(parsedData);
        setPin(parsedData.token);

        // Find matching document
        const pinData = data.find(
          (item) => item.pin === parseInt(parsedData.token)
        );
        if (pinData) {
          console.log(parsedData.token)
          console.log(pinData)  
          setMessage(successMatch);
          setMatchedDoc(pinData);
          toast.success(successMatch);
        } else {
          setMessage(noMatch);
          setMatchedDoc(null);
          toast.error(noMatch);
        }

        // Stop scanning after successful scan
        scanner
          .clear()
          .catch((error) => console.error("Failed to clear scanner", error));
      } catch (error) {
        console.error("Error parsing QR code data:", error);
        setMessage("Invalid QR code format");
        toast.error("Invalid QR code format");
      }
    };

    const handleScanFailure = (error) => {
      console.warn(`QR error = ${error}`);
    };

    scanner.render(handleScanSuccess, handleScanFailure);

    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Failed to clear scanner", error));
    };
  }, [data, successMatch]);

  return (
    <div className="ad-vf-app">
      {/* React Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="ad-vf-body">
        <h1 className="ad-vf-title">{verify}</h1>

        <div className="ad-vf-container">
          <div className="ad-vf-scanner-section">
            <h3 className="ad-vf-section-title">{scanQrCode}</h3>
            <div id="ad-vf-reader" className="ad-vf-reader"></div>
          </div>

          <div className="ad-vf-input-section">
            <h3 className="ad-vf-section-title">{enterPin}</h3>
            <div className="ad-vf-input-group">
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder={enterPin}
                className="ad-vf-input"
              />
              <button
                className="ad-vf-button ad-vf-primary"
                onClick={handleVerify}
              >
                {verifyButton}
              </button>
            </div>

            <div className="ad-vf-input-group">
              <input
                type="text"
                value={seatsToFree}
                onChange={(e) => setSeatsToFree(e.target.value)}
                placeholder={enterSeats}
                className="ad-vf-input"
              />
              <span className="ad-vf-input-note">{freeSlots}</span>
            </div>

            {otpSent && !otpVerified && (
              <div className="ad-vf-otp-section">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  placeholder="Enter OTP"
                  className="ad-vf-input"
                />
                <button
                  className="ad-vf-button ad-vf-secondary"
                  onClick={handleVerifyOTP}
                >
                  Verify OTP
                </button>
              </div>
            )}

            <div className="ad-vf-action-buttons">
              <button className="ad-vf-button ad-vf-in" onClick={handleIn}>
                {inButton}
              </button>
              <button
                className="ad-vf-button ad-vf-out"
                onClick={handleOutButton}
              >
                {out}
              </button>
            </div>

            {message && <div className="ad-vf-message">{message}</div>}
          </div>
        </div>

        {matchedDoc && (
          <div className="ad-vf-details">
            <h3 className="ad-vf-section-title">{userDetails}</h3>
            <div className="ad-vf-detail-grid">
              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{tokenNumber}</span>
                <span className="ad-vf-detail-value">{matchedDoc.pin}</span>
              </div>
              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{slotNumbers}</span>
                <span className="ad-vf-detail-value">
                  {matchedDoc.slotNumbers.join(", ")}
                </span>
              </div>
              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{date}</span>
                <span className="ad-vf-detail-value">{matchedDoc.date}</span>
              </div>
              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{vehicleNumber}</span>
                <span className="ad-vf-detail-value">
                  {matchedDoc.vehicleno}
                </span>
              </div>
              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{exitTime}</span>
                <span className="ad-vf-detail-value">
                  {matchedDoc.entryTime}
                </span>
              </div>
              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{exitTime}</span>
                <span className="ad-vf-detail-value">
                  {matchedDoc.exitTime}
                </span>
              </div>

              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{totalAmount}</span>
                <span className="ad-vf-detail-value">
                  {matchedDoc.totalAmount}
                </span>
              </div>
              <div className="ad-vf-detail-item">
                <span className="ad-vf-detail-label">{city}</span>
                <span className="ad-vf-detail-value">{matchedDoc.city}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;