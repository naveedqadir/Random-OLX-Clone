import { Flex, Spinner, Text, Box, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Loading() {
  return (
    <Flex 
      height="100vh" 
      alignItems="center" 
      justifyContent="center" 
      direction="column"
      bgGradient="linear(135deg, #f8fafc 0%, #e2e8f0 100%)"
    >
      <VStack spacing={6}>
        <Box
          position="relative"
          w="80px"
          h="80px"
        >
          {/* Outer ring */}
          <Spinner
            position="absolute"
            top={0}
            left={0}
            size="xl"
            w="80px"
            h="80px"
            thickness="4px"
            speed="1s"
            color="purple.500"
            emptyColor="gray.200"
          />
          {/* Inner ring */}
          <Spinner
            position="absolute"
            top="15px"
            left="15px"
            size="lg"
            w="50px"
            h="50px"
            thickness="4px"
            speed="0.8s"
            color="cyan.500"
            emptyColor="transparent"
          />
        </Box>
        
        <VStack spacing={1}>
          <Text 
            fontSize="xl" 
            fontWeight="800" 
            bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
            bgClip="text"
          >
            Loading...
          </Text>
          <Text fontSize="sm" color="gray.500">
            Please wait a moment
          </Text>
        </VStack>
      </VStack>
    </Flex>
  )
}
