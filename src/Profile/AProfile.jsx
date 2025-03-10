import React, { useState, useEffect } from 'react';
import './AProfile.css';
import axios from 'axios';

const AProfilePage = () => {
    const [userData, setUserData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        pass: '',
    });
    const [message, setMessage] = useState('');
    const [profileImage, setProfileImage] = useState(
        localStorage.getItem('profileImage') || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QAKhABAAICAAMGBwEBAAAAAAAAAAECAxEhMUEEEhMyYXEiUVJigZGxQhT/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAAAAAAAAAAAAAAAAAAAAACJmI5qWyfT+2fMGk5I6QjxJ9FAFu/ZPiT6KANYyRPONLRMTyYETrkDoGdL74S0AAAAAAAAAAAZXvvh0WyW1whkAAACJmIjczEQCRTxcf1wtWYtG4mJgEgAL4764TyUAdApjtuNdVwAAAAAAAVyT8IMpnc7QAAAM82Xw44eZxWtN53adytmt38kzPSdKAJra1Z3WdSgVHdhyxkr90c2jgw27uWs+unf1RQAE1nUw3c7XHO4BcAAAAABnl5Q0Z5egMwAAAedbzW95Qvmr3MkxPWdqKAAia+aPd6Lgw172SservlFAAGmLlLNpi5yDQAAAAABTLHw/ldW8broGIAAAM82PxI4eaOTitWazq0TEu+16V81qx+VJy4bRq1qz+AcSa1m06rG3Vvs32rVy4axqLREewJw4ox1+6ebRSuSlvLes/lcAABpi5Szb1jVQSAAAAAAADG8an0Vb2jvRphManUgieEblyZc9rzMUmYr/Wna76iKR14y5QAFQAAbYs80nV5ma/xiA9GJ3G44pc/ZL/DNflydERudQirY67tvpDZWsahYAAAAAAAABW1e96SsA8vtcTGadxwYvXy4qZK6vG/k4svY7140+KPl1ByiZiYnUxMT6oVAAATWJtOqxMz6OnF2O9uN57sfLqDPsm5zRERPJ6NK6gx46Y66rGl0UAAAAAAAAAAAAABFqxbnET7sbdlw24zSI9m4Dn/AOPD9M/tNey4Y/x++LcBWtYrGqxER6LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q=='
    ); // Initialize with default base64 image or from localStorage
    useEffect(() => {
        axios.get('http://localhost:3001/getaname')
            .then(result => {
                const fullName = result.data.name.split(' ');
                
                setUserData({
                    id: result.data._id,
                    firstName: fullName[0],
                    lastName: fullName[1] || '',
                    email: result.data.email,
                    pass: result.data.pass.slice(0, 4), // Slice password to 4 characters
                });
            })
            .catch(err => console.log(err));
    
        const storedImage = localStorage.getItem('anotherProfileImageKey');
        if (storedImage) {
            setProfileImage(storedImage);
        }
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
        axios.post('http://localhost:3001/updateaprofile', userData)
            .then(result => {
                setMessage('Profile updated successfully!');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            })
            .catch(err => console.log(err));
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfileImage(base64String);
                localStorage.setItem('anotherProfileImageKey', base64String); // Store image in localStorage under a different key
            };
            reader.readAsDataURL(file);
        }
    };
    
return (
    <div className="bodyprofile">
        <div className="profile-container">
            <main className="profile-main-content">
                <section className="profile-profile-section">
                    <h2>My Profile</h2>
                    {message && <div className="success-message">{message}</div>}
                    <div className="profile-img-section">
                        <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="profile-img" 
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            style={{ display: 'none' }} 
                            id="profile-image-input" 
                        />
                        <button 
                            className="profile-edit-button" 
                            onClick={() => document.getElementById('profile-image-input').click()}
                        >
                            Edit Photo
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="profile-input-group">
                            <label htmlFor="first-name">First Name</label>
                            <input
                                type="text"
                                id="first-name"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                      
                        <div className="profile-input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userData.email}
                                readOnly
                            />
                        </div>
                        <div className="profile-input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="pass"
                                value={userData.pass}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="profile-save-btn">Update</button>
                    </form>
                </section>
            </main>
        </div>
    </div>
);


    return (
        <div className="bodyprofile">
            <div className="profile-container">
                <main className="profile-main-content">
                    <section className="profile-profile-section">
                        <h2>My Profile</h2>
                        {message && <div className="success-message">{message}</div>}
                        <div className="profile-img-section">
                            <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="profile-img" 
                            />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }} 
                                id="profile-image-input" 
                            />
                            <button 
                                className="profile-edit-button" 
                                onClick={() => document.getElementById('profile-image-input').click()}
                            >
                                Edit Photo
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="profile-input-group">
                                <label htmlFor="first-name">First Name</label>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-input-group">
                                <label htmlFor="last-name">Last Name</label>
                                <input
                                    type="text"
                                    id="last-name"
                                    name="lastName"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={userData.email}
                                    readOnly
                                />
                            </div>
                            <div className="profile-input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="pass"
                                    value={userData.pass}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="profile-save-btn">Update</button>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AProfilePage;
