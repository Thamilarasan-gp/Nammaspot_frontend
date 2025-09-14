import React, { useEffect, useState, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS for styling
import './ImgSlider.css';
import { useLanguage } from './LanguageContext';

const translations = {
  en: {
    smarterWay: "The smarter way to park",
    description: "ParkMobile puts the power to park in your hands. Whether you're looking for a spot now or reserving a spot for later, ParkMobile has you covered.",
    learnMore: "Learn how it works",
    search: "Search",
    searchDesc: "Search for all available parking options closest to your destination.",
    book: "Book",
    bookDesc: "Pre-book the perfect parking spot & Pay for selected hours using convenient payment options.",
    park: "Park",
    parkDesc: "Navigate to your parking spot, Park your vehicle and enjoy stress-free journey."
  },
  ta: {
    smarterWay: "பார்க்க சிரம்பட்ட வழி",
    description: "பார்க்மொபைல் பார்க் செய்ய உங்களுக்கு சக்தியை கைகளில் வைத்து கொடுக்கிறது. நீங்கள் இப்போது ஒரு இடம் தேடுகிறீர்களா அல்லது பின்னர் ஒரு இடத்தை முன்பதிவு செய்கிறீர்களா, பார்க்மொபைல் உங்களை கவனித்துக்கொள்கிறது.",
    learnMore: "இது எப்படி வேலை செய்கிறது?",
    search: "தேடு",
    searchDesc: "உங்கள் இலக்கத்திற்கு அருகிலுள்ள அனைத்து கிடைக்கக்கூடிய நிறுத்துமிட விருப்பங்களையும் தேடுங்கள்.",
    book: "பதிவு செய்க",
    bookDesc: "சரியான நிறுத்து முன்பதிவு செய்து, விரைவான கட்டணத்துடன் செலுத்து",
    park: "நிறுத்து",
    parkDesc: "உங்கள் நிறுத்துமிடத்திற்கு வழிநடத்துங்கள், உங்கள் வாகனத்தை நிறுத்துங்கள் மற்றும் சிரமமில்லாத பயணத்தை அனுபவிக்குங்கள்."
  },
  hi: {
    smarterWay: "स्मार्ट तरीके से पार्क करें",
    description: "पार्कमोबाइल पार्क करने की शक्ति आपके हाथों में रखता है। चाहे आप अभी स्थान ढूंढ रहे हों या बाद में एक स्थान आरक्षित कर रहे हों, पार्कमोबाइल ने आपको कवर किया है।",
    learnMore: "जानें कि यह कैसे काम करता है",
    search: "खोज",
    searchDesc: "अपने गंतव्य के सबसे निकट उपलब्ध सभी पार्किंग विकल्पों को खोजें।",
    book: "बुक",
    bookDesc: "सही पार्किंग स्थान पहले से बुक करें और सुविधाजनक भुगतान विकल्पों का उपयोग करके चयनित घंटों के लिए भुगतान करें।",
    park: "पार्क",
    parkDesc: "अपने पार्किंग स्थान पर नेविगेट करें, अपने वाहन को पार्क करें और बिना तनाव की यात्रा का आनंद लें।"
  }
};

const ImgSlider = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [initialHover, setInitialHover] = useState(false);

  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

  const handleHover = () => {
    setInitialHover(true);
  };

  return (
    <div className="img-sliders">
      <div className="text-contents" data-aos="fade-right" data-aos-duration="1000">
        <div className="left-contents">
          <h2>{t.smarterWay}</h2>
          <p>{t.description}</p>
          <b id="learnsmoressbtnss">{t.learnMore}</b>
        </div>
      </div>
      <div className="container-wrappers" data-aos="fade-left" data-aos-duration="1000">
        <div 
          className={`containers ${!initialHover ? 'initials' : 'shrinkeds'}`} 
          id="containers1s"
          onMouseEnter={handleHover}
          data-aos="zoom-in"
        >
          <div className="contents">
            <p className="initial-texts">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-1-square" viewBox="0 0 16 16">
                <path d="M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z"/>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
              </svg>
              <b>{t.search}</b>
            </p>
            <p className="hover-texts">{t.searchDesc}</p>
            <img className="initial-imgs" src="https://webstockreview.net/images/kickball-clipart-kids-17.png" alt="Initial Image" />
            <img className="hover-imgs" src="https://parkingpal.in/assets/img/svg/parking.svg" alt="Hover Image" />
          </div>
        </div>

        <div className="containers" id="container2" data-aos="zoom-in" data-aos-delay="200">
          <div className="contents">
            <p className="initial-texts">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-2-square" viewBox="0 0 16 16">
                <path d="M6.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306"/>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
              </svg>
              <b>{t.book}</b>
            </p>
            <p className="hover-texts">{t.bookDesc}</p>
            <img className="initial-imgs" src="https://parkingpal.in/assets/img/svg/bill.svg" alt="Initial Image" />
            <img className="hover-imgs" src="https://parkingpal.in/assets/img/svg/bill.svg" alt="Hover Image" />
          </div>
        </div>

        <div className="containers" id="container3" data-aos="zoom-in" data-aos-delay="400">
          <div className="contents">
            <p className="initial-texts">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-3-square" viewBox="0 0 16 16">
                <path d="M7.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318"/>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
              </svg>
              <b>{t.park}</b>
            </p>
            <p className="hover-texts">{t.parkDesc}</p>
            <img className="initial-imgs" src="https://parkingpal.in/assets/img/svg/parking-sign.svg" alt="Initial Image" />
            <img className="hover-imgs" src="https://parkingpal.in/assets/img/svg/parking-sign.svg" alt="Hover Image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgSlider;
