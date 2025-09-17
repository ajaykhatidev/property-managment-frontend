import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import "../sold/RentSold.css"; // Reuse styles from SellSold
import { useGetProperties } from "../../hook/useGetProperties";
import { useDeleteProperty } from "../../hook/useAddProperty";

export const SellAvaliable = () => {
    const { data, isLoading, isError, error } = useGetProperties();
    const deleteMutation = useDeleteProperty(); // Use delete hook
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchFilters, setSearchFilters] = useState({
        searchText: "",
        minPrice: "",
        maxPrice: "",
        bhk: "",
        ownership: ""
    });

    // Filter data based on rentOrSale and status first
    const rentSoldProperties = data?.filter(
        (property) => property.rentOrSale === "Sale" && property.status === "Available"
    ) || [];

    // Apply search filters
    const filteredProperties = useMemo(() => {
        if (!data) return [];
        return rentSoldProperties.filter((property) => {
            // Text search across multiple fields
            const searchText = searchFilters.searchText.toLowerCase();
            const matchesText = searchText === "" || 
                property.title?.toLowerCase().includes(searchText) ||
                property.houseNo?.toString().toLowerCase().includes(searchText) ||
                property.block?.toLowerCase().includes(searchText) ||
                property.pocket?.toLowerCase().includes(searchText) ||
                property.reference?.toLowerCase().includes(searchText);

            // Price range filter
            const price = property.price || 0;
            const minPrice = searchFilters.minPrice === "" ? 0 : Number(searchFilters.minPrice);
            const maxPrice = searchFilters.maxPrice === "" ? Infinity : Number(searchFilters.maxPrice);
            const matchesPrice = price >= minPrice && price <= maxPrice;

            // BHK filter
            const matchesBHK = searchFilters.bhk === "" || 
                property.bhk?.toString() === searchFilters.bhk;

            // Ownership filter
            const matchesOwnership = searchFilters.ownership === "" || 
                property.hpOrFreehold?.toLowerCase().includes(searchFilters.ownership.toLowerCase());

            return matchesText && matchesPrice && matchesBHK && matchesOwnership;
        });
    }, [data, searchFilters]);

    // Handle early returns after all hooks
    if (isLoading) return <p>Loading properties...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    const handleFilterChange = (filterName, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setSearchFilters({
            searchText: "",
            minPrice: "",
            maxPrice: "",
            bhk: "",
            ownership: ""
        });
    };

    const handleEdit = (property) => {
        // Navigate to add-property page with property data
        navigate("/edit-property", { 
            state: { property } 
        });
    };

    const handleDelete = (propertyId) => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            deleteMutation.mutate(propertyId, {
                onSuccess: () => {
                    // Invalidate and refetch properties
                    queryClient.invalidateQueries({ queryKey: ['properties'] });
                },
            });
        }
    };

    return (
        <div className="rent-sold-list">
            <h2>Sell Properties</h2>

            {/* Search Filters */}
            <div className="search-filters">
                <div className="filter-row">
                    <div className="search-input">
                        <input
                            type="text"
                            placeholder="Search by title, house no, block, pocket, reference..."
                            value={searchFilters.searchText}
                            onChange={(e) => handleFilterChange("searchText", e.target.value)}
                        />
                    </div>
                    <button onClick={clearFilters} className="clear-btn">
                        Clear All
                    </button>
                </div>

                <div className="filter-row">
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={searchFilters.minPrice}
                            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        />
                        <span>to</span>
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={searchFilters.maxPrice}
                            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        />
                    </div>

                    <select
                        value={searchFilters.bhk}
                        onChange={(e) => handleFilterChange("bhk", e.target.value)}
                    >
                        <option value="">Any BHK</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4 BHK</option>
                        <option value="5">5+ BHK</option>
                    </select>

                    <select
                        value={searchFilters.ownership}
                        onChange={(e) => handleFilterChange("ownership", e.target.value)}
                    >
                        <option value="">Any Ownership</option>
                        <option value="freehold">Freehold</option>
                        <option value="hp">HP</option>
                    </select>
                </div>

                <div className="results-count">
                    Showing {filteredProperties.length} of {rentSoldProperties.length} properties
                </div>
            </div>

            {filteredProperties.length === 0 ? (
                <p className="empty-state">
                    {rentSoldProperties.length === 0 
                        ? "No Rent Sold properties found." 
                        : "No properties match your search criteria. Try adjusting your filters."
                    }
                </p>
            ) : (
                <ul className="properties-grid">
                    {filteredProperties.map((property) => (
                        <li key={property._id} className="property-card">
                            <div className="status-badge">Available</div>
                            
                            <h3 className="property-title">{property.title}</h3>
                            
                            <p className="property-description">{property.description}</p>
                            
                            <div className="property-location">
                                <div className="property-info">
                                    <p><strong>House No:</strong> {property.houseNo}</p>
                                    {property.block && <p><strong>Block:</strong> {property.block}</p>}
                                    {property.pocket && <p><strong>Pocket:</strong> {property.pocket}</p>}
                                </div>
                            </div>

                            <div className="property-specs">
                                <p className="property-info">
                                    <strong>Floor:</strong> {property.floor}
                                </p>
                                <p className="property-info">
                                    <strong>BHK:</strong> {property.bhk}
                                </p>
                            </div>

                            <div className="property-details">
                                <p className="property-info">
                                    <strong>Ownership:</strong> {property.hpOrFreehold}
                                </p>
                            </div>

                            <div className="property-contact">
                                <p className="property-info">
                                    <strong>Reference:</strong> {property.reference}
                                </p>
                                <p className="property-info">
                                    <strong>Mobile:</strong> {property.phoneNumber}
                                </p>
                            </div>

                            <p className="property-price">
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    maximumFractionDigits: 0,
                                }).format(property.price)}
                            </p>

                            <div className="card-actions">
                                <button 
                                    onClick={() => handleEdit(property)}
                                    className="edit-btn"
                                    disabled={deleteMutation.isPending}
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(property._id)}
                                    className="delete-btn"
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? "🔄 Deleting..." : "🗑️ Delete"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};