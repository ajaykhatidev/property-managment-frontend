import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api-client.js";

const fetchProperties = async (filters) => {
  const response = await api.getProperties(filters);
  return response.data;
};

export const useGetProperties = (filters = {}) => {
  return useQuery({
    queryKey: ["properties", filters], 
    queryFn: () => fetchProperties(filters),
    refetchOnWindowFocus: true,   // ✅ jab window/tab active hota hai
    refetchInterval: 5000,        // ✅ har 5 sec me auto-refresh
  });
};



// 
// http://localhost:3000/api/properties
// https://property-managment-x0d8.onrender.com/api/properties