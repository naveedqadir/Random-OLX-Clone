import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { FaUsers, FaShieldAlt, FaHandshake, FaGlobe, FaHeart, FaRocket } from "react-icons/fa";
import CatNavbar from "../components/layout/CatNavbar";

const ValueCard = ({ icon, title, description }) => (
  <Box
    bg="rgba(255,255,255,0.9)"
    backdropFilter="blur(20px)"
    borderRadius="2xl"
    p={8}
    border="1px solid"
    borderColor="rgba(0,0,0,0.05)"
    boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    transition="all 0.3s"
    _hover={{ transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
  >
    <Flex
      w={14}
      h={14}
      borderRadius="xl"
      bgGradient="linear(135deg, #0ea5e9, #8b5cf6)"
      alignItems="center"
      justifyContent="center"
      mb={4}
    >
      <Icon as={icon} color="white" boxSize={6} />
    </Flex>
    <Heading size="md" mb={3} color="gray.800">{title}</Heading>
    <Text color="gray.600" lineHeight="tall">{description}</Text>
  </Box>
);

export default function About() {
  return (
    <Box bg="gray.50" minH="100vh">
      <CatNavbar />
      
      {/* Hero Section */}
      <Box
        bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-50%"
          right="-10%"
          w="500px"
          h="500px"
          borderRadius="full"
          bg="rgba(255,255,255,0.1)"
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center" color="white">
            <Heading size="3xl" fontWeight="800">
              About Random
            </Heading>
            <Text fontSize="xl" maxW="600px" opacity={0.9}>
              A trusted marketplace for buying and selling pre-loved items.
              Connecting people every day.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxW="container.xl" py={16}>
        <Box
          bg="rgba(255,255,255,0.9)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          p={{ base: 8, md: 16 }}
          mb={20}
          border="1px solid"
          borderColor="rgba(0,0,0,0.05)"
          boxShadow="0 4px 20px rgba(0,0,0,0.05)"
        >
          <VStack spacing={6} textAlign="center">
            <Heading
              size="xl"
              bgGradient="linear(135deg, #0ea5e9, #8b5cf6)"
              bgClip="text"
            >
              Our Mission
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="800px" lineHeight="tall">
              At Random, we believe in the power of giving things a second life. Our mission 
              is to create a sustainable marketplace where people can buy and sell pre-loved 
              items easily, safely, and affordably. We're building a community that values 
              sustainability, trust, and fair trade.
            </Text>
          </VStack>
        </Box>

        {/* Values Section */}
        <VStack spacing={8} mb={20}>
          <Heading
            size="xl"
            textAlign="center"
            bgGradient="linear(135deg, #0ea5e9, #8b5cf6)"
            bgClip="text"
          >
            Our Values
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <ValueCard
              icon={FaShieldAlt}
              title="Trust & Safety"
              description="We prioritize user safety with verified profiles, secure transactions, and a dedicated support team."
            />
            <ValueCard
              icon={FaHandshake}
              title="Fair Trade"
              description="We promote honest and transparent dealings between buyers and sellers in our community."
            />
            <ValueCard
              icon={FaGlobe}
              title="Sustainability"
              description="Every item sold is one less item in a landfill. We're committed to a greener future."
            />
            <ValueCard
              icon={FaUsers}
              title="Community First"
              description="Our users are at the heart of everything we do. We listen, learn, and improve continuously."
            />
            <ValueCard
              icon={FaHeart}
              title="Accessibility"
              description="We make buying and selling accessible to everyone, regardless of their location or background."
            />
            <ValueCard
              icon={FaRocket}
              title="Innovation"
              description="We constantly innovate to provide the best experience for our users with cutting-edge technology."
            />
          </SimpleGrid>
        </VStack>

        {/* Story Section */}
        <Box
          bg="rgba(255,255,255,0.9)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          p={{ base: 8, md: 16 }}
          border="1px solid"
          borderColor="rgba(0,0,0,0.05)"
          boxShadow="0 4px 20px rgba(0,0,0,0.05)"
        >
          <VStack spacing={6} textAlign="center">
            <Heading
              size="xl"
              bgGradient="linear(135deg, #0ea5e9, #8b5cf6)"
              bgClip="text"
            >
              Our Story
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="800px" lineHeight="tall">
              Random started with a simple idea: make it easy for people to sell what they 
              don't need and find what they're looking for at great prices. What began as a 
              small project has grown into a beloved marketplace. Today, we help 
              users declutter their homes, earn extra income, and find amazing 
              deals every single day.
            </Text>
            <Text fontSize="lg" color="gray.600" maxW="800px" lineHeight="tall">
              We're proud to be part of a movement that reduces waste, promotes reuse, and 
              builds communities. Thank you for being part of our journey!
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
