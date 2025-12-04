import React, { useState } from "react";
import { Box, Input, Image, FormControl, Text, Icon, Flex, VStack, IconButton } from "@chakra-ui/react";
import { FiUpload, FiX } from "react-icons/fi";

export default function MultipleImageUploadComponent({ onFileSelect }) {
  const [imageSrc, setImageSrc] = useState(null);

  const handleChange = (event) => {
    onFileSelect(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageSrc(null);
  };

  return (
    <Box
      bg="rgba(255,255,255,0.6)"
      backdropFilter="blur(10px)"
      borderRadius="xl"
      p={4}
      border="2px dashed"
      borderColor={imageSrc ? "#10b981" : "gray.200"}
      transition="all 0.3s ease"
      _hover={{ borderColor: imageSrc ? "#10b981" : "#667eea" }}
    >
      <FormControl>
        {!imageSrc ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={6}
            cursor="pointer"
            position="relative"
          >
            <Input
              type="file"
              onChange={handleChange}
              position="absolute"
              w="full"
              h="full"
              opacity={0}
              cursor="pointer"
              accept="image/*"
            />
            <Flex
              w={14}
              h={14}
              borderRadius="full"
              bg="rgba(102,126,234,0.1)"
              alignItems="center"
              justifyContent="center"
              mb={3}
            >
              <Icon as={FiUpload} w={6} h={6} color="#667eea" />
            </Flex>
            <Text fontWeight="600" color="gray.700" mb={1}>Click to upload</Text>
            <Text fontSize="xs" color="gray.400">PNG, JPG up to 10MB</Text>
          </Flex>
        ) : (
          <Flex align="center" gap={4}>
            <Box position="relative">
              <Image
                src={imageSrc}
                alt="Preview"
                boxSize="100px"
                objectFit="cover"
                borderRadius="xl"
                boxShadow="0 4px 15px rgba(0,0,0,0.1)"
              />
              <IconButton
                icon={<FiX />}
                size="xs"
                isRound
                position="absolute"
                top={-2}
                right={-2}
                bg="#ef4444"
                color="white"
                _hover={{ bg: "#dc2626" }}
                onClick={clearImage}
                boxShadow="0 2px 8px rgba(239,68,68,0.4)"
              />
            </Box>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="600" color="gray.700">Image uploaded</Text>
              <Text fontSize="xs" color="gray.400">Click X to remove</Text>
            </VStack>
          </Flex>
        )}
      </FormControl>
    </Box>
  );
}
