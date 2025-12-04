import React from "react";
import { Box, Input, Textarea, FormControl, FormLabel, Text, Icon, HStack, VStack } from "@chakra-ui/react";
import { FiFileText } from "react-icons/fi";

export default function Details({ onTitleSelect, onDescriptionSelect }) {
  const handleInputChange = (event) => {
    if (event.target.id === "title") {
      onTitleSelect(event.target.value);
    }
    if (event.target.id === "description") {
      onDescriptionSelect(event.target.value);
    }
  };

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
        <Icon as={FiFileText} w={5} h={5} color="#667eea" />
        <Text fontWeight="700" fontSize="lg" color="gray.700">Ad Details</Text>
      </HStack>

      <VStack spacing={5}>
        <FormControl isRequired>
          <FormLabel 
            htmlFor="title" 
            fontSize="sm" 
            color="gray.500" 
            fontWeight="500"
            mb={2}
          >
            Ad Title
          </FormLabel>
          <Input
            id="title"
            type="text"
            onChange={handleInputChange}
            size="lg"
            bg="white"
            border="2px solid"
            borderColor="gray.100"
            borderRadius="xl"
            py={6}
            placeholder="Enter a catchy title for your ad"
            _focus={{
              borderColor: '#667eea',
              boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
            }}
            _hover={{ borderColor: 'gray.200' }}
          />
          <Text mt={2} fontSize="xs" color="gray.400">
            Make your title descriptive and specific
          </Text>
        </FormControl>

        <FormControl isRequired>
          <FormLabel 
            htmlFor="description" 
            fontSize="sm" 
            color="gray.500" 
            fontWeight="500"
            mb={2}
          >
            Description
          </FormLabel>
          <Textarea
            id="description"
            rows={5}
            onChange={handleInputChange}
            bg="white"
            border="2px solid"
            borderColor="gray.100"
            borderRadius="xl"
            py={4}
            placeholder="Describe your item in detail. Include condition, features, and any relevant information."
            _focus={{
              borderColor: '#667eea',
              boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
            }}
            _hover={{ borderColor: 'gray.200' }}
            resize="vertical"
          />
          <Text mt={2} fontSize="xs" color="gray.400">
            Include key details that buyers would want to know
          </Text>
        </FormControl>
      </VStack>
    </Box>
  );
}