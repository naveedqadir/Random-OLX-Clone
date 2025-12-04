import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { 
  FaFileContract, 
  FaCheckCircle, 
  FaUserCheck, 
  FaClipboardList, 
  FaExclamationTriangle,
  FaHandshake,
  FaCopyright,
  FaFileAlt,
  FaBalanceScale,
  FaShieldAlt,
  FaUserSlash,
  FaEdit,
  FaGavel,
  FaEnvelope
} from "react-icons/fa";
import CatNavbar from "../components/layout/CatNavbar";

const PolicySection = ({ icon, title, children, index }) => (
  <Box
    bg="rgba(255,255,255,0.9)"
    backdropFilter="blur(20px)"
    borderRadius="2xl"
    p={{ base: 6, md: 8 }}
    border="1px solid"
    borderColor="rgba(0,0,0,0.05)"
    boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    transition="all 0.3s"
    _hover={{ 
      transform: "translateY(-2px)", 
      boxShadow: "0 8px 30px rgba(0,0,0,0.08)" 
    }}
  >
    <Flex align="flex-start" gap={4}>
      <Flex
        w={12}
        h={12}
        borderRadius="xl"
        bgGradient="linear(135deg, #0ea5e9, #8b5cf6)"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <Icon as={icon} color="white" boxSize={5} />
      </Flex>
      <Box flex={1}>
        <Heading size="md" mb={3} color="gray.800">
          {index}. {title}
        </Heading>
        <Box color="gray.600" lineHeight="tall">
          {children}
        </Box>
      </Box>
    </Flex>
  </Box>
);

export default function TermsOfService() {
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
        <Box
          position="absolute"
          bottom="-30%"
          left="-5%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="rgba(255,255,255,0.05)"
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center" color="white">
            <Flex
              w={20}
              h={20}
              borderRadius="2xl"
              bg="rgba(255,255,255,0.2)"
              backdropFilter="blur(10px)"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaFileContract} color="white" boxSize={10} />
            </Flex>
            <Heading size="3xl" fontWeight="800">
              Terms of Service
            </Heading>
            <Text fontSize="xl" opacity={0.9} maxW="600px">
              Please read these terms carefully before using our marketplace platform.
            </Text>
            <Box
              bg="rgba(255,255,255,0.15)"
              backdropFilter="blur(10px)"
              px={6}
              py={2}
              borderRadius="full"
            >
              <Text fontSize="sm" fontWeight="600">
                Last updated: December 3, 2025
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Introduction */}
      <Container maxW="container.lg" py={16}>
        <Box
          bg="linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          mb={10}
          border="1px solid"
          borderColor="rgba(102,126,234,0.2)"
        >
          <Text fontSize="lg" color="gray.700" lineHeight="tall" textAlign="center">
            Welcome to Random! These Terms of Service ("Terms") govern your use of our 
            marketplace platform. By accessing or using Random, you agree to be bound 
            by these Terms.
          </Text>
        </Box>

        {/* Terms Sections */}
        <VStack spacing={6} align="stretch">
          <PolicySection icon={FaCheckCircle} title="Acceptance of Terms" index={1}>
            <Text>
              By creating an account or using our services, you acknowledge that you have 
              read, understood, and agree to be bound by these Terms. If you do not agree 
              to these Terms, please do not use our platform.
            </Text>
          </PolicySection>

          <PolicySection icon={FaUserCheck} title="Eligibility" index={2}>
            <Text>
              You must be at least 18 years old to use Random. By using our platform, you 
              represent and warrant that you meet this requirement and have the legal 
              capacity to enter into these Terms.
            </Text>
          </PolicySection>

          <PolicySection icon={FaClipboardList} title="Account Registration" index={3}>
            <Text mb={3}>To access certain features, you must create an account. You agree to:</Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Provide accurate and complete information</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Maintain the security of your account credentials</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Notify us immediately of any unauthorized access</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Accept responsibility for all activities under your account</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaFileAlt} title="Listing Guidelines" index={4}>
            <Text mb={3}>When creating listings, you agree to:</Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Provide accurate descriptions and images</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Set fair and honest prices</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Not list prohibited items (weapons, illegal goods, counterfeit items)</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Respond to inquiries in a timely manner</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Honor agreed-upon transactions</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaExclamationTriangle} title="Prohibited Activities" index={5}>
            <Text mb={3}>You agree not to:</Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Post false, misleading, or fraudulent content</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Harass, abuse, or harm other users</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Use the platform for illegal activities</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Attempt to gain unauthorized access to our systems</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Scrape or collect user data without permission</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Interfere with the proper functioning of the platform</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaHandshake} title="Transactions" index={6}>
            <Text mb={3}>
              Random is a platform that connects buyers and sellers. We are not a party to 
              any transaction between users. You acknowledge that:
            </Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>All transactions are conducted at your own risk</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>We do not guarantee the quality or legality of listed items</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>We are not responsible for disputes between users</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Payment terms are agreed upon between parties</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaCopyright} title="Intellectual Property" index={7}>
            <Text>
              All content on Random, including logos, designs, and text, is our property and 
              is protected by intellectual property laws. You may not use our content without 
              prior written permission.
            </Text>
          </PolicySection>

          <PolicySection icon={FaFileAlt} title="User Content" index={8}>
            <Text>
              You retain ownership of content you post. By posting content, you grant us a 
              non-exclusive, worldwide, royalty-free license to use, display, and distribute 
              your content on our platform.
            </Text>
          </PolicySection>

          <PolicySection icon={FaBalanceScale} title="Limitation of Liability" index={9}>
            <Text>
              To the maximum extent permitted by law, Random shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising from 
              your use of our platform.
            </Text>
          </PolicySection>

          <PolicySection icon={FaShieldAlt} title="Indemnification" index={10}>
            <Text>
              You agree to indemnify and hold Random harmless from any claims, damages, or 
              expenses arising from your use of the platform or violation of these Terms.
            </Text>
          </PolicySection>

          <PolicySection icon={FaUserSlash} title="Termination" index={11}>
            <Text>
              We reserve the right to suspend or terminate your account at any time for 
              violations of these Terms or for any other reason at our discretion.
            </Text>
          </PolicySection>

          <PolicySection icon={FaEdit} title="Changes to Terms" index={12}>
            <Text>
              We may modify these Terms at any time. Continued use of the platform after 
              changes constitutes acceptance of the new Terms.
            </Text>
          </PolicySection>

          <PolicySection icon={FaGavel} title="Governing Law" index={13}>
            <Text>
              These Terms are governed by the laws of India. Any disputes shall be resolved 
              in the courts of Noida, Uttar Pradesh.
            </Text>
          </PolicySection>

          <PolicySection icon={FaEnvelope} title="Contact" index={14}>
            <Text mb={4}>
              For questions about these Terms, please contact us:
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box
                bg="gray.50"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
              >
                <Text fontWeight="600" color="gray.700" mb={1}>Email</Text>
                <Text color="purple.600">naveedqadir0@gmail.com</Text>
              </Box>
              <Box
                bg="gray.50"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
              >
                <Text fontWeight="600" color="gray.700" mb={1}>Address</Text>
                <Text color="gray.600">Jaypee Kosmos, Noida, India</Text>
              </Box>
            </SimpleGrid>
          </PolicySection>
        </VStack>
      </Container>
    </Box>
  );
}
