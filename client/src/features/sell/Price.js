import React from 'react';
import { InputGroup, InputLeftElement, Input, FormControl, FormLabel, Box, Text, Icon, HStack } from '@chakra-ui/react';
import { FaRupeeSign } from 'react-icons/fa';
import { FiDollarSign } from 'react-icons/fi';

export default function Price({ onPriceSelect }) {

  const handleInputChange = (event) => {
    onPriceSelect(event.target.value);
  };

  return (
    <Box
      bg="rgba(255,255,255,0.6)"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      p={6}
      border="1px solid"
      borderColor="rgba(255,255,255,0.3)"
      boxShadow="0 10px 40px rgba(0,0,0,0.08)"
      mt={6}
      mb={4}
    >
      <HStack mb={4}>
        <Icon as={FiDollarSign} w={5} h={5} color="#667eea" />
        <Text fontWeight="700" fontSize="lg" color="gray.700">Price</Text>
      </HStack>
      
      <FormControl isRequired>
        <FormLabel 
          htmlFor="typeNumber" 
          fontSize="sm" 
          color="gray.500" 
          fontWeight="500"
          mb={2}
        >
          Enter Price
        </FormLabel>
        <InputGroup size="lg">
          <InputLeftElement 
            pointerEvents="none" 
            h="full"
          >
            <Box
              w={10}
              h={10}
              borderRadius="lg"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaRupeeSign} color="white" w={4} h={4} />
            </Box>
          </InputLeftElement>
          <Input 
            id='typeNumber' 
            type='number' 
            onChange={handleInputChange} 
            pl={14}
            bg="white"
            border="2px solid"
            borderColor="gray.100"
            borderRadius="xl"
            py={6}
            fontSize="lg"
            fontWeight="600"
            placeholder="0"
            _focus={{
              borderColor: '#667eea',
              boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
            }}
            _hover={{ borderColor: 'gray.200' }}
          />
        </InputGroup>
        <Text mt={2} fontSize="xs" color="gray.400">
          Set a competitive price for faster sales
        </Text>
      </FormControl>
    </Box>
  );
}