import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Flex,
  Badge,
  InputGroup,
  Input,
  InputLeftElement,
  SimpleGrid,
} from "@chakra-ui/react";
import { SearchIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { FaFire, FaShieldAlt, FaRocket, FaTags, FaMobileAlt, FaCar, FaHome, FaLaptop } from "react-icons/fa";
import CatNavbar from "../components/layout/CatNavbar";
import ProductCard from "../features/ads/ProductCards/ProductCard";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../components/common/Loading";

const categories = [
  { name: 'Electronics', icon: FaLaptop, color: 'blue', href: '/Electronics & Appliances' },
  { name: 'Cars', icon: FaCar, color: 'green', href: '/OLX Autos (Cars)' },
  { name: 'Properties', icon: FaHome, color: 'orange', href: '/Properties' },
  { name: 'Mobiles', icon: FaMobileAlt, color: 'purple', href: '/Mobiles' },
];

const features = [
  { icon: FaShieldAlt, title: 'Secure', desc: 'Safe transactions' },
  { icon: FaRocket, title: 'Fast', desc: 'Quick listings' },
  { icon: FaTags, title: 'Free', desc: 'No hidden fees' },
];

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const hasMoreProductsToLoad = visibleproducts < products.length;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const getProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/getProducts`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        bgGradient="linear(135deg, #0ea5e9 0%, #38bdf8 50%, #d946ef 100%)"
        py={{ base: 16, md: 24 }}
      >
        {/* Animated background shapes */}
        <Box
          position="absolute"
          top="-50%"
          right="-20%"
          w="60%"
          h="200%"
          bg="rgba(255,255,255,0.1)"
          borderRadius="full"
          transform="rotate(-12deg)"
        />
        <Box
          position="absolute"
          bottom="-30%"
          left="-10%"
          w="40%"
          h="150%"
          bg="rgba(255,255,255,0.05)"
          borderRadius="full"
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center" color="white">
            {/* Logo */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={3}
              boxShadow="0 20px 40px rgba(0,0,0,0.2)"
              transform="translateY(0)"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
            >
              <Box
                as="img"
                src="/logo.png"
                alt="Random Logo"
                h={{ base: '80px', md: '100px' }}
              />
            </Box>

            <Badge 
              bg="rgba(255,255,255,0.2)" 
              color="white" 
              px={4} 
              py={2} 
              borderRadius="full"
              fontSize="sm"
              fontWeight="600"
            >
              <Icon as={FaFire} mr={2} />
              #1 Marketplace in India
            </Badge>
            
            <Heading 
              as="h1" 
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="800"
              lineHeight="1.1"
              maxW="800px"
            >
              Buy & Sell
              <br />
              <Text as="span" color="yellow.300">Anything</Text> Near You
            </Heading>
            
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }} 
              maxW="600px" 
              opacity={0.9}
            >
              Join millions of users buying and selling locally. Find amazing deals or sell your items in minutes.
            </Text>

            {/* Search Bar */}
            <Box w="full" maxW="600px" mt={4}>
              <form onSubmit={handleSearch}>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" h="full">
                    <SearchIcon color="gray.400" boxSize={5} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search for anything..."
                    bg="white"
                    border="none"
                    borderRadius="full"
                    h="60px"
                    pl={12}
                    fontSize="lg"
                    color="gray.800"
                    _placeholder={{ color: 'gray.400' }}
                    _focus={{ 
                      boxShadow: '0 0 0 4px rgba(255,255,255,0.3)',
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    colorScheme="brand"
                    borderRadius="full"
                    px={8}
                    h="44px"
                    type="submit"
                    rightIcon={<ArrowForwardIcon />}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      transform: "translateY(-50%) scale(1.05)",
                      boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
                      px: 10,
                    }}
                    _active={{
                      transform: "translateY(-50%) scale(0.98)",
                    }}
                  >
                    Search
                  </Button>
                </InputGroup>
              </form>
            </Box>

            {/* Quick Stats */}
            <HStack spacing={8} mt={8} flexWrap="wrap" justify="center">
              {features.map((feature, i) => (
                <HStack key={i} spacing={2} bg="rgba(255,255,255,0.15)" px={4} py={2} borderRadius="full">
                  <Icon as={feature.icon} />
                  <VStack spacing={0} align="start">
                    <Text fontWeight="700" fontSize="sm">{feature.title}</Text>
                    <Text fontSize="xs" opacity={0.8}>{feature.desc}</Text>
                  </VStack>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Quick Categories */}
      <Container maxW="container.xl" mt={-8} mb={4} position="relative" zIndex={2}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {categories.map((cat, i) => (
            <Box
              key={i}
              as="a"
              href={cat.href}
              bg="white"
              p={6}
              borderRadius="2xl"
              boxShadow="xl"
              textAlign="center"
              transition="all 0.3s"
              _hover={{ 
                transform: 'translateY(-4px)', 
                boxShadow: '2xl',
              }}
              cursor="pointer"
            >
              <Icon 
                as={cat.icon} 
                boxSize={10} 
                color={`${cat.color}.500`} 
                mb={3}
              />
              <Text fontWeight="700" color="gray.700">{cat.name}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* Category Navigation - with spacing */}
      <Box mt={8}>
        <CatNavbar />
      </Box>

      {/* Products Section */}
      <Box bg="gray.50" py={16}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center" mb={10}>
            <Box>
              <HStack spacing={3} mb={2}>
                <Icon as={FaFire} color="orange.500" boxSize={6} />
                <Heading as="h2" size="xl" fontWeight="800" color="gray.800">
                  Fresh Recommendations
                </Heading>
              </HStack>
              <Text color="gray.500" fontSize="lg">
                Discover amazing deals from our community
              </Text>
            </Box>
            <Button 
              as="a" 
              href="#" 
              variant="ghost" 
              colorScheme="brand" 
              rightIcon={<ArrowForwardIcon />}
              display={{ base: 'none', md: 'flex' }}
            >
              View All
            </Button>
          </Flex>

          <Grid 
            templateColumns={{ 
              base: "1fr", 
              sm: "repeat(2, 1fr)", 
              md: "repeat(3, 1fr)", 
              lg: "repeat(4, 1fr)" 
            }} 
            gap={6}
          >
            {products.slice(0, visibleproducts).map((product, index) => (
              <GridItem 
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/preview_ad/${product._id}`} style={{ textDecoration: 'none' }}>
                  <ProductCard product={product} />
                </Link>
              </GridItem>
            ))}
          </Grid>

          {hasMoreProductsToLoad && (
            <Flex justify="center" mt={12}>
              <Button
                size="lg"
                colorScheme="brand"
                variant="outline"
                borderWidth="2px"
                px={12}
                py={7}
                borderRadius="full"
                fontWeight="700"
                _hover={{
                  bg: "brand.50",
                  transform: "translateY(-2px)",
                  boxShadow: "lg"
                }}
                onClick={() => setVisibleProducts((prev) => prev + 8)}
              >
                Load More Products
              </Button>
            </Flex>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        bgGradient="linear(135deg, #1e293b 0%, #334155 100%)" 
        py={20}
      >
        <Container maxW="container.lg" textAlign="center">
          <VStack spacing={6}>
            <Heading color="white" size="2xl" fontWeight="800">
              Ready to Sell Something?
            </Heading>
            <Text color="gray.300" fontSize="xl" maxW="500px">
              It's free to list your items. Reach millions of buyers instantly.
            </Text>
            <Button
              as="a"
              href="/sell"
              size="lg"
              bgGradient="linear(135deg, #d946ef 0%, #c026d3 100%)"
              color="white"
              px={12}
              py={7}
              borderRadius="full"
              fontWeight="700"
              fontSize="lg"
              _hover={{
                bgGradient: "linear(135deg, #c026d3 0%, #a21caf 100%)",
                transform: "translateY(-3px)",
                boxShadow: "0 20px 40px rgba(217, 70, 239, 0.3)"
              }}
            >
              Start Selling Now
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
