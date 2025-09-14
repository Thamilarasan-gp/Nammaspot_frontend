import React, { useState, useEffect, useContext } from 'react';
import './SliderContainer.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS for styling
import LanguageContext from './LanguageContext';

const SliderContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { language } = useContext(LanguageContext); // Use LanguageContext to get the current language

  useEffect(() => {
    AOS.init(); // Initialize AOS
    const handleScroll = () => {
      const sliderContainer = document.querySelector('.innovative-container');
      if (sliderContainer) {
        const sliderPosition = sliderContainer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sliderPosition < windowHeight * 0.75) {
          setScrolled(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const contents = {
    en: [
      "In a world where you can be anything, be kind.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "The only way to do great work is to love what you do.",
      "Life is not about waiting for the storm to pass, but learning to dance in the rain.",
      "Believe you can and you're halfway there."
    ],
    ta: [
      "நீங்கள் எதையும் செய்ய முடியும் ஒரு உலகில், மென்மையாக இருங்கள்.",
      "வெற்றி இறுதி அல்ல, தோல்வி உயிரோடில்லை: தொடர நம்பிக்கை தேவை.",
      "சிறந்த வேலை செய்வது எப்படி என்றால், அதை நீங்கள் காதலிக்க வேண்டும்.",
      "வாழ்க்கை புயலை கடக்க காத்திருக்காதீர்கள், மழையில் நடனமாட கற்றுக்கொள்ளுங்கள்.",
      "நீங்கள் நம்பினால், நீங்கள் பாதி போய்ச்சு."
    ],
    hi: [
      "एक ऐसी दुनिया में जहाँ आप कुछ भी हो सकते हैं, दयालु बनें।",
      "सफलता अंतिम नहीं है, विफलता घातक नहीं है: यह जारी रखने का साहस है जो मायने रखता है।",
      "महान काम करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।",
      "जीवन तूफान के गुजरने का इंतजार करने के बारे में नहीं है, बल्कि बारिश में नृत्य करना सीखने के बारे में है।",
      "विश्वास करो कि तुम कर सकते हो और तुम आधे रास्ते पर हो।"
    ]
  };

  const handleLeftClick = () => {
    const newIndex = (currentIndex > 0) ? currentIndex - 1 : contents[language].length - 1;
    setCurrentIndex(newIndex);
  };

  const handleRightClick = () => {
    const newIndex = (currentIndex < contents[language].length - 1) ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
  };

  return (
  
    <div className={`innovative-container ${scrolled ? 'scrolled' : ''}`} data-aos="fade-up" data-aos-duration="1000">
      <button className="backward-arrow arrow" onClick={handleLeftClick}>&larr;</button>
      <div className="carousel">
        {contents[language].map((content, index) => (
          <div className="item" key={index} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            <p>{content}</p>
          </div>
        ))}
      </div>
      <button className="forward-arrow arrow" onClick={handleRightClick}>&rarr;</button>
    </div>
  );
};

export default SliderContainer;
