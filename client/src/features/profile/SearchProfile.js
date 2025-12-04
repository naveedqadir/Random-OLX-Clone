import {
  Heading,
  Avatar,
  Box,
  Flex,
  Button,
  SimpleGrid,
  Container,
  Text,
  Icon,
  HStack,
  VStack
} from "@chakra-ui/react";
import CatNavbar from "../../components/layout/CatNavbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCardProfile from "../ads/ProductCards/ProductCardProfile";
import NotListedAnything from "../../components/common/NotListedAnything";
import Loading from "../../components/common/Loading";
import { getAvatarProps } from "../../utils/imageUtils";
import { FiShare2, FiPackage, FiUser } from "react-icons/fi";

export default function SearchProfile() {
  const { useremail } = useParams();
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < products.length;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  if (useremail === localStorage.getItem("authemail")) {
    window.location.href = "/profile";
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${backendUrl}/profilesearch?useremail=${useremail}`)
      .then((response) => {
        setProfileData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });

    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/getProductsbyemail?useremail=${useremail}`
        );
        setProducts(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    getProducts();
  }, [useremail, backendUrl]);

  if (isLoading) {
    return <Loading />;
  }

  const name = profileData.name;
  const picture = profileData.picture;

  return (
    <Box minH="100vh" bg="gray.50">
      <CatNavbar />
      <Container maxW="container.xl" py={10}>
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Profile Card */}
          <Box
            w={{ base: "full", lg: "320px" }}
            flexShrink={0}
          >
            <Box
              bg="rgba(255,255,255,0.8)"
              backdropFilter="blur(20px)"
              borderRadius="3xl"
              overflow="hidden"
              border="1px solid"
              borderColor="rgba(255,255,255,0.3)"
              boxShadow="0 25px 50px -12px rgba(0,0,0,0.1)"
              position="sticky"
              top={6}
            >
              {/* Cover Image */}
              <Box
                h="140px"
                w="full"
                bgGradient="linear(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-50%"
                  right="-20%"
                  w="200px"
                  h="200px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.1)"
                />
                <Box
                  position="absolute"
                  bottom="-30%"
                  left="-10%"
                  w="150px"
                  h="150px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.08)"
                />
              </Box>
              
              {/* Avatar */}
              <Flex justify="center" mt={-16} position="relative" zIndex={2}>
                <Box
                  p="4px"
                  borderRadius="full"
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  boxShadow="0 10px 40px rgba(102,126,234,0.4)"
                >
                  <Avatar
                    {...getAvatarProps(picture, 140)}
                    size="2xl"
                    border="4px solid white"
                  />
                </Box>
              </Flex>

              <VStack p={8} pt={4} spacing={4}>
                <VStack spacing={1}>
                  <Heading 
                    fontSize="2xl" 
                    fontWeight="700"
                    bgGradient="linear(to-r, #667eea, #764ba2)"
                    bgClip="text"
                  >
                    {name}
                  </Heading>
                  <HStack>
                    <Icon as={FiUser} w={4} h={4} color="gray.400" />
                    <Text color="gray.500" fontSize="sm">Member</Text>
                  </HStack>
                </VStack>

                <HStack spacing={6} py={4}>
                  <VStack spacing={0}>
                    <Text fontWeight="700" fontSize="xl" color="gray.800">
                      {products.length}
                    </Text>
                    <Text fontSize="sm" color="gray.500">Listings</Text>
                  </VStack>
                </HStack>

                <Button
                  w="full"
                  size="lg"
                  bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  borderRadius="xl"
                  fontWeight="600"
                  leftIcon={<Icon as={FiShare2} />}
                  boxShadow="0 10px 30px rgba(102,126,234,0.3)"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 40px rgba(102,126,234,0.4)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.3s ease"
                >
                  Share Profile
                </Button>
              </VStack>
            </Box>
          </Box>

          {/* Products Section */}
          <Box flex={1}>
            {products.length === 0 ? (
              <NotListedAnything />
            ) : (
              <Box
                bg="rgba(255,255,255,0.6)"
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                p={8}
                border="1px solid"
                borderColor="rgba(255,255,255,0.3)"
                boxShadow="0 25px 50px -12px rgba(0,0,0,0.08)"
              >
                <HStack mb={8} spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius="xl"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 8px 25px rgba(102,126,234,0.3)"
                  >
                    <Icon as={FiPackage} w={6} h={6} color="white" />
                  </Box>
                  <Box>
                    <Heading size="lg" color="gray.800">
                      Products by {name}
                    </Heading>
                    <Text color="gray.500" fontSize="sm">
                      {products.length} item{products.length !== 1 ? 's' : ''} listed
                    </Text>
                  </Box>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                  {products.slice(0, visibleproducts).map((ad, index) => (
                    <Box
                      key={ad._id || index}
                      transition="all 0.3s ease"
                      _hover={{ transform: "translateY(-4px)" }}
                    >
                      <ProductCardProfile ad={ad} />
                    </Box>
                  ))}
                </SimpleGrid>

                {hasMoreProductsToLoad && (
                  <Flex justify="center" mt={10}>
                    <Button
                      size="lg"
                      bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                      color="white"
                      px={10}
                      borderRadius="xl"
                      fontWeight="600"
                      boxShadow="0 10px 30px rgba(102,126,234,0.3)"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 15px 40px rgba(102,126,234,0.4)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.3s ease"
                      onClick={() => {
                        setVisibleProducts((prev) => prev + 10);
                      }}
                    >
                      Load More Products
                    </Button>
                  </Flex>
                )}
              </Box>
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
