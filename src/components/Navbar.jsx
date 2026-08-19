import React, { useState, useRef, useEffect } from 'react';
import { Menu, Plus, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ setSidebarOpen, onOpenAddModal }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <h1 className="page-title">Digital Warranty Vault</h1>
      </div>

      <div className="navbar-right">
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span className="hide-mobile">Add Warranty</span>
        </button>

        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button 
            className="profile-trigger-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="avatar">
              <User size={18} />
            </div>
            <span className="user-name hide-mobile">{user?.name || 'User'}</span>
            <ChevronDown size={14} className={`chevron-icon ${dropdownOpen ? 'rotate' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-user-info">
                <p className="user-display-name">{user?.name}</p>
                <p className="user-display-email">{user?.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item logout" 
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}