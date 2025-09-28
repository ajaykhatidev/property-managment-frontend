import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDeleteProperty } from "../../hook/useAddProperty";
import "../sold/RentSold.css";

// Fetch function for RentAvailable
const fetchRentAvailableProperties = async (filters) => {
  const response = await axios.get("http://localhost:3000/api/properties", {
    params: { type: "rentAvailable", ...filters },
  });
  return response.data;
};

export const RentAvaliable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteProperty();

  const [searchFilters, setSearchFilters] = useState({
    searchText: "",
    minPrice: "",
    maxPrice: "",
    bhk: "",
    ownership: "",
  });

  // Backend query params
  const backendQueryParams = useMemo(() => {
    const params = {};
    if (searchFilters.minPrice) params.minPrice = searchFilters.minPrice;
    if (searchFilters.maxPrice) params.maxPrice = searchFilters.maxPrice;
    if (searchFilters.bhk) params.bhk = searchFilters.bhk;
    if (searchFilters.ownership) params.ownership = searchFilters.ownership;
    return params;
  }, [searchFilters]);

  // React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["properties", backendQueryParams],
    queryFn: () => fetchRentAvailableProperties(backendQueryParams),
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });

  const properties = data?.properties || [];

  // Client-side filtering (text search)
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const searchText = searchFilters.searchText.toLowerCase();
      const matchesText =
        searchText === "" ||
        property.title?.toLowerCase().includes(searchText) ||
        property.houseNo?.toString().includes(searchText) ||
        property.block?.toLowerCase().includes(searchText) ||
        property.pocket?.toLowerCase().includes(searchText) ||
        property.reference?.toLowerCase().includes(searchText);

      const price = property.price || 0;
      const minPrice = searchFilters.minPrice === "" ? 0 : Number(searchFilters.minPrice);
      const maxPrice = searchFilters.maxPrice === "" ? Infinity : Number(searchFilters.maxPrice);
      const matchesPrice = price >= minPrice && price <= maxPrice;

      const matchesBHK =
        searchFilters.bhk === "" || property.bhk?.toString() === searchFilters.bhk;

      const matchesOwnership =
        searchFilters.ownership === "" ||
        property.hpOrFreehold?.toLowerCase().includes(searchFilters.ownership.toLowerCase());

      return matchesText && matchesPrice && matchesBHK && matchesOwnership;
    });
  }, [properties, searchFilters]);

  const handleFilterChange = useCallback((filterName, value) => {
    setSearchFilters((prev) => ({ ...prev, [filterName]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchFilters({ searchText: "", minPrice: "", maxPrice: "", bhk: "", ownership: "" });
  }, []);

  const handleEdit = useCallback((property) => {
    try {
      navigate("/edit-property", { state: { property } });
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Unable to navigate to edit page. Please try again.");
    }
  }, [navigate]);

  const handleDelete = useCallback((propertyId, propertyTitle) => {
    const confirmMessage = `Are you sure you want to delete "${propertyTitle || 'this property'}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      deleteMutation.mutate(propertyId, {
        onSuccess: () => {
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["properties"] });
          alert("Property deleted successfully!");
        },
        onError: (error) => {
          console.error("Delete error:", error);
          alert(`Failed to delete property: ${error?.message || "Unknown error"}`);
        }
      });
    }
  }, [deleteMutation, queryClient]);

  // Loading and error states with consistent styling
  if (isLoading) return (
    <div className="rent-sold-list">
      <div className="loading-spinner">Loading properties...</div>
    </div>
  );
  
  if (isError) return (
    <div className="rent-sold-list">
      <div className="error-message">
        ❌ Error loading properties: {error?.message || "Something went wrong"}
        <button onClick={() => refetch()} style={{marginLeft: "10px"}}>
          🔄 Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="rent-sold-list">
      <div className="header-section">
        <h2>
          Available Properties <span className="sold-badge">Rent</span>
        </h2>
        <div className="results-count">
          Found {filteredProperties.length} properties
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="search-filters">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by title, house no, block, pocket, reference..."
            value={searchFilters.searchText}
            onChange={(e) => handleFilterChange("searchText", e.target.value)}
            className="search-input"
          />
          <button onClick={clearFilters} className="clear-btn">
            Clear All
          </button>
        </div>
        
        <div className="filter-row">
          <input
            type="number"
            placeholder="Min Price (₹)"
            value={searchFilters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="price-input"
          />
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={searchFilters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="price-input"
          />
          
          <select
            value={searchFilters.bhk}
            onChange={(e) => handleFilterChange("bhk", e.target.value)}
            className="filter-select"
          >
            <option value="">All BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5+ BHK</option>
          </select>
          
          <select
            value={searchFilters.ownership}
            onChange={(e) => handleFilterChange("ownership", e.target.value)}
            className="filter-select"
          >
            <option value="">All Ownership</option>
            <option value="Leasehold">Leasehold</option>
            <option value="Freehold">Freehold</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="properties-container">
        {filteredProperties.length > 0 ? (
          <ul className="properties-grid">
            {filteredProperties.map((property) => (
              <li key={property._id} className="property-card">
                <div className="card-header">
                  <span className="status-badge">{property.status || "Available"}</span>
                  <span className="type-badge">{property.rentOrSale}</span>
                </div>
                
                <div className="card-content">
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-description">{property.description}</p>
                  
                  <div className="property-details">
                    <div className="detail-item">
                      <strong>Address:</strong> {property.sector}/{property.block}/{property.pocket}/{property.houseNo}
                    </div>
                    <div className="detail-item">
                      <strong>BHK:</strong> {property.bhk}
                    </div>
                    <div className="detail-item">
                      <strong>Ownership:</strong> {property.hpOrFreehold}
                    </div>
                    <div className="detail-item">
                      <strong>Floor:</strong> {property.floor}
                    </div>
                    <div className="detail-item price-highlight">
                      <strong>Price:</strong> ₹ {property.price?.toLocaleString("en-IN")}
                    </div>
                    <div className="detail-item">
                      <strong>Location:</strong> {property.location}
                    </div>
                    <div className="detail-item">
                      <strong>Reference:</strong> {property.reference}
                    </div>
                    <div className="detail-item">
                      <strong>Phone:</strong> {property.phoneNumber}
                    </div>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button 
                    onClick={() => handleEdit(property)}
                    className="edit-btn"
                    disabled={deleteMutation.isPending}
                    title="Edit this property"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(property._id, property.title)}
                    className="delete-btn"
                    disabled={deleteMutation.isPending}
                    title="Delete this property"
                  >
                    🗑️ {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-properties">
            <div className="no-properties-icon">🏠</div>
            <h3>No available rent properties found</h3>
            <p>Try adjusting your search filters or check back later.</p>
          </div>
        )}
      </div>

      {/* Delete mutation error display */}
      {deleteMutation.isError && (
        <div className="error-message" style={{marginTop: "20px"}}>
          ❌ Delete failed: {deleteMutation.error?.message || "Unknown error"}
        </div>
      )}
    </div>
  );
};