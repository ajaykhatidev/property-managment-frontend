import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Base URL for consistency
const BASE_URL = "https://property-managment-x0d8.onrender.com/api/properties";

export const useAddProperty = () => {
  return useMutation({
    mutationFn: async (newProperty) => {
      try {
        const res = await axios.post(BASE_URL, newProperty);
        return res.data;
      } catch (error) {
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      console.log("Property added successfully:", data);
      // Don't show alert here - let the component handle it
    },
    onError: (error) => {
      console.error("Add property error:", error);
      // Don't show alert here - let the component handle it
    },
  });
};

export const useUpdateProperty = () => {
  return useMutation({
    mutationFn: async ({ id, propertyData }) => {
      try {
        // Remove the extra space in URL
        const res = await axios.put(`${BASE_URL}/${id}`, propertyData);
        return res.data;
      } catch (error) {
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      console.log("Property updated successfully:", data);
      // Don't show alert here - let the component handle it
    },
    onError: (error) => {
      console.error("Update property error:", error);
      // Don't show alert here - let the component handle it
    },
  });
};

export const useDeleteProperty = () => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        if (!id) {
          throw new Error("Property ID is required");
        }
        const res = await axios.delete(`${BASE_URL}/${id}`);
        return res.data;
      } catch (error) {
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      console.log("Property deleted successfully:", data);
      // Don't show alert here - let the component handle it
    },
    onError: (error) => {
      console.error("Delete property error:", error);
      // Don't show alert here - let the component handle it
    },
  });
};

// Additional hook for fetching single property (useful for edit forms)
export const useFetchProperty = () => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        if (!id) {
          throw new Error("Property ID is required");
        }
        const res = await axios.get(`${BASE_URL}/${id}`);
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
  });
};

// Hook for bulk operations (optional - for future use)
export const useBulkDeleteProperties = () => {
  return useMutation({
    mutationFn: async (propertyIds) => {
      try {
        if (!propertyIds || propertyIds.length === 0) {
          throw new Error("Property IDs are required");
        }
        const res = await axios.delete(`${BASE_URL}/bulk`, {
          data: { ids: propertyIds }
        });
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      console.log("Properties deleted successfully:", data);
    },
    onError: (error) => {
      console.error("Bulk delete error:", error);
    },
  });
};