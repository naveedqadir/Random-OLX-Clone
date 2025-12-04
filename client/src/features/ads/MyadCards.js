import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  SimpleGrid,
  Flex,
  Spinner,
  VStack,
  Text
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import NotListedAnything from "../../components/common/NotListedAnything";
import ProductCardProfile from "./ProductCards/ProductCardProfile";

function MyadCards() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < ads.length;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${backendUrl}/myads_view`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setAds(data);
      setIsLoading(false);
    };
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ads.length === 0 && isLoading === false) {
    return <NotListedAnything />
  }

  return (
    <Box>
      {isLoading ? (
        <Flex 
          justify="center" 
          align="center" 
          h="300px"
          bg="rgba(255,255,255,0.5)"
          backdropFilter="blur(10px)"
          borderRadius="2xl"
        >
          <VStack spacing={4}>
            <Box
              w={16}
              h={16}
              borderRadius="full"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 10px 30px rgba(102,126,234,0.3)"
            >
              <Spinner size="lg" color="white" thickness="3px" />
            </Box>
            <Text color="gray.500" fontWeight="500">Loading your ads...</Text>
          </VStack>
        </Flex>
      ) : (
        <>
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={6}
          >
            {ads.slice(0, visibleproducts).map((ad, index) => (
              <Box
                key={ad._id || index}
                style={{
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
                }}
              >
                <ProductCardProfile ad={ad}/>
              </Box>
            ))}
          </SimpleGrid>
          
          {hasMoreProductsToLoad && (
            <Flex justify="center" mt={10}>
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
                Load More
              </Button>
            </Flex>
          )}

          {/* Results count */}
          <Text 
            textAlign="center" 
            mt={6} 
            color="gray.400" 
            fontSize="sm"
          >
            Showing {Math.min(visibleproducts, ads.length)} of {ads.length} ads
          </Text>
        </>
      )}

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

export default MyadCards;
