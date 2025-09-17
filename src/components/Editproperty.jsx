// Updated Editproperty component
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
// import { useAddProperty } from './hooks/useAddProperty'; // Import your existing hook
import { useUpdateProperty } from "../hook/useAddProperty";
// import { useAddProperty, useUpdateProperty } from "./hooks/useAddProperty"; // Import the new hook

export const Editproperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    houseNo: "",
    block: "",
    pocket: "",
    floor: "",
    bhk: "",
    rentOrSale: "",
    hpOrFreehold: "",
    reference: "",
    price: "",
    phoneNumber: "",
    status: "Available",
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Use your custom hooks
//   const addMutation = useAddProperty();
  const updateMutation = useUpdateProperty();
  
  // Check if we're in edit mode
  const isEditMode = Boolean(id) || Boolean(location.state?.property);
  const propertyToEdit = location.state?.property;

  // Fill form data when editing
  useEffect(() => {
    if (isEditMode && propertyToEdit) {
      setFormData({
        title: propertyToEdit.title || "",
        description: propertyToEdit.description || "",
        houseNo: propertyToEdit.houseNo || "",
        block: propertyToEdit.block || "",
        pocket: propertyToEdit.pocket || "",
        floor: propertyToEdit.floor || "",
        bhk: propertyToEdit.bhk || "",
        rentOrSale: propertyToEdit.rentOrSale || "",
        hpOrFreehold: propertyToEdit.hpOrFreehold || "",
        reference: propertyToEdit.reference || "",
        price: propertyToEdit.price || "",
        phoneNumber: propertyToEdit.phoneNumber || "",
        status: propertyToEdit.status || "Available",
      });
    }
  }, [isEditMode, propertyToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      // Update existing property
      updateMutation.mutate({
        id: propertyToEdit._id || id,
        propertyData: formData
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['properties'] });
          navigate(-1);
        },
      });
    } else {
      // Add new property
      addMutation.mutate(formData, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['properties'] });
          // Reset form after successful addition
          setFormData({
            title: "",
            description: "",
            houseNo: "",
            block: "",
            pocket: "",
            floor: "",
            bhk: "",
            rentOrSale: "",
            hpOrFreehold: "",
            reference: "",
            price: "",
            phoneNumber: "",
            status: "Available",
          });
          navigate(-1);
        },
      });
    }
  };

  // Get loading state from appropriate mutation
  const isLoading = isEditMode ? updateMutation.isPending : addMutation.isPending;
  const error = isEditMode ? updateMutation.error : addMutation.error;

  return (
    <div className="add-property-container">
      <h2>{isEditMode ? "Edit Property" : "Add New Property"}</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="add-property-form">
        <label>
          Title:
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </label>

        <label>
          Description:
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required
            disabled={isLoading}
          ></textarea>
        </label>

        <label>
          House No:
          <input 
            type="text" 
            name="houseNo" 
            value={formData.houseNo} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </label>

        <label>
          Block:
          <input 
            type="text" 
            name="block" 
            value={formData.block} 
            onChange={handleChange} 
            disabled={isLoading}
          />
        </label>

        <label>
          Pocket:
          <input 
            type="text" 
            name="pocket" 
            value={formData.pocket} 
            onChange={handleChange} 
            disabled={isLoading}
          />
        </label>

        <label>
          Floor:
          <input 
            type="text" 
            name="floor" 
            value={formData.floor} 
            onChange={handleChange} 
            disabled={isLoading}
          />
        </label>

        <label>
          BHK:
          <select 
            name="bhk" 
            value={formData.bhk} 
            onChange={handleChange} 
            required
            disabled={isLoading}
          >
            <option value="">Select</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5 BHK</option>
          </select>
        </label>

        <label>
          Rent / Sale:
          <select 
            name="rentOrSale" 
            value={formData.rentOrSale} 
            onChange={handleChange} 
            required
            disabled={isLoading}
          >
            <option value="">Select</option>
            <option value="Rent">Rent</option>
            <option value="Sale">Sale</option>
          </select>
        </label>

        <label>
          HP / Freehold:
          <select 
            name="hpOrFreehold" 
            value={formData.hpOrFreehold} 
            onChange={handleChange} 
            required
            disabled={isLoading}
          >
            <option value="">Select</option>
            <option value="HP">HP</option>
            <option value="Freehold">Freehold</option>
          </select>
        </label>

        <label>
          Reference:
          <input 
            type="text" 
            name="reference" 
            value={formData.reference} 
            onChange={handleChange} 
            disabled={isLoading}
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter property price"
            required
            disabled={isLoading}
          />
        </label>

        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setFormData((prev) => ({ ...prev, phoneNumber: value }));
              }
            }}
            placeholder="Enter 10-digit number"
            required
            disabled={isLoading}
          />
        </label>

        <label>
          Status:
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading 
            ? (isEditMode ? "Updating..." : "Submitting...") 
            : (isEditMode ? "Update Property" : "Submit Property")
          }
        </button>
      </form>
    </div>
  );
};