import React, { useState } from "react";
import { useAddProperty } from "../hook/useAddProperty";
import { useNavigate } from "react-router-dom";

export const AddProperty = () => {
  const [formData, setFormData] = useState({
    sector: "",
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
  const mutation = useAddProperty();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        alert("✅ Property added successfully!");

        setFormData({
          sector: "",
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
      onError: () => {
        alert("❌ Failed to add property. Please try again.");
      },
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
          
          // Update form data (removed the length restriction)
          setFormData((prev) => {
            const newData = { ...prev, phoneNumber };
            console.log("Updated formData:", newData); // Debug log
            return newData;
          });
          
          alert(`Contact selected: ${phoneNumber}`); // Success feedback
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

  return (
    <div className="add-property-container">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit} className="add-property-form">
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
            <option value="120M">Plot</option>
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

        {/* House No */}
        <label>
          House No:
          <input
            type="text"
            name="houseNo"
            value={formData.houseNo}
            onChange={handleChange}
          />
        </label>

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
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i} value={i}>
                Floor {i}
              </option>
            ))}
            <option>Kothi</option>
            <option>Plot</option>
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
            <option value="5">1 RK</option>
            <option value="5">None</option>
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