import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcomepage.css';
import LanguageContext from './LanguageContext';

const welcomeVideo = `${process.env.PUBLIC_URL}/assets/videos/WhatsApp Video 2024-05-23 at 20.13.54_aa8a2eb8.mp4`;

const Welcomepage = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext); // Use LanguageContext to get the current language

    const handleNavigate = () => {
        navigate('/map', { state: { searchValue: search } });
    }

    const content = {
        en: {
            title: "PARKING JUST GETS MORE SIMPLE!!",
            description: "Park with a smile at NammaSpot – where parking meets delight!",
            placeholder: "Search Location",
            buttonText: "Search"
        },
        ta: {
            title: "பார்க்கிங் இன்னும் எளிதாகிறது!!",
            description: 
"நம்ம ஸ்பாட்டில் புன்னகையுடன் பார்க் - மகிழ்ச்சியின் பாதி!",
            placeholder: "இடத்தை தேடுங்கள்",
            buttonText: "தேடு"
        },
        hi: {
            title: "पार्किंग और अधिक सरल हो जाती है!!",
            description: "NammaSpot पर एक मुस्कान के साथ पार्क - जहां पार्किंग खुशी से मिलती है!",
            placeholder: "स्थान खोजें",
            buttonText: "खोजें"
        }
    };

    const { title, description, placeholder, buttonText } = content[language];

    return (
        <div className="welcomepage-container">
            <section id="home" className="user-home-section">
                <div className="ah-overlay">
                    <div className="main-content">
                        <h1 className="text-center">{title}</h1>
                        <p>{description}</p>
                        <div className="input-grouppppss">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={placeholder}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
                            />
                            <button className="btn-signin" onClick={handleNavigate}>{buttonText}</button>
                        </div>
                    </div>
                    <video autoPlay loop muted className="video-background">
                        <source src={welcomeVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </section>
        </div>
    );
}

export default Welcomepage;