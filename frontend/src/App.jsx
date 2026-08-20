import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import WarrantyList from './components/WarrantyList';
import WarrantyModal from './components/WarrantyModal';
import WarrantyDetailModal from './components/WarrantyDetailModal';

// Set your Render backend Web Service URL here (no trailing slash)
const API_BASE_URL = 'https://YOUR-BACKEND-SERVICE-NAME.onrender.com';

const CATEGORIES = ['Electronics', 'Home Appliances', 'Kitchen', 'Travel', 'Furniture', 'Other'];

function MainApp() {
  const { user, token, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [warranties, setWarranties] = useState([]);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchWarranties = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/warranties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWarranties(data);
      }
    } catch (error) {
      console.error('Error fetching warranties:', error);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchWarranties();
    }
  }, [user, token]);

  if (loading) {
    return <div className="loading-screen">Loading Warranty Vault...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  const getWarrantyStatus = (expiryDateStr) => {
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', label: 'Expired', badgeClass: 'badge-expired' };
    } else if (diffDays <= 30) {
      return { status: 'expiring', label: 'Expiring Soon', badgeClass: 'badge-warning' };
    } else {
      return { status: 'active', label: 'Active', badgeClass: 'badge-active' };
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `${API_BASE_URL}/api/warranties/${editingProduct._id}` 
        : `${API_BASE_URL}/api/warranties`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchWarranties();
        setEditingProduct(null);
        setIsFormModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving warranty:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this warranty record?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/warranties/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setWarranties(warranties.filter((w) => w._id !== id));
          if (selectedProduct?._id === id) setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error deleting warranty:', error);
      }
    }
  };

  const handleEditInit = (product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-content">
        <Navbar 
          setSidebarOpen={setSidebarOpen}
          onOpenAddModal={() => { setEditingProduct(null); setIsFormModalOpen(true); }}
        />

        <main className="content-body">
          {activeTab === 'dashboard' ? (
            <Dashboard 
              items={warranties}
              getStatus={getWarrantyStatus}
              onSelectProduct={setSelectedProduct}
              onDeleteProduct={handleDeleteProduct}
              onViewAll={() => setActiveTab('warranties')}
            />
          ) : (
            <WarrantyList 
              items={warranties}
              categories={CATEGORIES}
              getStatus={getWarrantyStatus}
              onSelectProduct={setSelectedProduct}
              onEditProduct={handleEditInit}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </main>
      </div>

      <WarrantyModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        categories={CATEGORIES}
        initialData={editingProduct}
      />

      <WarrantyDetailModal 
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        getStatus={getWarrantyStatus}
        onEdit={handleEditInit}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}