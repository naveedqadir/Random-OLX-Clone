import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Skeleton, Icon, Text, VStack } from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";

const MapComponent = ({ area, city, state }) => {
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const address = `${area}, ${city}, ${state}`;
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address
          )}&format=json&limit=1`,
          {
            headers: {
              'Accept-Language': 'en'
            }
          }
        );

        // Extract the latitude and longitude from the response
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (error) {
        console.error("Error fetching geocoded location:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [area, city, state]);

  return (
    <Box 
      w="100%" 
      h="220px" 
      overflow="hidden" 
      borderRadius="2xl" 
      bg="rgba(255,255,255,0.7)"
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor="rgba(255,255,255,0.3)"
      boxShadow="0 15px 35px rgba(0,0,0,0.08)"
      position="relative"
    >
      {isLoading ? (
        <Skeleton 
          w="100%" 
          h="100%" 
          startColor="rgba(102,126,234,0.1)" 
          endColor="rgba(118,75,162,0.1)" 
        />
      ) : position ? (
        <>
          <iframe
            title="Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${position[1]}!3d${position[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1684765091573!5m2!1sen!2sin`}
            allowFullScreen=""
          />
          <Box
            position="absolute"
            bottom={3}
            left={3}
            bg="rgba(255,255,255,0.95)"
            backdropFilter="blur(10px)"
            px={3}
            py={2}
            borderRadius="xl"
            boxShadow="0 4px 15px rgba(0,0,0,0.1)"
          >
            <Icon as={FiMapPin} color="#667eea" mr={2} />
            <Text as="span" fontSize="sm" fontWeight="600" color="gray.700">
              {area}, {city}
            </Text>
          </Box>
        </>
      ) : (
        <VStack justify="center" h="100%" spacing={3}>
          <Icon as={FiMapPin} w={10} h={10} color="rgba(102,126,234,0.3)" />
          <Text color="gray.400" fontSize="sm">Location not available</Text>
        </VStack>
      )}
    </Box>
  );
};

export default MapComponent;
