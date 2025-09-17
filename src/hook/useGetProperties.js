import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProperties = async () => {
  const { data } = await axios.get("https://property-managment-x0d8.onrender.com/api/properties");
  return data;
};

export const useGetProperties = () => {   
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });
};


// 
// http://localhost:3000/api/properties
// https://property-managment-x0d8.onrender.com/api/properties