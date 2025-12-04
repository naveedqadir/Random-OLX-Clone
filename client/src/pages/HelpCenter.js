import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { 
  FaShoppingBag, 
  FaTag, 
  FaUserShield, 
  FaCreditCard, 
  FaComments, 
  FaQuestionCircle,
  FaEnvelope 
} from "react-icons/fa";
import CatNavbar from "../components/layout/CatNavbar";

const CategoryCard = ({ icon, title, description, onClick }) => (
  <Box
    bg="rgba(255,255,255,0.9)"
    backdropFilter="blur(20px)"
    borderRadius="2xl"
    p={6}
    border="1px solid"
    borderColor="rgba(0,0,0,0.05)"
    boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    transition="all 0.3s"
    cursor="pointer"
    onClick={onClick}
    _hover={{ 
      transform: "translateY(-4px)", 
      boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
      borderColor: "#667eea"
    }}
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
    <Heading size="md" mb={2} color="gray.800">{title}</Heading>
    <Text color="gray.600" fontSize="sm">{description}</Text>
  </Box>
);

const faqData = {
  buying: [
    {
      question: "How do I buy an item on Random?",
      answer: "Browse listings, find an item you like, and click 'Chat' to contact the seller. Discuss the price, location, and payment method directly with the seller. Meet in a safe public place to complete the transaction."
    },
    {
      question: "Is it safe to buy on Random?",
      answer: "We recommend meeting in public places, inspecting items before paying, and never sharing personal financial information. Use cash or secure payment methods. Report any suspicious activity to our team."
    },
    {
      question: "Can I return an item I bought?",
      answer: "Random is a peer-to-peer marketplace. Returns depend on your agreement with the seller. We recommend clarifying return policies before completing a purchase."
    },
    {
      question: "How do I know if a listing is genuine?",
      answer: "Check the seller's profile, reviews, and verification status. Ask for additional photos or videos. Be cautious of deals that seem too good to be true."
    }
  ],
  selling: [
    {
      question: "How do I create a listing?",
      answer: "Click 'Sell' in the navigation bar, select a category, add photos and description, set your price, and publish. Your listing will be visible to millions of users."
    },
    {
      question: "How do I price my items?",
      answer: "Research similar items on the platform to get an idea of market prices. Consider the condition, age, and original price of your item. Be open to negotiation."
    },
    {
      question: "How do I edit or delete my listing?",
      answer: "Go to 'My Ads' in your profile, find the listing you want to modify, and click edit or delete. Changes are reflected immediately."
    },
    {
      question: "Why isn't my listing appearing?",
      answer: "Listings may take a few minutes to appear. Ensure your listing follows our guidelines and doesn't contain prohibited items. Contact support if issues persist."
    }
  ],
  account: [
    {
      question: "How do I create an account?",
      answer: "Click 'Login' and choose to sign up with your email or Google account. Verify your email to complete registration."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Login', then 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your profile and click 'Edit Profile'. You can update your name, photo, phone number, and other details."
    }
  ],
  safety: [
    {
      question: "How does Random protect users?",
      answer: "We use email verification, user reporting systems, and AI-powered fraud detection. Our team reviews reported content and takes action against violators."
    },
    {
      question: "How do I report a suspicious user or listing?",
      answer: "Click the 'Report' button on any listing or user profile. Provide details about your concern and our team will investigate."
    },
    {
      question: "What should I do if I'm scammed?",
      answer: "Report the incident to Random immediately through the app. Also file a report with local law enforcement and keep all communication records."
    },
    {
      question: "Tips for safe transactions?",
      answer: "Meet in public places, bring a friend, inspect items thoroughly, use cash or secure payments, trust your instincts, and never share personal financial details."
    }
  ]
};

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("buying");

  const categories = [
    { id: "buying", icon: FaShoppingBag, title: "Buying", description: "Help with purchasing items" },
    { id: "selling", icon: FaTag, title: "Selling", description: "Create and manage listings" },
    { id: "account", icon: FaUserShield, title: "Account", description: "Profile and settings" },
    { id: "safety", icon: FaCreditCard, title: "Safety", description: "Stay safe on Random" },
  ];

  const filteredFaqs = faqData[selectedCategory].filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <VStack spacing={8} textAlign="center" color="white">
            <Icon as={FaQuestionCircle} boxSize={16} opacity={0.9} />
            <Heading size="3xl" fontWeight="800">
              How can we help?
            </Heading>
            <Text fontSize="xl" maxW="600px" opacity={0.9}>
              Find answers to common questions or contact our support team
            </Text>
            
            <InputGroup maxW="600px" size="lg">
              <InputLeftElement pointerEvents="none" h="full">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search for help..."
                bg="white"
                color="gray.800"
                borderRadius="xl"
                border="none"
                py={7}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                _placeholder={{ color: "gray.400" }}
                _focus={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.3)" }}
              />
            </InputGroup>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={16}>
        {/* Category Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={12}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              title={cat.title}
              description={cat.description}
              onClick={() => setSelectedCategory(cat.id)}
            />
          ))}
        </SimpleGrid>

        {/* FAQ Section */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 4px 20px rgba(0,0,0,0.05)"
          mb={12}
        >
          <HStack mb={6}>
            <Icon 
              as={categories.find(c => c.id === selectedCategory)?.icon} 
              color="#667eea" 
              boxSize={6} 
            />
            <Heading size="lg" color="gray.800">
              {categories.find(c => c.id === selectedCategory)?.title} FAQ
            </Heading>
          </HStack>

          {filteredFaqs.length > 0 ? (
            <Accordion allowMultiple>
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} border="none" mb={3}>
                  <AccordionButton
                    bg="gray.50"
                    borderRadius="xl"
                    py={4}
                    px={6}
                    _hover={{ bg: "gray.100" }}
                    _expanded={{ 
                      bgGradient: "linear(135deg, #667eea, #764ba2)", 
                      color: "white",
                      borderBottomRadius: 0
                    }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="600">
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel 
                    pb={4} 
                    pt={4}
                    px={6}
                    bg="gray.50"
                    borderBottomRadius="xl"
                    color="gray.600"
                    lineHeight="tall"
                  >
                    {faq.answer}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Text color="gray.500" textAlign="center" py={8}>
              No results found. Try a different search term.
            </Text>
          )}
        </Box>

        {/* Still Need Help */}
        <Box
          bgGradient="linear(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))"
          borderRadius="2xl"
          p={{ base: 8, md: 12 }}
          textAlign="center"
        >
          <Icon as={FaComments} boxSize={12} color="#667eea" mb={4} />
          <Heading size="lg" mb={3} color="gray.800">
            Still need help?
          </Heading>
          <Text color="gray.600" mb={6} maxW="500px" mx="auto">
            Can't find what you're looking for? Our support team is ready to assist you.
          </Text>
          <Button
            as="a"
            href="/contact"
            size="lg"
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            fontWeight="700"
            borderRadius="xl"
            px={10}
            py={7}
            leftIcon={<FaEnvelope />}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 15px 35px rgba(102,126,234,0.4)"
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
