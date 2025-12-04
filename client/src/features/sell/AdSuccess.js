import React from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  Icon,
  Flex,
  HStack
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { FiEye, FiTrendingUp, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdSuccess = () => {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      py={10}
      px={4}
    >
      <Container maxW="container.md">
        <Box
          bg="rgba(255,255,255,0.8)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          p={{ base: 8, md: 12 }}
          border="1px solid"
          borderColor="rgba(255,255,255,0.3)"
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.15)"
          position="relative"
          overflow="hidden"
        >
          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-60px"
            right="-60px"
            w="200px"
            h="200px"
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(16,185,129,0.2), rgba(102,126,234,0.2))"
          />
          <Box
            position="absolute"
            bottom="-40px"
            left="-40px"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))"
          />

          <VStack spacing={8} textAlign="center" position="relative" zIndex={1}>
            {/* Success Icon */}
            <Flex
              w={28}
              h={28}
              borderRadius="full"
              bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 15px 40px rgba(16,185,129,0.4)"
              animation="bounce 1s infinite"
            >
              <Icon as={CheckCircleIcon} w={14} h={14} color="white" />
            </Flex>

            {/* Title */}
            <Box>
              <Heading
                as="h2"
                size="2xl"
                mb={3}
                bgGradient="linear(to-r, #10b981, #059669)"
                bgClip="text"
                fontWeight="800"
              >
                Congratulations!
              </Heading>
              <Text fontSize="xl" color="gray.600">
                Your Ad will go live shortly
              </Text>
            </Box>
            
            {/* Image */}
            <Box
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="0 15px 40px rgba(0,0,0,0.1)"
            >
              <Image src="/adsuccess.jpg" alt="Success!" maxW="280px" />
            </Box>

            {/* Upgrade Section */}
            <Box
              w="full"
              bg="linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))"
              borderRadius="2xl"
              p={6}
            >
              <HStack justify="center" mb={3}>
                <Icon as={FiTrendingUp} w={6} h={6} color="#667eea" />
                <Text fontSize="xl" fontWeight="700" color="gray.700">
                  Reach more buyers and sell faster
                </Text>
              </HStack>
              <Text color="gray.500" mb={4}>
                Upgrade your Ad to a top position
              </Text>
              
              <Button
                size="lg"
                w="full"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                fontWeight="700"
                borderRadius="xl"
                py={7}
                leftIcon={<FiZap />}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 35px rgba(102,126,234,0.4)"
                }}
                transition="all 0.3s ease"
              >
                Sell Faster Now
              </Button>
            </Box>

            {/* View Ads Button */}
            <Button
              as={Link}
              to="/myads"
              size="lg"
              w="full"
              variant="outline"
              color="gray.600"
              borderColor="gray.300"
              fontWeight="600"
              borderRadius="xl"
              py={7}
              leftIcon={<FiEye />}
              _hover={{
                bg: "rgba(102,126,234,0.05)",
                borderColor: "#667eea",
                color: "#667eea"
              }}
              transition="all 0.3s ease"
            >
              View Your Ads
            </Button>
          </VStack>
        </Box>
      </Container>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </Box>
  );
};

export default AdSuccess;
