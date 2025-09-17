import React, { useState } from "react";
import { useAddProperty } from "../hook/useAddProperty";
import { useNavigate } from "react-router-dom";

export const AddProperty = () => {
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
    price: "",        // ✅ new field
    phoneNumber: "",  // ✅ new field
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
        // ✅ Reset form
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
  };

  return (
    <div className="add-property-container">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit} className="add-property-form">
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>

        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </label>

        <label>
          House No:
          <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} required />
        </label>

        <label>
          Block:
          <input type="text" name="block" value={formData.block} onChange={handleChange} />
        </label>

        <label>
          Pocket:
          <input type="text" name="pocket" value={formData.pocket} onChange={handleChange} />
        </label>

        <label>
          Floor:
          <input type="text" name="floor" value={formData.floor} onChange={handleChange} />
        </label>

        <label>
          BHK:
          <select name="bhk" value={formData.bhk} onChange={handleChange} required>
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
          <select name="rentOrSale" value={formData.rentOrSale} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Rent">Rent</option>
            <option value="Sale">Sale</option>
          </select>
        </label>

        <label>
          HP / Freehold:
          <select name="hpOrFreehold" value={formData.hpOrFreehold} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="HP">HP</option>
            <option value="Freehold">Freehold</option>
          </select>
        </label>

        <label>
          Reference:
          <input type="text" name="reference" value={formData.reference} onChange={handleChange} />
        </label>

        {/* ✅ New Price Field */}
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter property price"
            required
          />
        </label>

        {/* ✅ New Phone Number Field */}
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => {
              // ✅ sirf numbers allow kare aur max 10 digits
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setFormData((prev) => ({ ...prev, phoneNumber: value }));
              }
            }}
            placeholder="Enter 10-digit number"
            required
          />
        </label>

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
