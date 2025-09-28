import { useMutation } from "@tanstack/react-query";
import { api, default as apiClient } from "../api/api-client.js";

export const useAddProperty = () => {
  return useMutation({
    mutationFn: async (newProperty) => {
      try {
        const res = await api.addProperty(newProperty);
        return res.data;
      } catch (error) {
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      // Don't show alert here - let the component handle it
    },
    onError: (error) => {
      // Don't show alert here - let the component handle it
    },
  });
};

export const useUpdateProperty = () => {
  return useMutation({
    mutationFn: async ({ id, propertyData }) => {
      try {
        const res = await api.updateProperty(id, propertyData);
        return res.data;
      } catch (error) {
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      // Don't show alert here - let the component handle it
    },
    onError: (error) => {
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
        const res = await api.deleteProperty(id);
        return res.data;
      } catch (error) {
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      // Don't show alert here - let the component handle it
    },
    onError: (error) => {
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
        const res = await api.getProperty(id);
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
        const res = await apiClient.delete('/properties/bulk', {
          data: { ids: propertyIds }
        });
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
    },
    onError: (error) => {
    },
  });
};