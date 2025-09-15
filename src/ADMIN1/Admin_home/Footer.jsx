import React, { useContext } from 'react';
import './Footer.css';
import { useLanguage } from '../../USER1/Homepage/LanguageContext';

const translations = {
  en: {
    connect: "Connect with us on social networks:",
    nammaspotDescription: "NammaSpot is your ultimate parking solution. Find and reserve parking spots in real-time, making your parking experience hassle-free.",
    services: "SERVICES",
    findParking: "Find Parking",
    reserveSpot: "Reserve Spot",
    monthlyPlans: "Monthly Plans",
    corporateSolutions: "Corporate Solutions",
    developedBy: "DEVELOPED BY",
    contact: "CONTACT",
    companyName: "NammaSpot, Inc.",
    email: "support@nammaspot.com",
    phone: "+1 234 567 8901",
    copyright: " 2024 Copyright",
    website: "nammaspot.com"
  },
  ta: {
    connect: "சமூக வலைத்தளங்களில் எங்களுடன் இணைந்திடுங்கள்:",
    nammaspotDescription: "NammaSpot உங்கள் இறுதி நிறுத்தல் தீர்வாகும். உங்கள் நிறுத்த அனுபவத்தை சிக்கலின்றி மாற்ற, நிஜ நேரத்தில் நிறுத்த இடங்களை கண்டுபிடித்து முன்பதிவு செய்யுங்கள்.",
    services: "சேவைகள்",
    findParking: "நிறுத்தம் கண்டறி",
    reserveSpot: "இடத்தை முன்பதிவு செய்",
    monthlyPlans: "மாதாந்திர திட்டங்கள்",
    corporateSolutions: "நிறுவன தீர்வுகள்",
    developedBy: "உருவாக்கியவர்கள்",
    contact: "தொடர்பு கொள்ளவும்",
    companyName: "NammaSpot, Inc.",
    email: "support@nammaspot.com",
    phone: "+1 234 567 8901",
    copyright: " 2024 பதிப்புரிமை",
    website: "nammaspot.com"
  },
  hi: {
    connect: "सोशल नेटवर्क्स पर हमसे जुड़ें:",
    nammaspotDescription: "NammaSpot आपकी अंतिम पार्किंग समाधान है। अपने पार्किंग अनुभव को झंझट-मुक्त बनाने के लिए रीयल-टाइम में पार्किंग स्थान खोजें और आरक्षित करें।",
    services: "सेवाएँ",
    findParking: "पार्किंग खोजें",
    reserveSpot: "स्थान आरक्षित करें",
    monthlyPlans: "मासिक योजनाएं",
    corporateSolutions: "कॉर्पोरेट समाधान",
    developedBy: "विकसित किया गया",
    contact: "संपर्क करें",
    companyName: "NammaSpot, Inc.",
    email: "support@nammaspot.com",
    phone: "+1 234 567 8901",
    copyright: " 2024 कॉपीराइट",
    website: "nammaspot.com"
  }
};

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <footer className="footer">
      <div className="footer-top">
        <p>{t.connect}</p>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-google"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
          <a href="#"><i className="fab fa-github"></i></a>
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-section">
          <h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-car-front-fill" viewBox="0 0 16 16">
              <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
            </svg>
            NAMMASPOT
          </h4>
          <p>{t.nammaspotDescription}</p>
        </div>
        <div className="footer-section">
          <h4>{t.services}</h4>
          <ul>
            <li><a href="#">{t.findParking}</a></li>
            <li><a href="#">{t.reserveSpot}</a></li>
            <li><a href="#">{t.monthlyPlans}</a></li>
            <li><a href="#">{t.corporateSolutions}</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>{t.developedBy}</h4>
          <ul>
            <li>THAMILARASAN GP</li>
            <li>RAHUL R</li>
            <li>MAJIDHUSIAN J</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>{t.contact}</h4>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
            </svg>
            {t.companyName}
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
            </svg>
            {t.email}
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
            </svg>
            {t.phone}
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t.copyright} <a href="http://nammaspot.com">{t.website}</a></p>
      </div>
    </footer>
  );
};

export default Footer;
