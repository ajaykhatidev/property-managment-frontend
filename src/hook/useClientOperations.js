import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api-client.js";

// Client Query Hooks
export const useGetClients = (filters = {}) => {
  return useQuery({
    queryKey: ["clients", filters],
    queryFn: async () => {
      const response = await api.getClients(filters);
      return response.data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
};

export const useGetClient = (id) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.getClient(id);
      return response.data;
    },
    enabled: !!id, // Only run query if id exists
  });
};

// Client Mutation Hooks
export const useAddClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clientData) => {
      try {
        const res = await api.addClient(clientData);
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, clientData }) => {
      try {
        const res = await api.updateClient(id, clientData);
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate clients list
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      // Update specific client cache
      queryClient.setQueryData(["client", variables.id], data);
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      try {
        if (!id) {
          throw new Error("Client ID is required");
        }
        const res = await api.deleteClient(id);
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data, id) => {
      // Invalidate clients list
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      // Remove specific client from cache
      queryClient.removeQueries({ queryKey: ["client", id] });
    },
  });
};

// Bulk operations hook (for future use)
export const useBulkDeleteClients = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clientIds) => {
      try {
        if (!clientIds || clientIds.length === 0) {
          throw new Error("Client IDs are required");
        }
        // This would need to be implemented in the backend
        const res = await api.delete('/clients/bulk', {
          data: { ids: clientIds }
        });
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      // Invalidate all client queries
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
