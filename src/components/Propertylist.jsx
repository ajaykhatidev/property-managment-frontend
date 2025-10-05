import React from "react";
import { useGetProperties } from "../hook/useGetProperties";

export const PropertyList = () => {
  const { data, isLoading, isError, error } = useGetProperties();

  if (isLoading) return <p>Loading properties...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="property-list">
      <h2>Available Properties</h2>
      {data.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul>
          {data.map((property) => (
            <li key={property._id}>
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>
                <strong>{property.propertyType === "Shop" ? "Shop No" : "House No"}:</strong> {property.houseNo}, <strong>Block:</strong> {property.block},{" "}
                <strong>Pocket:</strong> {property.pocket}
              </p>
              {property.propertyType === "Shop" && property.shopSize && (
                <p>
                  <strong>Shop Size:</strong> {property.shopSize}
                </p>
              )}
              <p>
                <strong>BHK:</strong> {property.bhk} | <strong>Status:</strong> {property.status}
              </p>
              <p>
                <strong>Type:</strong> {property.rentOrSale} | <strong>Ownership:</strong> {property.hpOrFreehold}
              </p>
              <p>
                <strong>Reference:</strong> {property.reference}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
