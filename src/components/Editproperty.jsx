import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateProperty } from "../hook/useAddProperty";

export const Editproperty = () => {
  const [formData, setFormData] = useState({
    sector: "",
    title: "",
    description: "",
    propertyType: "",
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
  const updateMutation = useUpdateProperty();
  
  // Get property data from navigation state
  const propertyToEdit = location.state?.property;

  // Fill form data when component loads
  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        sector: propertyToEdit.sector || "",
        title: propertyToEdit.title || "",
        description: propertyToEdit.description || "",
        propertyType: propertyToEdit.propertyType || "",
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
  }, [propertyToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!propertyToEdit?._id) {
      alert("❌ Property ID not found. Please try again.");
      return;
    }

    updateMutation.mutate({
      id: propertyToEdit._id,
      propertyData: formData
    }, {
      onSuccess: () => {
        alert("✅ Property updated successfully!");
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        navigate(-1); // Go back to previous page
      },
      onError: (error) => {
        alert(`❌ Failed to update property: ${error?.message || "Unknown error"}`);
      }
    });
  };

const handleSelectFromContacts = async () => {
  console.log("Contact picker clicked"); // Debug log
  
  try {
    if ("contacts" in navigator && "ContactsManager" in window) {
      const props = ["name", "tel"];
      const opts = { multiple: false };
      const contacts = await navigator.contacts.select(props, opts);

      console.log("Selected contacts:", contacts); // Debug log

      if (contacts.length > 0) {
        const contact = contacts[0];
        console.log("Contact details:", contact); // Debug log
        
        if (contact.tel && contact.tel.length > 0) {
          let phoneNumber = contact.tel[0].replace(/\D/g, "");
          console.log("Original cleaned number:", phoneNumber); // Debug log
          
          // Handle different phone number formats
          if (phoneNumber.length === 11 && phoneNumber.startsWith('1')) {
            // Remove US country code (+1)
            phoneNumber = phoneNumber.substring(1);
          } else if (phoneNumber.length === 12 && phoneNumber.startsWith('91')) {
            // Remove India country code (+91)
            phoneNumber = phoneNumber.substring(2);
          } else if (phoneNumber.length > 10) {
            // Take last 10 digits for any other long format
            phoneNumber = phoneNumber.slice(-10);
          }
          
          console.log("Processed phone number:", phoneNumber); // Debug log
          console.log("Phone number length:", phoneNumber.length); // Debug log
          
          // Get contact name for reference
          const contactName = contact.name && contact.name.length > 0 ? contact.name[0] : "";
          
          // Update form data with both phone number and reference name
          setFormData((prev) => {
            const newData = { 
              ...prev, 
              phoneNumber,
              reference: contactName || prev.reference // Only update if contact has a name
            };
            console.log("Updated formData:", newData); // Debug log
            return newData;
          });
          
          alert(`Contact selected: ${contactName ? contactName + ' - ' : ''}${phoneNumber}`); // Success feedback
        } else {
          alert("Selected contact has no phone number");
        }
      } else {
        console.log("No contacts selected");
      }
    } else {
      alert("Contact selection is not supported on this device/browser");
    }
  } catch (error) {
    console.error("Error accessing contacts:", error);
    
    // More specific error handling
    if (error.name === 'AbortError') {
      console.log("User cancelled contact selection");
    } else if (error.name === 'NotSupportedError') {
      alert("Contact picker not supported on this browser");
    } else {
      alert("Unable to access contacts. Please enter number manually.");
    }
  }
};

  // If no property data, show error
  if (!propertyToEdit) {
    return (
      <div className="add-property-container">
        <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          ❌ No property data found. Please select a property to edit.
          <br />
          <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-property-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        <h2>Edit Property</h2>
      </div>
      
      {updateMutation.isError && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#ffe6e6', borderRadius: '4px' }}>
          ❌ {updateMutation.error?.message || "Failed to update property"}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="add-property-form">
        {/* Sector */}
        <label>
          Sector:
          <select
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select Sector</option>
            {Array.from({ length: 40 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Sector {i + 1}
              </option>
            ))}
          </select>
        </label>

        {/* Title */}
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter property title"
            disabled={updateMutation.isPending}
          />
        </label>

        {/* Description */}
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter property description"
            disabled={updateMutation.isPending}
          />
        </label>

        {/* Property Type */}
        <label>
          Property Type:
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select Type</option>
            <option value="House">House</option>
            <option value="Shop">Shop</option>
          </select>
        </label>

        {/* Conditional Input based on Property Type */}
        {formData.propertyType === "House" && (
          <label>
            House No:
            <input
              type="text"
              name="houseNo"
              value={formData.houseNo}
              onChange={handleChange}
              placeholder="Enter house number"
              disabled={updateMutation.isPending}
            />
          </label>
        )}

        {formData.propertyType === "Shop" && (
          <label>
            Shop Size:
            <input
              type="text"
              name="houseNo"
              value={formData.houseNo}
              onChange={handleChange}
              placeholder="Enter shop size (e.g., 10x15, 200 sq ft)"
              disabled={updateMutation.isPending}
            />
          </label>
        )}

        {/* Block */}
        <label>
          Block:
          <select 
            name="block" 
            value={formData.block} 
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select Block</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option
                key={String.fromCharCode(65 + i)}
                value={String.fromCharCode(65 + i)}
              >
                Block {String.fromCharCode(65 + i)}
              </option>
            ))}
            <option value="Others">Others</option>
          </select>
        </label>

        {/* Pocket */}
        <label>
          Pocket:
          <select 
            name="pocket" 
            value={formData.pocket} 
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select Pocket</option>
            {Array.from({ length: 50 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Pocket {i + 1}
              </option>
            ))}
            <option value="Others">Others</option>
          </select>
        </label>

        {/* Floor */}
        <label>
          Floor:
          <select 
            name="floor" 
            value={formData.floor} 
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select Floor</option>
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i} value={i}>
                Floor {i}
              </option>
            ))}
          </select>
          <option>Kothi</option>
          <option>Plot</option>
        </label>

        {/* BHK */}
        <label>
          BHK:
          <select
            name="bhk"
            value={formData.bhk}
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5 BHK</option>
            <option value="5">1 RK</option>
            <option value="5">None</option>
          </select>
        </label>

        {/* Rent/Sale */}
        <label>
          Rent / Sale:
          <select
            name="rentOrSale"
            value={formData.rentOrSale}
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select</option>
            <option value="Rent">Rent</option>
            <option value="Sale">Sale</option>
            <option value="Lease">Lease</option>
          </select>
        </label>

        {/* HP/Freehold */}
        <label>
          HP / Freehold:
          <select
            name="hpOrFreehold"
            value={formData.hpOrFreehold}
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="">Select</option>
            <option value="HP">HP</option>
            <option value="Freehold">Freehold</option>
          </select>
        </label>

        {/* Reference */}
        <label>
          Reference:
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            disabled={updateMutation.isPending}
          />
        </label>

        {/* Price */}
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter property price"
            disabled={updateMutation.isPending}
          />
        </label>

        {/* Phone */}
        <label>
          Phone Number:
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
              style={{ flex: 1 }}
              disabled={updateMutation.isPending}
            />
            <button
              type="button"
              onClick={handleSelectFromContacts}
              disabled={updateMutation.isPending}
              style={{
                padding: "8px 12px",
                background: updateMutation.isPending ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: updateMutation.isPending ? "not-allowed" : "pointer",
                fontSize: "12px",
              }}
            >
              📞 Contacts
            </button>
          </div>
        </label>

        {/* Status */}
        <label>
          Status:
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            disabled={updateMutation.isPending}
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </label>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 24px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            disabled={updateMutation.isPending}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            style={{
              padding: "12px 24px",
              background: updateMutation.isPending ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: updateMutation.isPending ? "not-allowed" : "pointer",
              flex: 1
            }}
          >
            {updateMutation.isPending ? "Updating..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
};