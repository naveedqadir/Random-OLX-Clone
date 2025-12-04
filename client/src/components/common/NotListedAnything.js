import { Box, Heading, Text, Button, Flex, Icon, VStack } from '@chakra-ui/react';
import { FiPackage, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function NotListedAnything() {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="rgba(255,255,255,0.8)"
        backdropFilter="blur(20px)"
        borderRadius="3xl"
        p={{ base: 10, md: 16 }}
        maxW="lg"
        w="full"
        textAlign="center"
        border="1px solid"
        borderColor="rgba(255,255,255,0.3)"
        boxShadow="0 25px 50px -12px rgba(0,0,0,0.15)"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circles */}
        <Box
          position="absolute"
          top="-30px"
          right="-30px"
          w="120px"
          h="120px"
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))"
        />
        <Box
          position="absolute"
          bottom="-40px"
          left="-40px"
          w="150px"
          h="150px"
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(16,185,129,0.2), rgba(102,126,234,0.2))"
        />

        <VStack spacing={6} position="relative" zIndex={1}>
          {/* Icon */}
          <Flex
            w={28}
            h={28}
            borderRadius="full"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 15px 40px rgba(102,126,234,0.4)"
          >
            <Icon as={FiPackage} w={12} h={12} color="white" />
          </Flex>

          {/* Title */}
          <Heading
            as="h2"
            size="2xl"
            bgGradient="linear(to-r, #667eea, #764ba2)"
            bgClip="text"
            fontWeight="800"
          >
            Nothing Listed
          </Heading>

          {/* Description */}
          <VStack spacing={2}>
            <Text fontSize="xl" color="gray.600" fontWeight="500">
              There isn't listed anything yet
            </Text>
            <Text fontSize="md" color="gray.400">
              Let go of what you don't use anymore
            </Text>
          </VStack>

          {/* Buttons */}
          <VStack spacing={3} pt={4} w="full">
            <Button
              as={Link}
              to="/sell"
              size="lg"
              w="full"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              fontWeight="700"
              borderRadius="xl"
              py={7}
              leftIcon={<FiPlusCircle />}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 15px 35px rgba(102,126,234,0.4)"
              }}
              transition="all 0.3s ease"
            >
              Start Selling
            </Button>
            <Button
              as={Link}
              to="/"
              size="lg"
              w="full"
              variant="ghost"
              color="gray.600"
              fontWeight="600"
              borderRadius="xl"
              py={7}
              _hover={{
                bg: "rgba(102,126,234,0.1)",
                color: "#667eea"
              }}
              transition="all 0.3s ease"
            >
              Go to Home
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}