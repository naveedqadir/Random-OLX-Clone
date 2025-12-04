import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  Link,
  VStack,
  HStack,
  Icon,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { FaInstagram, FaLinkedin, FaGithub, FaGlobe, FaEnvelope, FaMapMarkerAlt, FaPhone, FaHeart } from 'react-icons/fa';

const SocialButton = ({ icon, href, color }) => {
  return (
    <Link
      href={href}
      isExternal
      w={10}
      h={10}
      rounded="xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="whiteAlpha.100"
      color="white"
      transition="all 0.3s"
      _hover={{
        bg: color,
        transform: 'translateY(-3px)',
        boxShadow: `0 10px 20px ${color}40`,
      }}
    >
      <Icon as={icon} boxSize={4} />
    </Link>
  );
};

const FooterLink = ({ children, href = "/" }) => {
  return (
    <Link
      href={href}
      fontSize="sm"
      color="gray.400"
      transition="all 0.2s"
      _hover={{ 
        color: 'white',
        transform: 'translateX(4px)',
      }}
      display="inline-block"
    >
      {children}
    </Link>
  );
};

export default function Footer() {
  return (
    <Box
      bgGradient="linear(180deg, #1e293b 0%, #0f172a 100%)"
      color="white"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="40%"
        h="60%"
        bg="purple.500"
        opacity={0.05}
        borderRadius="full"
        filter="blur(80px)"
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="30%"
        h="50%"
        bg="cyan.500"
        opacity={0.05}
        borderRadius="full"
        filter="blur(80px)"
      />

      <Container maxW="container.xl" py={16} position="relative">
        {/* Main Footer Content */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={12}>
          <VStack align="flex-start" spacing={6}>
            <HStack spacing={2}>
              <Box
                bg="white"
                borderRadius="lg"
                p={1}
              >
                <Box
                  as="img"
                  src="/logo.png"
                  alt="Random Logo"
                  h="40px"
                />
              </Box>
            </HStack>
            <Text fontSize="sm" color="gray.400" lineHeight="tall">
              Your trusted marketplace for buying and selling second-hand items. 
              Connect with millions of users and find amazing deals near you.
            </Text>
            <HStack spacing={3}>
              <SocialButton icon={FaGlobe} href="https://naveedsportfolio.netlify.app" color="#0ea5e9" />
              <SocialButton icon={FaInstagram} href="https://www.instagram.com/naveed.qadir/" color="#E1306C" />
              <SocialButton icon={FaLinkedin} href="https://www.linkedin.com/in/naveedqadir/" color="#0077B5" />
              <SocialButton icon={FaGithub} href="https://github.com/naveedqadir" color="#333" />
            </HStack>
          </VStack>

          <VStack align="flex-start" spacing={4}>
            <Text fontWeight="700" fontSize="sm" textTransform="uppercase" letterSpacing="wider" color="white">
              Quick Links
            </Text>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/help">Help Center</FooterLink>
            <FooterLink href="/sell">Sell Items</FooterLink>
          </VStack>

          <VStack align="flex-start" spacing={4}>
            <Text fontWeight="700" fontSize="sm" textTransform="uppercase" letterSpacing="wider" color="white">
              Categories
            </Text>
            <FooterLink href="/Electronics & Appliances">Electronics</FooterLink>
            <FooterLink href="/Mobiles">Mobiles</FooterLink>
            <FooterLink href="/OLX Autos (Cars)">Cars</FooterLink>
            <FooterLink href="/Furniture">Furniture</FooterLink>
            <FooterLink href="/Fashion">Fashion</FooterLink>
          </VStack>

          <VStack align="flex-start" spacing={4}>
            <Text fontWeight="700" fontSize="sm" textTransform="uppercase" letterSpacing="wider" color="white">
              Contact
            </Text>
            <HStack spacing={3} color="gray.400">
              <Icon as={FaMapMarkerAlt} color="cyan.400" />
              <Text fontSize="sm">Jaypee Kosmos, Noida</Text>
            </HStack>
            <HStack spacing={3} color="gray.400">
              <Icon as={FaEnvelope} color="purple.400" />
              <Text fontSize="sm">naveedqadir0@gmail.com</Text>
            </HStack>
            <HStack spacing={3} color="gray.400">
              <Icon as={FaPhone} color="pink.400" />
              <Text fontSize="sm">+91 6005871152</Text>
            </HStack>
          </VStack>
        </SimpleGrid>
      </Container>

      <Divider borderColor="whiteAlpha.100" />

      {/* Bottom Bar */}
      <Container maxW="container.xl" py={6}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <HStack spacing={1} color="gray.500" fontSize="sm">
            <Text>© 2025 Random.com. Made with</Text>
            <Icon as={FaHeart} color="red.400" />
            <Text>in India</Text>
          </HStack>
          <HStack spacing={8}>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/help">Help</FooterLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
