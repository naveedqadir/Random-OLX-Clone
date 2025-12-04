import React, { useState, useEffect, useRef } from "react";
import { Box, Input, FormControl, FormLabel, Flex, Text, Icon, VStack, HStack, Avatar } from "@chakra-ui/react";
import { FiUser, FiPhone, FiCamera } from "react-icons/fi";
import { getSafeImageUrl } from "../../utils/imageUtils";

const authname = localStorage.getItem("authname");
const authpicture = getSafeImageUrl(localStorage.getItem("authpicture"), 100);

export default function Addetails({ onNameSelect, onImageSelect }) {
  const [name, setName] = useState(authname || "");
  const [img, setImg] = useState(authpicture || "");
  const [imageSrc, setImageSrc] = useState(null);
  const picture = getSafeImageUrl(localStorage.getItem("authpicture"), 100);
  const phone = localStorage.getItem("authphone");
  const fileInputRef = useRef(null);

  useEffect(() => {
    onNameSelect(name);
    onImageSelect(img);
  }, [name, img, onNameSelect, onImageSelect]);

  function handleInputChange(event) {
    setName(event.target.value);
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    setImg(event.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUploadClick() {
    fileInputRef.current.click();
  }

  return (
    <Box
      mt={6}
      mb={4}
      bg="rgba(255,255,255,0.6)"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      p={6}
      border="1px solid"
      borderColor="rgba(255,255,255,0.3)"
      boxShadow="0 10px 40px rgba(0,0,0,0.08)"
    >
      <HStack mb={5}>
        <Icon as={FiUser} w={5} h={5} color="#667eea" />
        <Text fontWeight="700" fontSize="lg" color="gray.700">Your Details</Text>
      </HStack>

      <Flex align="center" direction={{ base: "column", md: "row" }} gap={6}>
        {/* Profile Picture */}
        <Box position="relative">
          <Box
            position="relative"
            cursor="pointer"
            onClick={handleUploadClick}
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}
          >
            <Avatar
              src={imageSrc || picture}
              name={name}
              size="2xl"
              border="4px solid white"
              boxShadow="0 10px 40px rgba(102,126,234,0.3)"
            />
            <Flex
              position="absolute"
              bottom={0}
              right={0}
              w={10}
              h={10}
              borderRadius="full"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 15px rgba(102,126,234,0.4)"
              border="3px solid white"
            >
              <Icon as={FiCamera} color="white" w={4} h={4} />
            </Flex>
          </Box>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            display="none"
          />
        </Box>

        {/* Details */}
        <VStack flex="1" align="stretch" spacing={4} w="full">
          <FormControl>
            <FormLabel fontSize="sm" color="gray.500" fontWeight="500" mb={2}>Name</FormLabel>
            <Input
              value={name}
              onChange={handleInputChange}
              size="lg"
              bg="white"
              border="2px solid"
              borderColor="gray.100"
              borderRadius="xl"
              py={6}
              _focus={{
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
              }}
              _hover={{ borderColor: 'gray.200' }}
            />
          </FormControl>
          
          <Box
            bg="rgba(102,126,234,0.05)"
            borderRadius="xl"
            p={4}
          >
            <HStack justify="space-between">
              <HStack color="gray.500">
                <Icon as={FiPhone} w={4} h={4} />
                <Text fontSize="sm" fontWeight="500">Phone number</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="600" color="gray.700">{phone}</Text>
            </HStack>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}
