import { Box, Heading, Text, Button, Flex, VStack } from '@chakra-ui/react';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bgGradient="linear(135deg, #f8fafc 0%, #e2e8f0 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="40%"
        h="60%"
        bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
        opacity={0.05}
        borderRadius="full"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="30%"
        h="50%"
        bgGradient="linear(135deg, #d946ef, #7c3aed)"
        opacity={0.05}
        borderRadius="full"
        filter="blur(60px)"
      />

      <Box 
        textAlign="center" 
        py={16} 
        px={8}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={6}>
          {/* 404 Number */}
          <Text
            fontSize={{ base: "8rem", md: "12rem" }}
            fontWeight="900"
            lineHeight="1"
            bgGradient="linear(135deg, #0ea5e9, #7c3aed, #d946ef)"
            bgClip="text"
            letterSpacing="-0.05em"
          >
            404
          </Text>
          
          <VStack spacing={3}>
            <Heading
              size="xl"
              color="gray.800"
              fontWeight="800"
            >
              Page Not Found
            </Heading>
            <Text 
              color="gray.500" 
              fontSize="lg"
              maxW="400px"
            >
              Oops! The page you're looking for seems to have wandered off.
            </Text>
          </VStack>

          <Flex gap={4} mt={6} flexWrap="wrap" justify="center">
            <Button
              as="a"
              href="/"
              size="lg"
              bgGradient="linear(135deg, #7c3aed, #d946ef)"
              color="white"
              borderRadius="full"
              px={8}
              h="56px"
              fontWeight="700"
              leftIcon={<FaHome />}
              _hover={{
                bgGradient: "linear(135deg, #6d28d9, #c026d3)",
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
              }}
              transition="all 0.3s"
            >
              Back to Home
            </Button>
            <Button
              as="a"
              href="/"
              size="lg"
              variant="outline"
              borderColor="gray.300"
              color="gray.700"
              borderRadius="full"
              px={8}
              h="56px"
              fontWeight="700"
              borderWidth="2px"
              leftIcon={<FaSearch />}
              _hover={{
                bg: "gray.50",
                borderColor: "gray.400",
                transform: 'translateY(-2px)',
              }}
              transition="all 0.3s"
            >
              Search Products
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}