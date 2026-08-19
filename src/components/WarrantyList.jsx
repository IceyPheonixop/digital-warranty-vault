import React, { useState } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, FileText } from 'lucide-react';

export default function WarrantyList({ items, categories, getStatus, onSelectProduct, onEditProduct, onDeleteProduct }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    const { status } = getStatus(item.warrantyExpiryDate);
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' && status === 'active') ||
      (selectedStatus === 'Expiring Soon' && status === 'expiring') ||
      (selectedStatus === 'Expired' && status === 'expired');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="warranty-list-view">
      <div className="filters-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, brand, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="select-wrapper">
            <Filter size={16} className="select-icon" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="status-tabs">
            {['All', 'Active', 'Expiring Soon', 'Expired'].map((st) => (
              <button
                key={st}
                className={`tab-btn ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="vault-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Purchase Date</th>
                <th>Expiry Date</th>
                <th>Price</th>
                <th>Receipt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-table">No matching warranties found.</td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const { label, badgeClass } = getStatus(item.warrantyExpiryDate);
                  return (
                    <tr key={item._id}>
                      <td className="fw-medium">{item.productName}</td>
                      <td>{item.brand}</td>
                      <td><span className="category-pill">{item.category}</span></td>
                      <td>{new Date(item.purchaseDate).toISOString().split('T')[0]}</td>
                      <td>{new Date(item.warrantyExpiryDate).toISOString().split('T')[0]}</td>
                      // inside src/components/WarrantyList.jsx
<td>₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>
                        {item.receiptUrl ? (
                          <span className="receipt-indicator"><FileText size={16} /> Attached</span>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td><span className={`status-badge ${badgeClass}`}>{label}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn" onClick={() => onSelectProduct(item)} title="View">
                            <Eye size={16} />
                          </button>
                          <button className="icon-btn" onClick={() => onEditProduct(item)} title="Edit">
                            <Edit2 size={16} />
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