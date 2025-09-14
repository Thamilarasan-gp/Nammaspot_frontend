import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../USER1/Homepage/LanguageContext';
import './Profile.css';

const translations = {
  en: {
    myProfile: "My Profile",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    update: "Save ",
    changePassword: "Change Password",
    mobile: "Mobile Number",
    editPhoto: "Change Photo",
    profileUpdated: "Profile updated successfully!",
    personalInfo: "Personal Information",
    accountSettings: "Account Settings"
  },
  ta: {
    myProfile: "எனது சுயவிவரம்",
    firstName: "முதல் பெயர்",
    lastName: "கடைசி பெயர்",
    email: "மின்னஞ்சல்",
    update: "மேம்படுத்த",
    changePassword: "கடவுச்சொல்லை மாற்றவா",
    mobile: "மின்னஞ்சல்",
    editPhoto: "புகைப்படத்தைத் திருத்து",
    profileUpdated: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    personalInfo: "தனிப்பட்ட தகவல்",
    accountSettings: "கணக்கு அமைப்புகள்"
  },
  hi: {
    myProfile: "मेरी प्रोफ़ाइल",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    email: "ईमेल",
    update: "अपडेट करें",
    changePassword: "पासवर्ड बदलें",
    mobile: "पासवर्ड बदलें",
    editPhoto: "फोटो संपादित करें",
    profileUpdated: "प्रोफाइल सफलतापूर्वक अपडेट की गई!",
    personalInfo: "व्यक्तिगत जानकारी",
    accountSettings: "खाता सेटिंग्स"
  }
};

const ProfilePage = () => {
  const { language } = useLanguage();
  const [userData, setUserData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem('profileImage') || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QAKhABAAICAAMGBwEBAAAAAAAAAAECAxEhMUEEEiM0YXEiUVJigZGxQhT/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAAAAAAAAAAAAAAAAAAAAACJmI5qWyfT+2fMGk5I6QjxJ9FAFu/ZPiT6KANYyRPONLRMTyYETrkDoGdL74S0AAAAAAAAAAAZXvvh0WyW1whkAAACJmIjczEQCRTxcf1wtWYtG4mJgEgAL4764TyUAdApjtuNdVwAAAAAAAVyT8IMpnc7QAAAM82Xw44eZxWtN53adytmt38kzPSdKAJra1Z3WdSgVHdhyxkr90c2jgw17uWs+unf1RQAE1nUw3c7XHO4BcAAAAABnl5Q0Z5egMwAAAedbzW95Qvmr3MkxPWdqKAAia+aPd6Lgw172SservlFAAGmLlLNpi5yDQAAAAABTLHw/ldW8broGIAAAM82PxI4eaOTitWazq0TEu+16V81qx+VJy4bRq1qz+AcSa1m06rG3Vvs32rVy4axqLREewJw4ox1+6ebRSuSlvLes/lcAABpi5Szb1jVQSAAAAAAADG8an0Vb2jvRphManUgieEblyZc9rzMUmYr/Wna76iKR14y5QAFQAAbYs80nV5ma/yiA9GJ3G44pc/ZL/DNflydERudQirY67tvpDZWsahYAAAAAAAABW1e96SsA8vtcTGadxwYvXy4qZK6vG/k4svY7140+KPl1ByiZiYnUxMT6oVAAATWJtOqxMz6OnF2O9uN57sfLqDPsm5zRERPJ6NK6gx46Y66rGl0UAAAAAAAAAAAAABFqxbnET7sbdlw24zSI9m4Dn/AOPD9M/tNey4Y/x++LcBWtYrGqxER6LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q=='
  );

  useEffect(() => {
    axios.get('https://nammaspot-backend.onrender.com/getname')
      .then(result => {
        const fullName = result.data.name.split(' ');
        const slicedPassword = result.data.password.slice(0, 4);
        console.log(result.data)
        setUserData({
          id: result.data._id,
          firstName: fullName[0],
          lastName: fullName[1] || '',
          email: result.data.email,
          password: slicedPassword,
          password: slicedPassword,
          mobile: result.data.number,
        });
      })
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://nammaspot-backend.onrender.com/updateprofile', userData)
      .then(result => {
        setMessage(translations[language].profileUpdated);
        setMessageType('success');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => {
        console.log(err);
        setMessage('Error updating profile');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="us-prof-body">
      <div className="us-prof-container">
        <div className="us-prof-header">
          <h1 className="us-prof-title">{translations[language].myProfile}</h1>
          <p className="us-prof-subtitle">{translations[language].personalInfo}</p>
        </div>

        <div className="us-prof-card">
          {message && (
            <div className={`us-prof-message us-prof-message-${messageType}`}>
              {message}
            </div>
          )}

          <div className="us-prof-content">
            <div className="us-prof-image-section">
              <div className="us-prof-image-container">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="us-prof-image" 
                />
                <div className="us-prof-image-overlay">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    id="us-prof-image-input" 
                  />
                  <label htmlFor="us-prof-image-input" className="us-prof-image-edit-btn">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z" fill="white"/>
                    </svg>
                  </label>
                </div>
              </div>
              <p className="us-prof-image-text">{translations[language].editPhoto}</p>
            </div>

            <div className="us-prof-form-section">
              <div className="us-prof-form-header">
                <h2>{translations[language].accountSettings}</h2>
                {!isEditing ? (
                  <button className="us-prof-edit-btn" onClick={toggleEdit}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z" fill="currentColor"/>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button className="us-prof-cancel-btn" onClick={toggleEdit}>
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="us-prof-form">
                <div className="us-prof-form-grid">
                  <div className="us-prof-input-group">
                    <label htmlFor="us-prof-first-name" className="us-prof-label">
                      {translations[language].firstName}
                    </label>
                    <input
                      type="text"
                      id="us-prof-first-name"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      className="us-prof-input"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="us-prof-input-group">
                    <label htmlFor="us-prof-last-name" className="us-prof-label">
                      {translations[language].lastName}
                    </label>
                    <input
                      type="text"
                      id="us-prof-last-name"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      className="us-prof-input"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="us-prof-input-group">
                  <label htmlFor="us-prof-email" className="us-prof-label">
                    {translations[language].email}
                  </label>
                  <input
                    type="email"
                    id="us-prof-email"
                    name="email"
                    value={userData.email}
                    readOnly
                    className="us-prof-input us-prof-input-readonly"
                  />
                </div>

                <div className="us-prof-input-group">
                  <label htmlFor="us-prof-password" className="us-prof-label">
                    {translations[language].changePassword}
                  </label>
                  <input
                    type="password"
                    id="us-prof-password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className="us-prof-input"
                    placeholder="Enter new password"
                    disabled={!isEditing}
                  />
                </div>
                <div className="us-prof-input-group">
                  <label htmlFor="us-prof-password" className="us-prof-label">
                    {translations[language].mobile}
                  </label>
                  <input
                    type="number"
                    id="us-prof-password"
                    name="mobile"
                    value={userData.mobile}
                    onChange={handleChange}
                    className="us-prof-input"
                    placeholder="Enter new password"
                    disabled={!isEditing}
                  />
                </div>
                <div className='us-prof-btn-container'>
                  
                {isEditing && (
                  <button type="submit" className="us-prof-submit-btn">
                    {translations[language].update}
                  </button>
                )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;