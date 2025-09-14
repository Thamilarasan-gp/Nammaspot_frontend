import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  User, 
  MapPin, 
  Car, 
  CreditCard, 
  Hash,
  Filter,
  ChevronDown,
  Download,
  Search
} from 'lucide-react';
import './Sales.css';


const SalesTable = () => {
    const [mapData, setMapData] = useState([]);
    const [lastUserName, setLastUserName] = useState('N/A');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        axios.get('https://nammaspot-backend.onrender.com/getconfirmb')
            .then(result => {
                if (Array.isArray(result.data)) {
                    setMapData(result.data);
                } else {
                    setMapData([result.data]);
                }
                if (result.data && result.data.name) {
                    setLastUserName(result.data.name);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Filter data based on search term and selected month
    const filteredData = mapData.filter(item => {
        const matchesSearch = 
            (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.vehicleno || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesMonth = !selectedMonth || 
            (item.date && new Date(item.date).toLocaleString('en', { month: 'long' }) === selectedMonth);
        
        return matchesSearch && matchesMonth;
    });

    return (
        <div className="ad-sl-body">
            <div className="ad-sl-container">
                <header className="ad-sl-header">
                    <div className="ad-sl-header-top">
                        <h1 className="ad-sl-title">My Sales</h1>
                        <div className="ad-sl-actions">
                            <button className="ad-sl-download-btn">
                                <Download size={30} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="ad-sl-header-bottom">
                        <div className="ad-sl-search">
                            <Search size={30} className="ad-sl-search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search by name, vehicle or place..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="ad-sl-search-input"
                            />
                        </div>
                        
                        <div className="ad-sl-filter">
                            <Filter size={30} />
                            <select 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="ad-sl-month-select"
                            >
                                <option value="">All Months</option>
                                {months.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                            <ChevronDown size={30} className="ad-sl-select-arrow" />
                        </div>
                    </div>
                </header>
                
                <div className="ad-sl-content">
                    <div className="ad-sl-today-header">
                        <Calendar size={30} />
                        <span className="ad-sl-today-text">Today</span>
                        <span className="ad-sl-results">{filteredData.length} results</span>
                    </div>
                    
                    <div className="ad-sl-table-container">
                        <table className="ad-sl-table">
                            <thead>
                                <tr>
                                    <th className="ad-sl-th">
                                        <div className="ad-sl-th-content">
                                            <Hash size={30} />
                                            <span>S.NO</span>
                                        </div>
                                    </th>
                                    <th className="ad-sl-th">
                                        <div className="ad-sl-th-content">
                                            <User size={30} />
                                            <span>Name</span>
                                        </div>
                                    </th>
                                    <th className="ad-sl-th">
                                        <div className="ad-sl-th-content">
                                            <Hash size={30} />
                                            <span>Slot</span>
                                        </div>
                                    </th>
                                    <th className="ad-sl-th">
                                        <div className="ad-sl-th-content">
                                            <CreditCard size={30} />
                                            <span>Price</span>
                                        </div>
                                    </th>
                                    <th className="ad-sl-th">
                                        <div className="ad-sl-th-content">
                                            <Calendar size={30} />
                                            <span>Date</span>
                                        </div>
                                    </th>
                                    <th className="ad-sl-th">
                                        <div className="ad-sl-th-content">
                                            <MapPin size={30} />
                                            <span>Place</span>
                                        </div>
                                    </th>
                                    <th className="ad-sl-th">
                                        <div className="ad-sl-th-content">
                                            <Car size={30} />
                                            <span>Vehicle No</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((mapItem, index) => (
                                        <tr key={index} className="ad-sl-tr">
                                            <td className="ad-sl-td">{index + 1}</td>
                                            <td className="ad-sl-td ad-sl-td-name">{mapItem.name || lastUserName}</td>
                                            <td className="ad-sl-td">
                                                <div className="ad-sl-slots">
                                                    {mapItem.slotNumbers ? 
                                                        mapItem.slotNumbers.join(', ') : 'N/A'
                                                    }
                                                </div>
                                            </td>
                                            <td className="ad-sl-td ad-sl-td-price">
                                                {mapItem.totalAmount ? `₹${mapItem.totalAmount.toFixed(2)}` : 'N/A'}
                                            </td>
                                            <td className="ad-sl-td">{mapItem.date || 'N/A'}</td>
                                            <td className="ad-sl-td">{mapItem.city || 'N/A'}</td>
                                            <td className="ad-sl-td ad-sl-td-vehicle">
                                                {mapItem.vehicleno || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="ad-sl-empty">
                                        <td colSpan="7" className="ad-sl-no-data">
                                            No sales data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesTable;