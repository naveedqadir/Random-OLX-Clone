import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CatNavbar from '../../components/layout/CatNavbar';
import { Box, Button, Container, Grid, GridItem, Flex, Heading, Text, HStack, Icon, Badge } from '@chakra-ui/react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ProductCard from '../ads/ProductCards/ProductCard';
import SearchNotFound from '../../components/common/SearchNotFound';
import NotFound from '../../components/common/NotFound';
import Loading from '../../components/common/Loading';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(8);
  const hasMoreProductsToLoad = visibleproducts < results.length;

  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setResults([]);
    setError(null);
    setVisibleProducts(8);
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/search?q=${query}`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [query, backendUrl]);

  if (loading) {
    return <Loading />;
  }

  if (results.length === 0) {
    return <SearchNotFound />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <CatNavbar />
      
      {/* Search Header */}
      <Box 
        bgGradient="linear(180deg, #f8fafc 0%, #f1f5f9 100%)" 
        py={10}
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Container maxW="container.xl">
          <HStack spacing={4} mb={4}>
            <Box
              p={3}
              bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
              borderRadius="xl"
            >
              <Icon as={FaSearch} color="white" boxSize={5} />
            </Box>
            <Box>
              <Text color="gray.500" fontSize="sm">Search results for</Text>
              <Heading 
                size="lg" 
                fontWeight="800"
                bgGradient="linear(135deg, #1e293b, #475569)"
                bgClip="text"
              >
                "{query}"
              </Heading>
            </Box>
          </HStack>
          <Badge 
            colorScheme="purple" 
            variant="subtle" 
            px={3} 
            py={1} 
            borderRadius="full"
            fontSize="sm"
          >
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </Badge>
        </Container>
      </Box>

      <Container maxW="container.xl" py={10}>
        <Grid 
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} 
          gap={6}
        >
          {results.slice(0, visibleproducts).map((product, index) => (
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
              colorScheme="purple"
              variant="outline"
              borderWidth="2px"
              px={12}
              py={7}
              borderRadius="full"
              fontWeight="700"
              onClick={() => setVisibleProducts((prev) => prev + 8)}
              _hover={{
                bg: "purple.50",
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
            >
              Load More Products
            </Button>
          </Flex>
        )}
      </Container>
    </Box>
  );
}
