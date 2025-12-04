import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Input,
  Box,
  List,
  ListItem,
  Text,
  Flex,
  Icon,
  Spinner,
  VStack,
  HStack
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaSearchLocation, FaMapMarkedAlt } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import axios from "axios";
import { State, City } from "country-state-city";

const CurrentLocation = ({
  onaddressSelect,
  onlocationSelect,
  setAddOrLoc,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stateDropdownValue, setStateDropdownValue] = useState(null);
  const [stateCode, setStateCode] = useState(null);
  const [cityDropdownValue, setCityDropdownValue] = useState(null);
  const [address, setAddress] = useState({});

  useEffect(() => {
    setAddOrLoc("location");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabsChange = (index) => {
    setTabIndex(index);

    if (index === 1) { // Current Location tab
      setLoading(true);
      setAddOrLoc("address");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          // Don't set loading to false here - wait for API call to complete
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
      setAddOrLoc("location");
    }
  };

  const states = State.getStatesOfCountry("IN");
  const cities =
    stateDropdownValue != null ? City.getCitiesOfState("IN", stateCode) : [];

  useEffect(() => {
    if (latitude && longitude) {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en'
            }
          }
        )
        .then((response) => {
          const addr = response.data.address || {};
          const formattedAddr = {
            state: addr.state || addr.region || "Not available",
            city: addr.city || addr.town || addr.village || addr.county || addr.municipality || "Not available",
            area: addr.suburb || addr.neighbourhood || addr.locality || addr.road || "Not available",
            postcode: addr.postcode || "Not available",
          };
          
          setAddress(formattedAddr);
          onaddressSelect(formattedAddr);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Geolocation error:", error);
          setAddress({
            state: "Unable to fetch",
            city: "Unable to fetch", 
            area: "Unable to fetch",
            postcode: "Unable to fetch"
          });
          setLoading(false);
        });
    }
  }, [latitude, longitude, onaddressSelect]);

  const handleAddressChange = (event) => {
    const loc = {
      state: stateDropdownValue,
      city: cityDropdownValue,
      area: event.target.value,
    };
    setLocation(loc);
    if (stateDropdownValue && cityDropdownValue) {
      onlocationSelect(loc);
    }
  };

  return (
    <Box 
      mt={6} 
      mb={6}
    >
      <HStack mb={4}>
        <Icon as={FiMapPin} w={5} h={5} color="#667eea" />
        <Text fontWeight="700" fontSize="lg" color="gray.700">Location</Text>
      </HStack>

      <Tabs 
        index={tabIndex} 
        onChange={handleTabsChange} 
        isFitted 
        variant="soft-rounded"
      >
        <TabList 
          mb={6}
          bg="gray.100"
          borderRadius="xl"
          p={1.5}
        >
          <Tab 
            borderRadius="lg"
            fontWeight="600"
            color="gray.600"
            _selected={{ 
              bg: 'white', 
              color: '#667eea',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
            transition="all 0.2s ease"
          >
            <Icon as={FaSearchLocation} mr={2} />
            Select Location
          </Tab>
          <Tab 
            borderRadius="lg"
            fontWeight="600"
            color="gray.600"
            _selected={{ 
              bg: 'white', 
              color: '#667eea',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
            transition="all 0.2s ease"
          >
            <Icon as={FaMapMarkedAlt} mr={2} />
            Current Location
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <VStack spacing={4}>
              <Menu matchWidth>
                <MenuButton 
                  as={Button} 
                  rightIcon={<ChevronDownIcon />} 
                  width="100%"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  h="50px"
                  fontWeight="500"
                  color={stateDropdownValue ? "gray.800" : "gray.500"}
                  textAlign="left"
                  justifyContent="space-between"
                  _hover={{ borderColor: 'gray.300', bg: 'gray.50' }}
                  _active={{ borderColor: '#667eea', bg: 'white' }}
                >
                  {stateDropdownValue || "Select State"}
                </MenuButton>
                <MenuList 
                  maxH="250px" 
                  overflowY="auto" 
                  borderRadius="xl"
                  boxShadow="0 10px 40px rgba(0,0,0,0.15)"
                  border="1px solid"
                  borderColor="gray.100"
                  py={2}
                >
                  {states.map((state) => (
                    <MenuItem
                      key={state.isoCode}
                      onClick={() => {
                        setStateDropdownValue(state.name);
                        setStateCode(state.isoCode);
                        setCityDropdownValue(null);
                      }}
                      _hover={{ bg: 'purple.50', color: 'purple.600' }}
                      fontWeight="500"
                      py={2}
                    >
                      {state.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Menu matchWidth>
                <MenuButton 
                  as={Button} 
                  rightIcon={<ChevronDownIcon />} 
                  width="100%" 
                  isDisabled={!stateCode}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  h="50px"
                  fontWeight="500"
                  color={cityDropdownValue ? "gray.800" : "gray.500"}
                  textAlign="left"
                  justifyContent="space-between"
                  _hover={{ borderColor: 'gray.300', bg: 'gray.50' }}
                  _active={{ borderColor: '#667eea', bg: 'white' }}
                  _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  {cityDropdownValue || "Select City"}
                </MenuButton>
                <MenuList 
                  maxH="250px" 
                  overflowY="auto"
                  borderRadius="xl"
                  boxShadow="0 10px 40px rgba(0,0,0,0.15)"
                  border="1px solid"
                  borderColor="gray.100"
                  py={2}
                >
                  {cities.map((city) => (
                    <MenuItem
                      key={city.name}
                      onClick={() => setCityDropdownValue(city.name)}
                      _hover={{ bg: 'purple.50', color: 'purple.600' }}
                      fontWeight="500"
                      py={2}
                    >
                      {city.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Input
                placeholder="Enter Area Details"
                onChange={handleAddressChange}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                h="50px"
                px={4}
                fontWeight="500"
                color="gray.800"
                _placeholder={{ color: 'gray.500' }}
                _focus={{
                  borderColor: '#667eea',
                  boxShadow: '0 0 0 3px rgba(102,126,234,0.15)'
                }}
                _hover={{ borderColor: 'gray.300' }}
              />
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            {loading ? (
              <Flex 
                justify="center" 
                align="center" 
                h="200px"
                bg="rgba(102,126,234,0.05)"
                borderRadius="xl"
              >
                <VStack>
                  <Spinner size="xl" color="#667eea" thickness="4px" />
                  <Text color="gray.500" mt={3}>Detecting your location...</Text>
                </VStack>
              </Flex>
            ) : (
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
                <Box flex="2">
                  <Box 
                    bg="white" 
                    borderRadius="xl" 
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="0 4px 20px rgba(0,0,0,0.05)"
                  >
                    <List spacing={0}>
                      {[
                        { label: 'State', value: address.state },
                        { label: 'City', value: address.city },
                        { label: 'Area', value: address.area },
                        { label: 'Pincode', value: address.postcode }
                      ].map((item, index) => (
                        <ListItem 
                          key={item.label}
                          display="flex" 
                          justifyContent="space-between"
                          p={4}
                          borderBottomWidth={index < 3 ? '1px' : '0'}
                          borderColor="gray.100"
                        >
                          <Text color="gray.500" fontWeight="500">{item.label}</Text>
                          <Text fontWeight="600" color="gray.700">{item.value || '-'}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
                <Box flex="1">
                  <Box 
                    h="200px" 
                    w="100%" 
                    borderRadius="xl" 
                    overflow="hidden"
                    boxShadow="0 4px 20px rgba(0,0,0,0.1)"
                  >
                    <iframe
                      title="Your Location"
                      width="100%"
                      height="100%"
                      src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3507.743908551197!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1684765091573!5m2!1sen!2sin`}
                      allowFullScreen=""
                      loading="lazy"
                      style={{ border: 0 }}
                    ></iframe>
                  </Box>
                </Box>
              </Flex>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CurrentLocation;
