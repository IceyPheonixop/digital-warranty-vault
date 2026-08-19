import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

export default function WarrantyModal({ isOpen, onClose, onSave, categories, initialData }) {
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: 'Electronics',
    purchaseDate: '',
    warrantyExpiryDate: '',
    price: '',
    notes: '',
    receiptUrl: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        purchaseDate: initialData.purchaseDate ? new Date(initialData.purchaseDate).toISOString().split('T')[0] : '',
        warrantyExpiryDate: initialData.warrantyExpiryDate ? new Date(initialData.warrantyExpiryDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        productName: '',
        brand: '',
        category: 'Electronics',
        purchaseDate: '',
        warrantyExpiryDate: '',
        price: '',
        notes: '',
        receiptUrl: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, receiptUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{initialData ? 'Edit Warranty' : 'Add to Vault'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wireless Headphones"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Brand *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sony"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="24999.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Purchase Date *</label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Warranty Expiry Date *</label>
              <input
                type="date"
                required
                value={formData.warrantyExpiryDate}
                onChange={(e) => setFormData({ ...formData, warrantyExpiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Receipt Upload / Image URL</label>
            <div className="file-upload-box">
              <input type="file" accept="image/*" id="receipt-input" onChange={handleFileChange} />
              <label htmlFor="receipt-input" className="file-upload-label">
                <Upload size={20} />
                <span>{formData.receiptUrl ? 'Receipt attached (Click to change)' : 'Upload Receipt File'}</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows="3"
              placeholder="Serial number, store location, or warranty coverage details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}