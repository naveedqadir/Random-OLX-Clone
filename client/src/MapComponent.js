import React, { useState, useEffect } from "react";
import axios from "axios";

const MapComponent = ({ area, city, state }) => {
  const [position, setPosition] = useState(null);
  const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = `${area}, ${city}, ${state}`;
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        address
          )}&apiKey=${apiKey}`
        );

        // Extract the latitude and longitude from the response
        if (
          response.data &&
          response.data.features &&
          response.data.features.length > 0
        ) {
          const { lat, lon } = response.data.features[0].properties;
          setPosition([lat, lon]);
        }
      } catch (error) {
        console.error("Error fetching geocoded location:", error);
      }
    };

    fetchData();
  }, [area, city, state, apiKey]);

  return (
    <div>
      {position && (
        <img
          alt="Map"
          src={`https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=300&height=200&center=lonlat:${position[1]},${position[0]}&zoom=10&apiKey=${apiKey}`}
          style={{ width: "100%", height: "200px" }}
        />
      )}
    </div>
  );
};

export default MapComponent;
