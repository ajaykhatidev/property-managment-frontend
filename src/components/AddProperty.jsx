import React, { useState } from "react";
import { useAddProperty } from "../hook/useAddProperty";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import PageHeader from './Navigation/PageHeader';
import Breadcrumb from './Navigation/Breadcrumb';

export const AddProperty = () => {
  const [formData, setFormData] = useState({
    sector: "",
    title: "",
    description: "",
    propertyType: "",
    houseNo: "",
    shopNo: "",
    shopSize: "",
    block: "",
    pocket: "",
    floor: "",
    propertyCategory: "",
    bhk: "",
    rentOrSale: "",
    hpOrFreehold: "",
    reference: "",
    price: "",
    phoneNumber: "",
    status: "Available",
  });

  const navigate = useNavigate();
  const mutation = useAddProperty();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear opposite fields when switching property type
    if (name === 'propertyType') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        houseNo: value === 'House' ? prev.houseNo : '',
        shopNo: value === 'Shop' ? prev.shopNo : '',
        shopSize: value === 'Shop' ? prev.shopSize : ''
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.sector) {
      toast.error('Please select a sector');
      return;
    }
    if (!formData.title) {
      toast.error('Please select a title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter description');
      return;
    }
    if (!formData.propertyType) {
      toast.error('Please select property type');
      return;
    }
    if (formData.propertyType === "House" && !formData.houseNo.trim()) {
      toast.error('Please enter house number');
      return;
    }
    if (formData.propertyType === "Shop" && !formData.shopNo.trim()) {
      toast.error('Please enter shop number');
      return;
    }
    if (formData.propertyType === "Shop" && !formData.shopSize.trim()) {
      toast.error('Please enter shop size');
      return;
    }
    if (!formData.bhk) {
      toast.error('Please select BHK');
      return;
    }
    if (!formData.rentOrSale) {
      toast.error('Please select Rent/Sale/Lease');
      return;
    }
    if (!formData.hpOrFreehold) {
      toast.error('Please select HP/Freehold/Lease');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Convert price to number
    const propertyData = {
      ...formData,
      price: Number(formData.price)
    };

    console.log('📝 Sending property data:', propertyData);


    mutation.mutate(propertyData, {
      onSuccess: () => {
        toast.success('Property added successfully!');

        setFormData({
          sector: "",
          title: "",
          description: "",
          propertyType: "",
          houseNo: "",
          shopNo: "",
          shopSize: "",
          block: "",
          pocket: "",
          floor: "",
          propertyCategory: "",
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
      onError: (error) => {
        toast.error(`Failed to add property: ${error.message}`);
      },
    });
  };

const handleSelectFromContacts = async () => {
  try {
    if ("contacts" in navigator && "ContactsManager" in window) {
      const props = ["name", "tel"];
      const opts = { multiple: false };
      const contacts = await navigator.contacts.select(props, opts);

      if (contacts.length > 0) {
        const contact = contacts[0];
        
        if (contact.tel && contact.tel.length > 0) {
          let phoneNumber = contact.tel[0].replace(/\D/g, "");
          
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
          
          // Get contact name for reference
          const contactName = contact.name && contact.name.length > 0 ? contact.name[0] : "";
          
          // Update form data with both phone number and reference name
          setFormData((prev) => {
            const newData = { 
              ...prev, 
              phoneNumber,
              reference: contactName || prev.reference // Only update if contact has a name
            };
            return newData;
          });
          
          toast.success(`Contact selected: ${contactName ? contactName + ' - ' : ''}${phoneNumber}`);
        } else {
          toast.error("Selected contact has no phone number");
        }
      }
    } else {
      toast.error("Contact selection is not supported on this device/browser");
    }
  } catch (error) {
    // More specific error handling
    if (error.name === 'AbortError') {
      // User cancelled contact selection
    } else if (error.name === 'NotSupportedError') {
      toast.error("Contact picker not supported on this browser");
    } else {
      toast.error("Unable to access contacts. Please enter number manually.");
    }
  }
};

  return (
    <div className="add-property-container">
      <Breadcrumb />
      <PageHeader 
        title="Add New Property" 
        subtitle="Add a new property to your portfolio"
        fallbackPath="/"
      />
      <form onSubmit={handleSubmit} className="add-property-form">

      <label>
          Property Category:
          <select name="propertyCategory" value={formData.propertyCategory || ""} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </label>





        {/* Sector */}
        <label>
          Sector:
          <select
            name="sector"
            value={formData.sector}
            onChange={handleChange}
          >
            <option value="">Select Sector</option>
            {Array.from({ length: 40 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Sector {i + 1}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          
        </label>

        {/* Title */}
        <label>
          Title:
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
          >
            <option value="">Select Title</option>
            <option value="JANTA">JANTA</option>
            <option value="LIG">LIG</option>
            <option value="MIG">MIG</option>
            <option value="HIG">HIG</option>
            <option value="26M">26M</option>
            <option value="48M">48M</option>
            <option value="60M">60M</option>
            <option value="90M">90M</option>
            <option value="52M">52M</option>
            <option value="96M">96M</option>
            <option value="120M">120M</option>
            <option value="Plot">Plot</option>
            <option value="DDA MARKET">DDA MARKET</option>
            <option value="Others">Others</option>
          </select>
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
          />
        </label>

        {/* Property Type */}
        <label>
          Property Type:
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
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
            />
          </label>
        )}

        {formData.propertyType === "Shop" && (
          <>
            <label>
              Shop No:
              <input
                type="text"
                name="shopNo"
                value={formData.shopNo}
                onChange={handleChange}
                placeholder="Enter shop number"
              />
            </label>
            <label>
              Shop Size:
              <input
                type="text"
                name="shopSize"
                value={formData.shopSize || ""}
                onChange={handleChange}
                placeholder="Enter shop size (e.g., 10x15, 200 sq ft)"
              />
            </label>
          </>
        )}

        {/* Block */}
        <label>
          Block:
          <select name="block" value={formData.block} onChange={handleChange}>
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
          <select name="pocket" value={formData.pocket} onChange={handleChange}>
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
          <select name="floor" value={formData.floor} onChange={handleChange}>
            <option value="">Select Floor</option>
            <option value="0">Ground Floor</option>
            <option value="1">1st Floor</option>
            <option value="2">2nd Floor</option>
            <option value="3">3rd Floor</option>
            <option value="4">4th Floor</option>
            <option value="5">5th Floor</option>
            <option value="Kothi">Kothi</option>
            <option value="Plot">Plot</option>
          </select>
        </label>


        


        <label>
          BHK:
          <select
            name="bhk"
            value={formData.bhk}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>  
            <option value="4">4 BHK</option>
            <option value="5">5 BHK</option>
            <option value="RK">1 RK</option>
            <option value="0">None</option>
          </select>
        </label>

        <label>
          Rent / Sale:
          <select
            name="rentOrSale"
            value={formData.rentOrSale}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Rent">Rent</option>
            <option value="Sale">Sale</option>
            <option value="Lease">Lease</option>
          </select>
        </label>

        <label>
          HP / Freehold:
          <select
            name="hpOrFreehold"
            value={formData.hpOrFreehold}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="HP">HP</option>
            <option value="Freehold">Freehold</option>
            <option value="Lease">Lease</option>
          </select>
        </label>

        <label>
          Reference:
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
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
            />
            <button
              type="button"
              onClick={handleSelectFromContacts}
              style={{
                padding: "8px 12px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              📞 Contacts
            </button>
          </div>
        </label>


         <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter property price"
          />
        </label>

        {/* Status */}
        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </label>

        <button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Submitting..." : "Submit Property"}
        </button>
      </form>
    </div>
  );
};