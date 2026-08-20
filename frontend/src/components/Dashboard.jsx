// src/components/Dashboard.jsx
import React from 'react';
import { ShieldCheck, AlertTriangle, IndianRupee, ArrowRight, Eye, Trash2 } from 'lucide-react';

export default function Dashboard({ items, getStatus, onSelectProduct, onDeleteProduct, onViewAll }) {
  const activeCount = items.filter((i) => getStatus(i.warrantyExpiryDate).status === 'active').length;
  const expiringCount = items.filter((i) => getStatus(i.warrantyExpiryDate).status === 'expiring').length;
  const totalValue = items.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const expiringItems = items.filter((i) => getStatus(i.warrantyExpiryDate).status === 'expiring');
  const recentItems = [...items].slice(0, 5);

  return (
    <div className="dashboard-view">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon active">
            <ShieldCheck size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Warranties</span>
            <span className="metric-value">{activeCount}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Expiring Soon (30 Days)</span>
            <span className="metric-value">{expiringCount}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon currency">
            <IndianRupee size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Protected Value</span>
            <span className="metric-value">
              ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {expiringItems.length > 0 && (
        <div className="notification-card">
          <div className="notification-header">
            <AlertTriangle className="warning-icon" size={20} />
            <h3>Action Required: Warranties Expiring Soon</h3>
          </div>
          <p>You have {expiringItems.length} product(s) expiring within 30 days. Plan renewals or claim service if needed.</p>
          <div className="expiring-list">
            {expiringItems.map((item) => (
              <div key={item._id} className="expiring-item" onClick={() => onSelectProduct(item)}>
                <span><strong>{item.productName}</strong> ({item.brand})</span>
                <span className="expiry-tag">Expires: {new Date(item.warrantyExpiryDate).toISOString().split('T')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="content-card">
        <div className="card-header">
          <h3>Recent Products</h3>
          <button className="btn btn-text" onClick={onViewAll}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="vault-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table">No products added yet.</td>
                </tr>
              ) : (
                recentItems.map((item) => {
                  const { label, badgeClass } = getStatus(item.warrantyExpiryDate);
                  return (
                    <tr key={item._id}>
                      <td className="fw-medium">{item.productName}</td>
                      <td>{item.brand}</td>
                      <td><span className="category-pill">{item.category}</span></td>
                      <td>₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td><span className={`status-badge ${badgeClass}`}>{label}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn" onClick={() => onSelectProduct(item)} title="View">
                            <Eye size={16} />
                          </button>
                          <button className="icon-btn delete" onClick={() => onDeleteProduct(item._id)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}