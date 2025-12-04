import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "../../components/common/Catagories";
import NotFound from "../../components/common/NotFound";
import axios from "axios";
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  GridItem, 
  Flex, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Icon,
  Badge 
} from "@chakra-ui/react";
import ProductCard from "./ProductCards/ProductCard";
import SearchNotFound from "../../components/common/SearchNotFound";
import CatNavbar from "../../components/layout/CatNavbar";
import Loading from "../../components/common/Loading";
import { FiGrid, FiChevronDown } from "react-icons/fi";


export default function CatagoryView() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < products.length;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const isValidCategory = categories.some(
    (cat) => cat.title.toLowerCase() === category.toLowerCase()
  );
  const isValidItem = categories.some((cat) => cat.items.includes(category));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isValidCategory && !isValidItem) {
      return;
    }

    const getProductsbyCategory = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getProductsbyCategory/${category}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getProductsbyCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isValidCategory, isValidItem]);

  if (!isValidCategory && !isValidItem) {
    return <NotFound />;
  }

  if (products.length === 0) {
    return <SearchNotFound />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Box bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" minH="100vh">
      <CatNavbar />
      
      <Container maxW="container.xl" py={10}>
        {/* Category Header */}
        <Box
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          borderRadius="3xl"
          p={8}
          mb={10}
          position="relative"
          overflow="hidden"
          boxShadow="0 20px 60px rgba(102,126,234,0.4)"
        >
          <Box
            position="absolute"
            top="-50%"
            right="-10%"
            w="300px"
            h="300px"
            borderRadius="full"
            bg="rgba(255,255,255,0.1)"
          />
          <Box
            position="absolute"
            bottom="-30%"
            left="-5%"
            w="200px"
            h="200px"
            borderRadius="full"
            bg="rgba(255,255,255,0.08)"
          />
          
          <VStack align="start" spacing={3} position="relative" zIndex={1}>
            <HStack>
              <Icon as={FiGrid} w={8} h={8} color="white" />
              <Heading color="white" size="xl" textTransform="capitalize">
                {category.replace(/-/g, ' ')}
              </Heading>
            </HStack>
            <HStack spacing={4}>
              <Badge
                bg="rgba(255,255,255,0.2)"
                color="white"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="md"
                fontWeight="600"
              >
                {products.length} Items Found
              </Badge>
            </HStack>
          </VStack>
        </Box>

        {/* Products Grid */}
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
              style={{
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
              }}
            >
              <Link to={`/preview_ad/${product._id}`} style={{ textDecoration: 'none' }}>
                <ProductCard product={product} />
              </Link>
            </GridItem>
          ))}
        </Grid>

        {/* Load More Button */}
        {hasMoreProductsToLoad && (
          <Flex justify="center" mt={12}>
            <Button
              size="lg"
              bg="rgba(255,255,255,0.8)"
              backdropFilter="blur(10px)"
              color="gray.700"
              fontWeight="700"
              borderRadius="xl"
              px={10}
              py={7}
              rightIcon={<FiChevronDown />}
              onClick={() => setVisibleProducts((prev) => prev + 10)}
              border="1px solid"
              borderColor="rgba(255,255,255,0.3)"
              boxShadow="0 10px 40px rgba(0,0,0,0.1)"
              _hover={{ 
                bg: "white",
                transform: "translateY(-2px)",
                boxShadow: "0 15px 50px rgba(0,0,0,0.15)"
              }}
              transition="all 0.3s ease"
            >
              Load More Products
            </Button>
          </Flex>
        )}

        {/* Results count */}
        <Text 
          textAlign="center" 
          mt={8} 
          color="gray.500" 
          fontSize="sm"
        >
          Showing {Math.min(visibleproducts, products.length)} of {products.length} results
        </Text>
      </Container>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
