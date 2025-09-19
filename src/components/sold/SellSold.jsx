import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUpdateProperty, useDeleteProperty } from "../../hook/useAddProperty";
import "../sold/RentSold.css";

const fetchProperties = async (filters) => {
  console.log("🚀 API Call Starting with filters:", filters);
  console.log("🔗 URL being called:", `https://property-managment-x0d8.onrender.com/api/properties`);
  
  try {
    const response = await axios.get("https://property-managment-x0d8.onrender.com/api/properties", {
      params: filters,
    });
    
    console.log("✅ API Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Call Failed:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const SellSold = () => {
  console.log("🎯 SellSold Component Mounted/Re-rendered");
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchFilters, setSearchFilters] = useState({
    searchText: "",
    minPrice: "",
    maxPrice: "",
    bhk: "",
    ownership: "",
  });

  // Track which property is being deleted/edited for better UX
  const [deletingPropertyId, setDeletingPropertyId] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState(null);

  // ✅ Debounced backend query params (only for non-text filters)
  const backendQueryParams = useMemo(() => {
    const params = { type: "sellSold" }; // ✅ Send for sold sale properties
    
    // Only send non-text filters to backend to reduce API calls
    if (searchFilters.minPrice) {
      params.minPrice = searchFilters.minPrice;
    }
    if (searchFilters.maxPrice) {
      params.maxPrice = searchFilters.maxPrice;
    }
    if (searchFilters.bhk) {
      params.bhk = searchFilters.bhk;
    }
    if (searchFilters.ownership) {
      params.ownership = searchFilters.ownership;
    }
    
    console.log("✅ Backend query params:", params);
    return params;
  }, [searchFilters.minPrice, searchFilters.maxPrice, searchFilters.bhk, searchFilters.ownership]);

  // ✅ React Query with less frequent API calls
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["properties", backendQueryParams],
    queryFn: () => {
      console.log("🔄 React Query executing with params:", backendQueryParams);
      return fetchProperties(backendQueryParams);
    },
    refetchOnWindowFocus: false, // ✅ Reduced auto-refetching
    refetchInterval: 30000, // ✅ 30 seconds instead of 5
    staleTime: 10000, // ✅ 10 seconds cache
  });

  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();

  const properties = data?.properties || [];

  // ✅ Client-side filtering with text search
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Ensure it's Sale + Sold
      const isSaleSold = property.rentOrSale === "Sale" && property.status === "Sold";
      if (!isSaleSold) return false;

      // Text search (client-side for real-time feedback)
      const searchText = searchFilters.searchText.toLowerCase();
      const matchesText =
        searchText === "" ||
        property.title?.toLowerCase().includes(searchText) ||
        property.houseNo?.toString().toLowerCase().includes(searchText) ||
        property.block?.toLowerCase().includes(searchText) ||
        property.pocket?.toLowerCase().includes(searchText) ||
        property.reference?.toLowerCase().includes(searchText);

      // Additional client-side filters (for immediate feedback)
      const price = property.price || 0;
      const minPrice = searchFilters.minPrice === "" ? 0 : Number(searchFilters.minPrice);
      const maxPrice = searchFilters.maxPrice === "" ? Infinity : Number(searchFilters.maxPrice);
      const matchesPrice = price >= minPrice && price <= maxPrice;

      const matchesBHK = searchFilters.bhk === "" || property.bhk?.toString() === searchFilters.bhk;

      const matchesOwnership =
        searchFilters.ownership === "" ||
        property.hpOrFreehold?.toLowerCase().includes(searchFilters.ownership.toLowerCase());

      return matchesText && matchesPrice && matchesBHK && matchesOwnership;
    });
  }, [properties, searchFilters]);

  // ✅ Enhanced delete handler with better error handling and UX
  const handleDelete = useCallback(async (propertyId) => {
    if (!propertyId) {
      alert("Error: Invalid property ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this sold property? This action cannot be undone."
    );
    
    if (!confirmed) return;

    try {
      setDeletingPropertyId(propertyId);
      console.log("🗑️ Starting delete for sold property:", propertyId);
      
      await deleteProperty.mutateAsync(propertyId);
      
      // Invalidate queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      
      console.log("✅ Sold property deleted successfully");
      
      // Optional: You could show a toast notification here
      // toast.success("Sold property deleted successfully!");
      
    } catch (error) {
      console.error("❌ Delete failed:", error);
      
      // More specific error messages
      let errorMessage = "Failed to delete property. Please try again.";
      if (error.response?.status === 404) {
        errorMessage = "Property not found. It may have already been deleted.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to delete this property.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      alert(errorMessage);
    } finally {
      setDeletingPropertyId(null);
    }
  }, [deleteProperty, queryClient]);

  // ✅ Enhanced edit handler with error handling
  const handleEdit = useCallback(async (property) => {
    if (!property || !property._id) {
      console.error("Invalid property data for editing");
      alert("Error: Invalid property data");
      return;
    }

    try {
      setEditingPropertyId(property._id);
      console.log("✏️ Navigating to edit sold property:", property._id);
      
      // Optional: You could add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 200));
      
      navigate("/edit-property", { state: { property } });
    } catch (error) {
      console.error("Error navigating to edit page:", error);
      alert("Error opening edit page. Please try again.");
    } finally {
      setEditingPropertyId(null);
    }
  }, [navigate]);

  // ✅ Optimized handlers with useCallback
  const clearAllFilters = useCallback(() => {
    setSearchFilters({
      searchText: "",
      minPrice: "",
      maxPrice: "",
      bhk: "",
      ownership: "",
    });
  }, []);

  // ✅ Optimized input handlers
  const handleSearchTextChange = useCallback((e) => {
    setSearchFilters(prev => ({ ...prev, searchText: e.target.value }));
  }, []);

  const handleMinPriceChange = useCallback((e) => {
    setSearchFilters(prev => ({ ...prev, minPrice: e.target.value }));
  }, []);

  const handleMaxPriceChange = useCallback((e) => {
    setSearchFilters(prev => ({ ...prev, maxPrice: e.target.value }));
  }, []);

  const handleBHKChange = useCallback((e) => {
    setSearchFilters(prev => ({ ...prev, bhk: e.target.value }));
  }, []);

  const handleOwnershipChange = useCallback((e) => {
    setSearchFilters(prev => ({ ...prev, ownership: e.target.value }));
  }, []);

  // ✅ Loading and error states with better UI
  if (isLoading) return (
    <div className="rent-sold-list">
      <div className="loading-spinner">
        <div className="spinner-icon">⏳</div>
        <p>Loading sold properties...</p>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="rent-sold-list">
      <div className="error-message">
        <div className="error-icon">❌</div>
        <p>Error loading properties: {error?.message || "Something went wrong"}</p>
        <button onClick={() => refetch()} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="rent-sold-list">
      <div className="header-section">
        <h2>
          Sold Properties <span className="sold-badge">Sale</span>
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
            onChange={handleSearchTextChange}
            className="search-input"
          />
          <button onClick={clearAllFilters} className="clear-btn">
            Clear All
          </button>
        </div>
        
        <div className="filter-row">
          <input
            type="number"
            placeholder="Min Price (₹)"
            value={searchFilters.minPrice}
            onChange={handleMinPriceChange}
            className="price-input"
          />
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={searchFilters.maxPrice}
            onChange={handleMaxPriceChange}
            className="price-input"
          />
          
          <select
            value={searchFilters.bhk}
            onChange={handleBHKChange}
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
            onChange={handleOwnershipChange}
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
            {filteredProperties.map((property) => {
              const isDeleting = deletingPropertyId === property._id;
              const isEditing = editingPropertyId === property._id;
              const isProcessing = isDeleting || isEditing;

              return (
                <li key={property._id} className="property-card sold-property">
                  <div className="card-header">
                    <span className="status-badge sold-status">{property.status}</span>
                    <span className="type-badge">{property.rentOrSale}</span>
                    {isProcessing && (
                      <span className="processing-indicator">
                        {isDeleting ? "🗑️ Deleting..." : "✏️ Editing..."}
                      </span>
                    )}
                  </div>
                  
                  <div className="card-content">
                    <h3 className="property-title">{property.title}</h3>
                    <p className="property-description">{property.description}</p>
                    
                    <div className="property-details">
                      <div className="detail-item">
                        <strong>Address:</strong> {property.houseNo}, {property.block} {property.pocket}
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
                      <div className="detail-item price-highlight sold-price">
                        <strong>Sold Price:</strong> ₹ {property.price?.toLocaleString("en-IN")}
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
                      className={`edit-btn ${isEditing ? 'loading' : ''}`}
                      disabled={isProcessing || updateProperty.isLoading}
                      title="Edit this sold property"
                    >
                      {isEditing ? (
                        <>⏳ Editing...</>
                      ) : updateProperty.isLoading ? (
                        <>⏳ Updating...</>
                      ) : (
                        <>✏️ Edit</>
                      )}
                    </button>
                    <button 
                      onClick={() => handleDelete(property._id)}
                      className={`delete-btn ${isDeleting ? 'loading' : ''}`}
                      disabled={isProcessing || deleteProperty.isLoading}
                      title="Delete this sold property permanently"
                    >
                      {isDeleting ? (
                        <>⏳ Deleting...</>
                      ) : (
                        <>🗑️ Delete</>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-properties">
            <div className="no-properties-icon">🏠</div>
            <h3>No sold sale properties found</h3>
            <p>Try adjusting your search filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};