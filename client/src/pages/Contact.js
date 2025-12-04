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
  Textarea,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaLinkedin, FaGithub, FaInstagram, FaGlobe } from "react-icons/fa";
import CatNavbar from "../components/layout/CatNavbar";

const ContactCard = ({ icon, title, value, link }) => (
  <Box
    bg="rgba(255,255,255,0.9)"
    backdropFilter="blur(20px)"
    borderRadius="2xl"
    p={6}
    border="1px solid"
    borderColor="rgba(0,0,0,0.05)"
    boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    transition="all 0.3s"
    _hover={{ transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
    as={link ? "a" : "div"}
    href={link}
    target={link ? "_blank" : undefined}
    cursor={link ? "pointer" : "default"}
  >
    <HStack spacing={4}>
      <Flex
        w={12}
        h={12}
        borderRadius="xl"
        bgGradient="linear(135deg, #0ea5e9, #8b5cf6)"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={icon} color="white" boxSize={5} />
      </Flex>
      <Box>
        <Text fontSize="sm" color="gray.500" fontWeight="500">{title}</Text>
        <Text fontWeight="600" color="gray.800">{value}</Text>
      </Box>
    </HStack>
  </Box>
);

const SocialLink = ({ icon, href, label }) => (
  <Box
    as="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    w={12}
    h={12}
    borderRadius="xl"
    bg="white"
    display="flex"
    alignItems="center"
    justifyContent="center"
    boxShadow="0 4px 15px rgba(0,0,0,0.08)"
    transition="all 0.3s"
    _hover={{
      transform: "translateY(-3px)",
      bgGradient: "linear(135deg, #0ea5e9, #8b5cf6)",
      color: "white",
    }}
    color="gray.600"
    aria-label={label}
  >
    <Icon as={icon} boxSize={5} />
  </Box>
);

export default function Contact() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you as soon as possible.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to send message. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Contact Us
            </Heading>
            <Text fontSize="xl" maxW="600px" opacity={0.9}>
              Have questions or feedback? We'd love to hear from you.
              Our team is here to help!
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
          {/* Contact Info */}
          <VStack spacing={8} align="stretch">
            <Box>
              <Heading size="lg" mb={2} color="gray.800">Get in Touch</Heading>
              <Text color="gray.600">
                We're here to help and answer any question you might have.
              </Text>
            </Box>

            <VStack spacing={4} align="stretch">
              <ContactCard
                icon={FaEnvelope}
                title="Email"
                value="naveedqadir0@gmail.com"
                link="mailto:naveedqadir0@gmail.com"
              />
              <ContactCard
                icon={FaPhone}
                title="Phone"
                value="+91 6005871152"
                link="tel:+916005871152"
              />
              <ContactCard
                icon={FaMapMarkerAlt}
                title="Address"
                value="Jaypee Kosmos, Noida, India"
              />
            </VStack>

            <Box>
              <Text fontWeight="600" mb={4} color="gray.700">Follow Us</Text>
              <HStack spacing={3}>
                <SocialLink icon={FaGlobe} href="https://naveedsportfolio.netlify.app" label="Website" />
                <SocialLink icon={FaLinkedin} href="https://www.linkedin.com/in/naveedqadir/" label="LinkedIn" />
                <SocialLink icon={FaGithub} href="https://github.com/naveedqadir" label="GitHub" />
                <SocialLink icon={FaInstagram} href="https://www.instagram.com/naveed.qadir/" label="Instagram" />
              </HStack>
            </Box>

            <Box
              bg="rgba(255,255,255,0.9)"
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              p={6}
              border="1px solid"
              borderColor="rgba(0,0,0,0.05)"
            >
              <Heading size="sm" mb={3} color="gray.700">Office Hours</Heading>
              <VStack align="start" spacing={1} color="gray.600" fontSize="sm">
                <Text>Monday - Friday: 9:00 AM - 6:00 PM IST</Text>
                <Text>Saturday: 10:00 AM - 4:00 PM IST</Text>
                <Text>Sunday: Closed</Text>
              </VStack>
            </Box>
          </VStack>

          {/* Contact Form */}
          <Box
            bg="white"
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            boxShadow="0 4px 20px rgba(0,0,0,0.05)"
          >
            <Heading size="lg" mb={6} color="gray.800">Send a Message</Heading>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel color="gray.700">Your Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.100"
                    _focus={{ borderColor: "#667eea", boxShadow: "0 0 0 3px rgba(102,126,234,0.1)" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700">Email Address</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.100"
                    _focus={{ borderColor: "#667eea", boxShadow: "0 0 0 3px rgba(102,126,234,0.1)" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700">Subject</FormLabel>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.100"
                    _focus={{ borderColor: "#667eea", boxShadow: "0 0 0 3px rgba(102,126,234,0.1)" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700">Message</FormLabel>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.100"
                    rows={5}
                    _focus={{ borderColor: "#667eea", boxShadow: "0 0 0 3px rgba(102,126,234,0.1)" }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  fontWeight="700"
                  borderRadius="xl"
                  py={7}
                  rightIcon={<FaPaperPlane />}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 35px rgba(102,126,234,0.4)"
                  }}
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
