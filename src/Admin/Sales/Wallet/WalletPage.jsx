import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  Upload,
  Send,
  Calendar,
  Filter,
  ChevronDown,
  User,
  QrCode,
  IndianRupee,
  CreditCard,
  BarChart3,
  TrendingUp,
  Wallet,
  Bell,
  Settings,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  PiggyBank,
  Shield,
  Search,
} from "lucide-react";
import "./Wallet.css";

const WalletPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("anotherProfileImageKey") || "default-image-url"
  );
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    growth: 12.5,
  });

  useEffect(() => {
    axios
      .get("https://nammaspot-backend.onrender.com/getconfirmb")
      .then((result) => {
        if (Array.isArray(result.data)) {
          // Sort transactions by date (newest first)
          const sortedTransactions = result.data.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          setTransactions(sortedTransactions);

          // Calculate stats
          const income = sortedTransactions
            .filter((t) => t.totalAmount > 0)
            .reduce((sum, t) => sum + t.totalAmount, 0);

          const expenses = sortedTransactions
            .filter((t) => t.totalAmount < 0)
            .reduce((sum, t) => sum + t.totalAmount, 0);

          setStats({
            income,
            expenses: Math.abs(expenses),
            growth: 12.5,
          });
        } else {
          setTransactions([result.data]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("https://nammaspot-backend.onrender.com/getaname")
      .then((result) => {
        if (result.data && result.data.name) {
          setAdminName(result.data.name);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const balance = transactions.reduce(
      (acc, transaction) => acc + (transaction.totalAmount || 0),
      0
    );
    setTotalBalance(balance);
  }, [transactions]);

  const months = [
    "All Months",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredTransactions = transactions
    .filter((transaction) => {
      // Filter by tab (income/expenses/all)
      if (activeTab === "income") return transaction.totalAmount > 0;
      if (activeTab === "expenses") return transaction.totalAmount < 0;
      return true;
    })
    .filter((transaction) => {
      // Filter by search query
      if (!searchQuery) return true;
      return transaction.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    })
    .filter((transaction) => {
      // Filter by selected month
      if (selectedMonth === "All Months") return true;
      
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.toLocaleString('default', { month: 'long' });
      return transactionMonth === selectedMonth;
    });

  return (
    <div className="ad-wt-body">
      <div className="ad-wt-container">
        {/* Header */}
        <header className="ad-wt-header">
          <div className="ad-wt-header-left">
            <h1 className="ad-wt-logo">
              <Wallet size={40} className="ad-wt-logo-icon" />
              Wallet
            </h1>
          </div>
          <div className="ad-wt-header-right">
            <div className="ad-wt-search">
              <Search size={30} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="ad-wt-icon-btn notification">
              <Bell size={30} />
              <span className="ad-wt-notification-badge"></span>
            </button>
            <button className="ad-wt-icon-btn">
              <Settings size={30} />
            </button>
            <div className="ad-wt-profile">
              <img src={profileImage} alt="Profile" />
            </div>
          </div>
        </header>

        <div className="ad-wt-dashboard">
          {/* Left Panel - Balance and Quick Actions */}
          <div className="ad-wt-left-panel">
            <div className="ad-wt-balance-card">
              <div className="ad-wt-balance-header">
                <div className="ad-wt-balance-title">Total Balance</div>
                <div className="ad-wt-balance-actions">
                  <button className="ad-wt-balance-action">
                    <History size={30} color="#fff"/>
                  </button>
                  <button className="ad-wt-balance-action">
                    <MoreHorizontal size={30} color="#fff"/>
                  </button>
                </div>
              </div>
              <h1 className="ad-wt-balance-amount">
                <IndianRupee size={40} />
                {totalBalance.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </h1>
              <div className="ad-wt-balance-growth">
                <TrendingUp size={30} />
                <span>+{stats.growth}% from last month</span>
              </div>

              <div className="ad-wt-actions">
                <button className="ad-wt-action-btn primary">
                  <Download size={30} />
                  <span>Deposit</span>
                </button>
                <button className="ad-wt-action-btn secondary">
                  <Upload size={30} />
                  <span>Withdraw</span>
                </button>
                <button className="ad-wt-action-btn tertiary">
                  <Send size={30} />
                  <span>Transfer</span>
                </button>
              </div>
            </div>

            <div className="ad-wt-stats-card">
              <h3>Financial Overview</h3>
              <div className="ad-wt-stats">
                <div className="ad-wt-stat">
                  <div className="ad-wt-stat-icon income">
                    <ArrowDownLeft size={30} />
                  </div>
                  <div className="ad-wt-stat-info">
                    <div className="ad-wt-stat-label">Income</div>
                    <div className="ad-wt-stat-value">
                      ₹
                      {stats.income.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
                <div className="ad-wt-stat">
                  <div className="ad-wt-stat-icon expense">
                    <ArrowUpRight size={30} />
                  </div>
                  <div className="ad-wt-stat-info">
                    <div className="ad-wt-stat-label">Expenses</div>
                    <div className="ad-wt-stat-value">
                      ₹
                      {stats.expenses.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ad-wt-progress-bar">
                <div
                  className="ad-wt-progress-fill income"
                  style={{
                    width: `${
                      (stats.income / (stats.income + stats.expenses)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="ad-wt-features">
              <h3>Quick Access</h3>
              <div className="ad-wt-features-grid">
                <button className="ad-wt-feature-btn">
                  <div className="ad-wt-feature-icon">
                    <PiggyBank size={30} />
                  </div>
                  <span>Savings</span>
                </button>
                <button className="ad-wt-feature-btn">
                  <div className="ad-wt-feature-icon">
                    <CreditCard size={30} />
                  </div>
                  <span>Cards</span>
                </button>
                <button className="ad-wt-feature-btn">
                  <div className="ad-wt-feature-icon">
                    <BarChart3 size={30} />
                  </div>
                  <span>Reports</span>
                </button>
                <button className="ad-wt-feature-btn">
                  <div className="ad-wt-feature-icon">
                    <Shield size={30} />
                  </div>
                  <span>Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Transactions */}
          <div className="ad-wt-right-panel">
            <div className="ad-wt-transactions-header">
              <h2>Recent Transactions</h2>
              <div className="ad-wt-transactions-controls">
                <div className="ad-wt-tabs">
                  <button
                    className={`ad-wt-tab ${
                      activeTab === "all" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All
                  </button>
                  <button
                    className={`ad-wt-tab ${
                      activeTab === "income" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("income")}
                  >
                    Income
                  </button>
                  <button
                    className={`ad-wt-tab ${
                      activeTab === "expenses" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("expenses")}
                  >
                    Expenses
                  </button>
                </div>
                <div className="ad-wt-filter-group">
                  <div className="ad-wt-filter">
                    <Filter size={30} />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="ad-wt-month-select"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={30} className="ad-wt-select-arrow" />
                  </div>
                </div>
              </div>
            </div>

            <div className="ad-wt-transactions-list">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <div key={index} className="ad-wt-transaction-item">
                    <div className="ad-wt-transaction-icon">
                      {transaction.totalAmount >= 0 ? (
                        <div className="ad-wt-transaction-icon-bg income">
                          <ArrowDownLeft size={30} />
                        </div>
                      ) : (
                        <div className="ad-wt-transaction-icon-bg expense">
                          <ArrowUpRight size={30} />
                        </div>
                      )}
                    </div>
                    <div className="ad-wt-transaction-details">
                      <div className="ad-wt-transaction-name">
                        {transaction.name || "Unknown"}
                      </div>
                      <div className="ad-wt-transaction-date">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <div
                      className={`ad-wt-transaction-amount ${
                        transaction.totalAmount >= 0
                          ? "ad-wt-positive"
                          : "ad-wt-negative"
                      }`}
                    >
                      {transaction.totalAmount >= 0 ? "+" : ""}₹
                      {(transaction.totalAmount ?? 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <button className="ad-wt-transaction-action">
                      <MoreHorizontal size={30} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="ad-wt-no-transactions">
                  <BarChart3 size={48} />
                  <p>No transactions found</p>
                  <span>Your transactions will appear here</span>
                </div>
              )}
            </div>

            {filteredTransactions.length > 0 && (
              <div className="ad-wt-transactions-footer">
                <button className="ad-wt-view-all-btn">
                  View All Transactions
                  <ChevronDown size={30} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;