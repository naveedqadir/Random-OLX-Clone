import React from "react";
import { 
  Box, 
  Container, 
  Heading, 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon,
  Button,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { categories } from "../../components/common/Catagories";
import { FaCamera, FaRocket, FaShieldAlt, FaTag, FaChevronRight } from "react-icons/fa";

function Sell({ embedded = false }) {
  const navigate = useNavigate();
  
  const handleClick = (category, item) => {
    navigate(`/attributes/${category}/${item}`);
  };

  const features = [
    { icon: FaCamera, title: 'Easy Upload', desc: 'Add photos in seconds' },
    { icon: FaRocket, title: 'Quick Sell', desc: 'Reach buyers instantly' },
    { icon: FaShieldAlt, title: 'Secure', desc: 'Safe transactions' },
  ];

  // When embedded in SellForm, only show the category selector
  if (embedded) {
    return (
      <Box 
        bg="white" 
        borderRadius="xl" 
        shadow="lg"
        overflow="hidden"
        mt={4}
      >
        <Box p={4} borderBottom="1px" borderColor="gray.100">
          <Heading 
            size="md" 
            fontWeight="700"
            color="gray.700"
            textAlign="center"
          >
            Select a different category
          </Heading>
        </Box>
        
        <Box p={4} maxH="400px" overflowY="auto">
          <Accordion allowToggle>
            {categories.map(({ title, items }, index) => (
              <AccordionItem 
                key={index} 
                border="none" 
                mb={2}
              >
                <h2>
                  <AccordionButton 
                    bg="gray.50"
                    _expanded={{ 
                      bgGradient: "linear(135deg, rgba(14, 165, 233, 0.1), rgba(124, 58, 237, 0.1))",
                    }}
                    borderRadius="lg"
                    _hover={{ bg: "gray.100" }}
                    p={4}
                    transition="all 0.2s"
                  >
                    <HStack flex="1" spacing={3}>
                      <Box
                        w={8}
                        h={8}
                        borderRadius="lg"
                        bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="white" fontWeight="800" fontSize="xs">
                          {title.charAt(0)}
                        </Text>
                      </Box>
                      <Text fontWeight="600" fontSize="md" color="gray.700">
                        {title}
                      </Text>
                      <Badge 
                        colorScheme="purple" 
                        variant="subtle" 
                        borderRadius="full"
                        px={2}
                        fontSize="xs"
                      >
                        {items.length}
                      </Badge>
                    </HStack>
                    <AccordionIcon color="gray.400" />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={3} pt={3}>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                    {items.map((item, i) => (
                      <Button 
                        key={`${title}-${i}-${item}`} 
                        variant="ghost"
                        justifyContent="space-between"
                        onClick={() => handleClick(title, item)}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        _hover={{ 
                          bg: "purple.50", 
                          borderColor: "purple.200", 
                          color: "purple.700",
                          transform: "translateX(4px)"
                        }}
                        h="auto"
                        py={3}
                        px={3}
                        whiteSpace="normal"
                        textAlign="left"
                        fontWeight="500"
                        color="gray.600"
                        borderRadius="lg"
                        transition="all 0.2s"
                        fontSize="sm"
                        rightIcon={<FaChevronRight size={10} />}
                      >
                        {item}
                      </Button>
                    ))}
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        bgGradient="linear(135deg, #0ea5e9 0%, #7c3aed 50%, #d946ef 100%)"
        py={16}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-30%"
          right="-10%"
          w="50%"
          h="150%"
          bg="white"
          opacity={0.05}
          borderRadius="full"
          transform="rotate(-12deg)"
        />
        
        <Container maxW="container.lg" textAlign="center" position="relative" zIndex={1}>
          <Badge 
            bg="rgba(255,255,255,0.2)" 
            color="white" 
            px={4} 
            py={2} 
            borderRadius="full"
            fontSize="sm"
            fontWeight="600"
            mb={6}
          >
            <Icon as={FaTag} mr={2} />
            Free to List
          </Badge>
          
          <Heading 
            color="white" 
            size="2xl" 
            fontWeight="800"
            mb={4}
          >
            Start Selling Today
          </Heading>
          <Text 
            color="whiteAlpha.900" 
            fontSize="xl" 
            maxW="500px" 
            mx="auto"
          >
            Reach millions of buyers and sell your items quickly
          </Text>

          <HStack spacing={6} justify="center" mt={10} flexWrap="wrap">
            {features.map((f, i) => (
              <VStack 
                key={i}
                bg="rgba(255,255,255,0.15)"
                px={6}
                py={4}
                borderRadius="xl"
                backdropFilter="blur(10px)"
              >
                <Icon as={f.icon} color="white" boxSize={6} />
                <Text color="white" fontWeight="700" fontSize="sm">{f.title}</Text>
                <Text color="whiteAlpha.800" fontSize="xs">{f.desc}</Text>
              </VStack>
            ))}
          </HStack>
        </Container>
      </Box>

      {/* Category Selection */}
      <Container maxW="container.lg" py={12} mt={-10} position="relative" zIndex={2}>
        <Box 
          bg="white" 
          borderRadius="2xl" 
          shadow="0 20px 40px rgba(0,0,0,0.1)"
          overflow="hidden"
        >
          <Box 
            bgGradient="linear(180deg, #f8fafc 0%, #ffffff 100%)" 
            p={8} 
            borderBottom="1px" 
            borderColor="gray.100"
          >
            <Heading 
              size="lg" 
              fontWeight="800"
              bgGradient="linear(135deg, #1e293b, #475569)"
              bgClip="text"
              textAlign="center"
            >
              What are you selling?
            </Heading>
            <Text textAlign="center" color="gray.500" mt={2}>
              Choose a category to get started
            </Text>
          </Box>
          
          <Box p={6}>
            <Accordion allowToggle>
              {categories.map(({ title, items }, index) => (
                <AccordionItem 
                  key={index} 
                  border="none" 
                  mb={3}
                >
                  <h2>
                    <AccordionButton 
                      bg="gray.50"
                      _expanded={{ 
                        bgGradient: "linear(135deg, rgba(14, 165, 233, 0.1), rgba(124, 58, 237, 0.1))",
                      }}
                      borderRadius="xl"
                      _hover={{ bg: "gray.100" }}
                      p={5}
                      transition="all 0.2s"
                    >
                      <HStack flex="1" spacing={4}>
                        <Box
                          w={10}
                          h={10}
                          borderRadius="xl"
                          bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color="white" fontWeight="800" fontSize="sm">
                            {title.charAt(0)}
                          </Text>
                        </Box>
                        <Text fontWeight="700" fontSize="lg" color="gray.700">
                          {title}
                        </Text>
                        <Badge 
                          colorScheme="purple" 
                          variant="subtle" 
                          borderRadius="full"
                          px={2}
                        >
                          {items.length}
                        </Badge>
                      </HStack>
                      <AccordionIcon color="gray.400" />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} pt={4}>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                      {items.map((item, i) => (
                        <Button 
                          key={`${title}-${i}-${item}`} 
                          variant="ghost"
                          justifyContent="space-between"
                          onClick={() => handleClick(title, item)}
                          bg="white"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ 
                            bg: "purple.50", 
                            borderColor: "purple.200", 
                            color: "purple.700",
                            transform: "translateX(4px)"
                          }}
                          h="auto"
                          py={4}
                          px={4}
                          whiteSpace="normal"
                          textAlign="left"
                          fontWeight="500"
                          color="gray.600"
                          borderRadius="xl"
                          transition="all 0.2s"
                          rightIcon={<FaChevronRight size={12} />}
                        >
                          {item}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Sell;
