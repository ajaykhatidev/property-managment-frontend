import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useAddProperty = () => {
  return useMutation({
    mutationFn: async (newProperty) => {
      const res = await axios.post("https://property-managment-x0d8.onrender.com/api/properties", newProperty);
      return res.data;
    },
    onSuccess: (data) => {
      alert("✅ Property added successfully!");
      console.log("Response:", data);
    },
    onError: (error) => {
      alert("❌ Failed to add property");
      console.error(error);
    },
  });
};

export const useUpdateProperty = () => {
  return useMutation({
    mutationFn: async ({ id, propertyData }) => {
      const res = await axios.put(` https://property-managment-x0d8.onrender.com/api/properties/${id}`, propertyData);
      return res.data;
    },
    onSuccess: (data) => {
      alert("✅ Property updated successfully!");
      console.log("Response:", data);
    },
    onError: (error) => {
      alert("❌ Failed to update property");
      console.error(error);
    },
  });
};

export const useDeleteProperty = () => {
  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`https://property-managment-x0d8.onrender.com/api/properties/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      alert("✅ Property deleted successfully!");
      console.log("Response:", data);
    },
    onError: (error) => {
      alert("❌ Failed to delete property");
      console.error(error);
    },
  });
};