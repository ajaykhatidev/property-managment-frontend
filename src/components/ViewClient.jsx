import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api-client.js';
import { toast } from 'react-toastify';
import './ViewClient.css';
import PageHeader from './Navigation/PageHeader';
import Breadcrumb from './Navigation/Breadcrumb';

function ViewClient() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [requirementFilter, setRequirementFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchClients = async (page = 1, search = '', requirement = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 100, // Increased limit to show more clients
        ...(search && { search }),
        ...(requirement && { requirement }),
      };

      const response = await api.getClients(params);
      
      // API response received successfully
      
      if (response.data.success) {
        setClients(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
        // Clients loaded successfully
      } else {
        setError(response.data.message || 'Failed to fetch clients');
      }
    } catch (err) {
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage, debouncedSearchTerm, requirementFilter);
  }, [currentPage, debouncedSearchTerm, requirementFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setRequirementFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleEditClient = (e, clientId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/client/edit/${clientId}`);
  };

  const handleDeleteClient = async (e, clientId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const response = await api.deleteClient(clientId);
        
        if (response.data.success) {
          toast.success('Client deleted successfully!');
          // Refresh the client list
          fetchClients(currentPage, debouncedSearchTerm, requirementFilter);
        } else {
          toast.error('Failed to delete client');
        }
      } catch (err) {
        toast.error('Failed to delete client');
      }
    }
  };

  const formatBudget = (min, max) => {
    if (!min && !max) return 'Not specified';
    if (!min) return `Up to ${max}`;
    if (!max) return `From ${min}`;
    return `${min} - ${max}`;
  };

  const getRequirementColor = (requirement) => {
    const colors = {
      'Sale': '#dc3545',
      'Purchase': '#28a745',
      'Rent': '#007bff',
      'Lease': '#ffc107'
    };
    return colors[requirement] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="view-client-container">
        <div className="loading">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-client-container">
        <div className="error">
          {error}
          <button onClick={() => fetchClients(currentPage, debouncedSearchTerm, requirementFilter)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-client-container">
      <Breadcrumb />
      <PageHeader 
        title="Client Management" 
        subtitle="View and manage all your clients"
        fallbackPath="/client"
        customActions={
          <Link to="/client/add" className="quick-action-btn primary">
            <span>➕</span>
            Add New Client
          </Link>
        }
      />

      {/* Search and Filter */}
      <div className="client-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search clients by name, phone, or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filter-box">
          <select
            value={requirementFilter}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Requirements</option>
            <option value="Sale">Sale</option>
            <option value="Purchase">Purchase</option>
            <option value="Rent">Rent</option>
            <option value="Lease">Lease</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {clients.length > 0 && (
        <div className="results-count">
          Showing {clients.length} client{clients.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Client Cards */}
      <div className="client-cards">
        {clients.length === 0 ? (
          <div className="no-clients">
            <div className="no-clients-icon">👥</div>
            <h3>No Clients Found</h3>
            <p>Start building your client base by adding your first client</p>
            <Link to="/client/add" className="add-first-client-btn">
              Add Your First Client
            </Link>
          </div>
        ) : (
          clients.map((client) => (
            <div key={client._id} className="client-card">
              <div className="client-card-header">
                <h3>{client.clientName}</h3>
                <span 
                  className="requirement-badge"
                  style={{ backgroundColor: getRequirementColor(client.requirement) }}
                >
                  {client.requirement}
                </span>
              </div>
              
              <div className="client-card-body">
                <div className="client-info">
                  <div className="info-item">
                    <span className="info-label">📞 Phone:</span>
                    <span className="info-value">{client.phoneNumber}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">💰 Budget:</span>
                    <span className="info-value budget-highlight">
                      {formatBudget(client.budgetMin, client.budgetMax)}
                    </span>
                  </div>
                  
                  {client.description && (
                    <div className="info-item">
                      <span className="info-label">📝 Description:</span>
                      <span className="info-value description-text">
                        {client.description.length > 100 
                          ? `${client.description.substring(0, 100)}...` 
                          : client.description
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="client-card-footer">
                <div className="client-date">
                  Added: {new Date(client.createdAt).toLocaleDateString()}
                </div>
                <div className="client-actions">
                  <button 
                    type="button"
                    className="edit-btn"
                    onClick={(e) => handleEditClient(e, client._id)}
                  >
                    <span className="btn-icon">✏️</span>
                    Edit
                  </button>
                  <button 
                    type="button"
                    className="delete-btn"
                    onClick={(e) => handleDeleteClient(e, client._id)}
                  >
                    <span className="btn-icon">🗑️</span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export { ViewClient };
