import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Usernotification.css';
import { useLanguage } from '../../Homepage/LanguageContext';

const Usernotification = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const translations = {
    en: {
      notifications: "Notifications",
      noNotifications: "No notifications available",
      cancel: "Dismiss",
      markAllRead: "Clear All",
      newNotifications: "Recent",
      olderNotifications: "Earlier",
      loading: "Loading notifications..."
    },
    ta: {
      notifications: "அறிவிப்புகள்",
      noNotifications: "அறிவிப்புகள் இல்லை",
      cancel: "நிராகரி",
      markAllRead: "அனைத்தையும் நீக்கு",
      newNotifications: "சமீபத்திய",
      olderNotifications: "முந்தைய",
      loading: "அறிவிப்புகள் ஏற்றப்படுகின்றன..."
    },
    hi: {
      notifications: "सूचनाएं",
      noNotifications: "कोई सूचनाएं उपलब्ध नहीं हैं",
      cancel: "खारिज करें",
      markAllRead: "सभी साफ करें",
      newNotifications: "हालिया",
      olderNotifications: "पहले के",
      loading: "सूचनाएं लोड हो रही हैं..."
    }
  };

  const { 
    notifications, 
    noNotifications, 
    cancel, 
    markAllRead, 
    newNotifications, 
    olderNotifications,
    loading: loadingText
  } = translations[language] || translations.en;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    axios.get('https://nammaspot-backend.onrender.com/getnoti')
      .then(result => {
        setData(result.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`https://nammaspot-backend.onrender.com/deletenoti/${id}`)
      .then(() => {
        setData(data.filter(noti => noti._id !== id));
      })
      .catch(err => console.log(err));
  };

  const handleDeleteAll = () => {
    if (data.length === 0) return;
    
    if (window.confirm(language === 'en' ? "Clear all notifications?" : 
                       language === 'ta' ? "அனைத்து அறிவிப்புகளையும் நீக்கவா?" : 
                       "सभी सूचनाएं साफ करें?")) {
      axios.delete('https://nammaspot-backend.onrender.com/deletenoti/all')
        .then(() => {
          setData([]);
        })
        .catch(err => console.log(err));
    }
  };

  // Separate new notifications (last 24 hours) from older ones
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  
  const newNotificationsList = data.filter(noti => new Date(noti.date) > oneDayAgo);
  const olderNotificationsList = data.filter(noti => new Date(noti.date) <= oneDayAgo);

  if (loading) {
    return (
      <div className="us-nt-container">
        <div className="us-nt-loading">
          <div className="us-nt-spinner">
            <div className="us-nt-spinner-inner"></div>
          </div>
          <p>{loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="us-nt-container">
      <div className="us-nt-header">
        <div className="us-nt-header-content">
          <div className="us-nt-title-section">
            <div className="us-nt-icon">🔔</div>
            <h2 className="us-nt-title">{notifications}</h2>
            {data.length > 0 && (
              <span className="us-nt-count">{data.length}</span>
            )}
          </div>
          {data.length > 0 && (
            <button className="us-nt-clear-all" onClick={handleDeleteAll}>
              <span>{markAllRead}</span>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="us-nt-empty">
          <div className="us-nt-empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#007AFF" fillOpacity="0.1"/>
              <path d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z" fill="#007AFF"/>
              <path d="M12 11.5C12.5523 11.5 13 11.0523 13 10.5V6.5C13 5.94772 12.5523 5.5 12 5.5C11.4477 5.5 11 5.94772 11 6.5V10.5C11 11.0523 11.4477 11.5 12 11.5Z" fill="#007AFF"/>
            </svg>
          </div>
          <h3 className="us-nt-empty-title">{noNotifications}</h3>
          <p className="us-nt-empty-subtitle">You're all caught up!</p>
        </div>
      ) : (
        <div className="us-nt-content">
          {newNotificationsList.length > 0 && (
            <div className="us-nt-section">
              <div className="us-nt-section-header">
                <div className="us-nt-section-indicator"></div>
                <h3 className="us-nt-section-title">{newNotifications}</h3>
              </div>
              <div className="us-nt-list">
                {newNotificationsList.map(noti => (
                  <NotificationItem 
                    key={noti._id} 
                    noti={noti} 
                    onDelete={handleDelete} 
                    cancelText={cancel}
                    isNew={true}
                  />
                ))}
              </div>
            </div>
          )}

          {olderNotificationsList.length > 0 && (
            <div className="us-nt-section">
              <div className="us-nt-section-header">
                <div className="us-nt-section-indicator"></div>
                <h3 className="us-nt-section-title">{olderNotifications}</h3>
              </div>
              <div className="us-nt-list">
                {olderNotificationsList.map(noti => (
                  <NotificationItem 
                    key={noti._id} 
                    noti={noti} 
                    onDelete={handleDelete} 
                    cancelText={cancel}
                    isNew={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({ noti, onDelete, cancelText, isNew }) => (
  <div className={`us-nt-item ${isNew ? 'us-nt-item-new' : ''}`}>
    <div className="us-nt-item-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L5 9.5V16L3 16.5V18.5L9 17.5V20H15V17.5L21 18.5V16.5L19 16V9.5L21 9Z" fill="#007AFF"/>
      </svg>
    </div>
    <div className="us-nt-item-content">
      <p className="us-nt-message">{noti.noti}</p>
      <div className="us-nt-meta">
        <span className="us-nt-date">
          {new Date(noti.date).toLocaleString()}
        </span>
        {isNew && <span className="us-nt-new-badge">New</span>}
      </div>
    </div>
    <button 
      className="us-nt-delete-btn" 
      onClick={() => onDelete(noti._id)}
      aria-label="Delete notification"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
      </svg>
    </button>
  </div>
);

export default Usernotification;