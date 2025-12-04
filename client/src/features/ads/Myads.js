import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  SimpleGrid,
  Badge,
  Flex,
  Icon,
  Container,
  AspectRatio,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import CatNavbar from "../../components/layout/CatNavbar";
import axios from "axios";
import ReactLoading from "react-loading";
import NotListedAnything from "../../components/common/NotListedAnything";
import { FaTrash, FaEye, FaShoppingBag } from "react-icons/fa";

export default function Myads() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [visibleproducts, setVisibleProducts] = useState(9);
  const hasMoreProductsToLoad = visibleproducts < ads.length;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
    return (
      <Box bg="gray.50" minH="100vh">
        <CatNavbar />
        <NotListedAnything />
      </Box>
    );
  }

  const handleDelete = async (id) => {
    setIsRemoving(true);
    setDeletingCardId(id);
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${backendUrl}/myads_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
      toast({
        title: "Ad Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsRemoving(false);
    setDeletingCardId(null);
  };

  return (
    <Box bg="gray.50" minH="100vh">
      {isLoading ? (
        <Flex justify="center" align="center" h="100vh" direction="column" gap={4}>
          <ReactLoading type="spin" color="#7c3aed" height={50} width={50} />
          <Text color="gray.500">Loading your listings...</Text>
        </Flex>
      ) : (
        <>
          <CatNavbar />
          
          {/* Header */}
          <Box 
            bgGradient="linear(180deg, #f8fafc 0%, #f1f5f9 100%)" 
            py={10}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Container maxW="container.xl">
              <HStack spacing={4}>
                <Box
                  p={3}
                  bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
                  borderRadius="xl"
                >
                  <Icon as={FaShoppingBag} color="white" boxSize={6} />
                </Box>
                <Box>
                  <Heading 
                    size="lg" 
                    fontWeight="800"
                    bgGradient="linear(135deg, #1e293b, #475569)"
                    bgClip="text"
                  >
                    Your Listings
                  </Heading>
                  <Text color="gray.500">
                    Manage and track your active ads
                  </Text>
                </Box>
              </HStack>
              <Badge 
                mt={4}
                colorScheme="purple" 
                variant="subtle" 
                px={3} 
                py={1} 
                borderRadius="full"
                fontSize="sm"
              >
                {ads.length} {ads.length === 1 ? 'listing' : 'listings'}
              </Badge>
            </Container>
          </Box>

          <Container maxW="container.xl" py={10}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {ads.slice(0, visibleproducts).map((ad, index) => (
                <Box 
                  key={ad._id} 
                  bg="white" 
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                  transition="all 0.3s"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                  }}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Box position="relative">
                    <AspectRatio ratio={16/10}>
                      <Image
                        src={ad.productpic1}
                        alt={ad.title}
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/400x250?text=No+Image"
                      />
                    </AspectRatio>
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      bg="green.500"
                      color="white"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="600"
                    >
                      Active
                    </Badge>
                  </Box>
                  
                  <VStack p={5} align="stretch" spacing={3}>
                    <Text
                      fontWeight="800"
                      fontSize="xl"
                      bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
                      bgClip="text"
                    >
                      {formatPrice(ad.price)}
                    </Text>
                    <Heading size="md" noOfLines={1} color="gray.800" fontWeight="600">
                      {ad.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.500" noOfLines={2}>
                      {ad.description}
                    </Text>
                    
                    <HStack pt={4} spacing={3}>
                      <Button
                        as="a"
                        href={`/preview_ad/${ad._id}`}
                        flex={1}
                        size="md"
                        leftIcon={<FaEye />}
                        variant="ghost"
                        bg="gray.50"
                        color="gray.700"
                        borderRadius="xl"
                        fontWeight="600"
                        _hover={{ bg: "gray.100" }}
                      >
                        View
                      </Button>
                      <Button
                        flex={1}
                        size="md"
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        bg="red.50"
                        borderRadius="xl"
                        fontWeight="600"
                        onClick={() => handleDelete(ad._id)}
                        isLoading={isRemoving && deletingCardId === ad._id}
                        loadingText="..."
                        _hover={{ bg: "red.100" }}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            
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
                  onClick={() => setVisibleProducts((prev) => prev + 9)}
                  _hover={{
                    bg: "purple.50",
                    transform: "translateY(-2px)",
                    boxShadow: "lg"
                  }}
                >
                  Load More Listings
                </Button>
              </Flex>
            )}
          </Container>
        </>
      )}
    </Box>
  );
}
