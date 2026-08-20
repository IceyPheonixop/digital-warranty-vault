// src/components/WarrantyDetailModal.jsx
import React from 'react';
import { 
  X, Calendar, Tag, IndianRupee, FileText, Clock, Edit3, ExternalLink, Building2 
} from 'lucide-react';

export default function WarrantyDetailModal({ item, onClose, getStatus, onEdit }) {
  if (!item) return null;

  const { label, badgeClass } = getStatus(item.warrantyExpiryDate);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card detail-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal-header">
          <div className="detail-header-info">
            <div className="brand-pill">
              <Building2 size={13} />
              <span>{item.brand}</span>
            </div>
            <h2>{item.productName}</h2>
          </div>
          <button className="icon-btn close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="detail-modal-body">
          <div className="detail-status-bar">
            <span className={`status-badge ${badgeClass}`}>{label}</span>
            <span className="category-tag">
              <Tag size={13} />
              {item.category}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="info-card">
              <div className="info-icon blue">
                <Calendar size={18} />
              </div>
              <div className="info-content">
                <span className="info-label">Purchased On</span>
                <span className="info-value">{formatDate(item.purchaseDate)}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon amber">
                <Clock size={18} />
              </div>
              <div className="info-content">
                <span className="info-label">Warranty Expires</span>
                <span className="info-value">{formatDate(item.warrantyExpiryDate)}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon green">
                <IndianRupee size={18} />
              </div>
              <div className="info-content">
                <span className="info-label">Protected Price</span>
                <span className="info-value">
                  ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {item.notes && (
            <div className="detail-section">
              <h4 className="section-title">Coverage Notes</h4>
              <p className="notes-content">{item.notes}</p>
            </div>
          )}

          <div className="detail-section">
            <h4 className="section-title">Proof of Purchase</h4>
            {item.receiptUrl ? (
              <div className="receipt-container">
                <div className="receipt-image-wrapper">
                  <img src={item.receiptUrl} alt="Receipt preview" className="receipt-image" />
                </div>
                <a 
                  href={item.receiptUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary btn-sm receipt-open-link"
                >
                  <ExternalLink size={14} />
                  <span>Open Full Size Image</span>
                </a>
              </div>
            ) : (
              <div className="no-receipt-box">
                <FileText size={28} className="no-receipt-icon" />
                <p>No receipt image attached to this record.</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={() => { onClose(); onEdit(item); }}
          >
            <Edit3 size={16} />
            <span>Edit Record</span>
          </button>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}