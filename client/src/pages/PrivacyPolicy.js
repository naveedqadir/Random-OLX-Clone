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
  FaShieldAlt, 
  FaUserShield, 
  FaShareAlt, 
  FaLock, 
  FaUserCheck, 
  FaCookie, 
  FaExternalLinkAlt, 
  FaChild, 
  FaEdit,
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

export default function PrivacyPolicy() {
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
              <Icon as={FaShieldAlt} color="white" boxSize={10} />
            </Flex>
            <Heading size="3xl" fontWeight="800">
              Privacy Policy
            </Heading>
            <Text fontSize="xl" opacity={0.9} maxW="600px">
              Your privacy is our priority. Learn how we collect, use, and protect your information.
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
            At Random ("we", "our", or "us"), we are committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our marketplace platform.
          </Text>
        </Box>

        {/* Policy Sections */}
        <VStack spacing={6} align="stretch">
          <PolicySection icon={FaUserShield} title="Information We Collect" index={1}>
            <Text mb={3}>We collect information that you provide directly to us, including:</Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Name, email address, and phone number</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Profile information and photos</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Listing information and images</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Messages and communications</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Location data (with your permission)</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Payment information (processed securely)</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaUserCheck} title="How We Use Your Information" index={2}>
            <Text mb={3}>We use the information we collect to:</Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Provide, maintain, and improve our services</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Process transactions and send related information</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Send you technical notices and support messages</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Respond to your comments and questions</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Detect and prevent fraudulent transactions</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Personalize your experience on the platform</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaShareAlt} title="Information Sharing" index={3}>
            <Text mb={3}>We may share your information in the following situations:</Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>With other users when you create listings or messages</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>With service providers who assist our operations</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>To comply with legal obligations</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>To protect our rights and prevent fraud</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>With your consent or at your direction</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaLock} title="Data Security" index={4}>
            <Text>
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or 
              destruction. However, no method of transmission over the Internet is 100% secure.
            </Text>
          </PolicySection>

          <PolicySection icon={FaUserCheck} title="Your Rights" index={5}>
            <Text mb={3}>You have the right to:</Text>
            <VStack align="stretch" spacing={2} pl={0}>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Access your personal information</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Correct inaccurate data</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Request deletion of your data</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Object to processing of your data</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Data portability</Text></HStack>
              <HStack spacing={3}><Box w={2} h={2} borderRadius="full" bgGradient="linear(135deg, #0ea5e9, #8b5cf6)" flexShrink={0} /><Text>Withdraw consent at any time</Text></HStack>
            </VStack>
          </PolicySection>

          <PolicySection icon={FaCookie} title="Cookies and Tracking" index={6}>
            <Text>
              We use cookies and similar tracking technologies to track activity on our platform 
              and hold certain information. You can instruct your browser to refuse all cookies 
              or indicate when a cookie is being sent.
            </Text>
          </PolicySection>

          <PolicySection icon={FaExternalLinkAlt} title="Third-Party Links" index={7}>
            <Text>
              Our platform may contain links to third-party websites. We are not responsible 
              for the privacy practices of these external sites. We encourage you to review 
              their privacy policies.
            </Text>
          </PolicySection>

          <PolicySection icon={FaChild} title="Children's Privacy" index={8}>
            <Text>
              Our services are not intended for individuals under the age of 18. We do not 
              knowingly collect personal information from children.
            </Text>
          </PolicySection>

          <PolicySection icon={FaEdit} title="Changes to This Policy" index={9}>
            <Text>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last 
              updated" date.
            </Text>
          </PolicySection>

          <PolicySection icon={FaEnvelope} title="Contact Us" index={10}>
            <Text mb={4}>
              If you have any questions about this Privacy Policy, please contact us:
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
