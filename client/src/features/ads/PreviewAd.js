import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Grid,
  GridItem,
  Avatar,
  Badge,
  Icon,
  VStack,
  HStack,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FaMapMarkerAlt, FaClock, FaShieldAlt, FaComments, FaTrash, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MapComponent from "../../components/common/MapComponent";
import Modallogin from "../../components/auth/Modallogin";
import Loading from "../../components/common/Loading";
import NotFoundComponent from "../../components/common/NotFound";
import { getSafeImageUrl } from "../../utils/imageUtils";

const PreviewAd = ({auth}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [data, setData] = useState({});
  const [own, setOwn] = useState();
  const [loading, setLoading] = useState(true);
  const [NotFound, setNotFound] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const authToken = localStorage.getItem("authToken");
  const toast = useToast();

  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/previewad/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setOwn(response.data.own);
      setData(response.data.product);
      setLoading(false); 
    } catch (error) {
      setOwn(false);
      try{
        const notlogedindata = await axios.post(`${backendUrl}/previewad/notloggedin/${id}`);
      setData(notlogedindata.data.product);
      setLoading(false); 
      }
      catch(e){
        setLoading(false);
        setNotFound(true); 
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <Loading />;
  }
  if (NotFound) {
      return <NotFoundComponent />;
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await axios.delete(`${backendUrl}/myads_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setIsRemoving(false);
      toast({
        title: "Ad Removed",
        description: "The ad has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/myads");
    } catch (error) {
      setIsRemoving(false);
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while removing the ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleClick = async function(){
    if(auth){
     window.location.href = `/chat/${id}/${data.useremail}`
    }
    else{
    toggleShow();
    }
  }
  
  const address = data.address?.[0] || {};
  const ProductPics = Object.keys(data)
    .filter((key) => key.startsWith("productpic") && data[key])
    .map((key) => data[key]);

  const createdAt = new Date(data.createdAt);
  const now = new Date();
  const timeDiff = now.getTime() - createdAt.getTime();
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const timeAgo = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Hero Image Section */}
      <Box 
        bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" 
        position="relative"
        h={{ base: "350px", md: "550px" }}
        overflow="hidden"
      >
        {/* Background blur effect */}
        {ProductPics.length > 0 && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgImage={`url(${ProductPics[currentImageIndex]})`}
            bgSize="cover"
            bgPosition="center"
            filter="blur(30px)"
            opacity={0.4}
            transform="scale(1.1)"
          />
        )}
        
        {/* Custom Image Gallery */}
        <Flex h={{ base: "350px", md: "550px" }} align="center" justify="center" position="relative" w="100%">
          <Image 
            src={ProductPics[currentImageIndex]} 
            alt={`Product Image ${currentImageIndex + 1}`} 
            objectFit="contain" 
            maxH="100%" 
            maxW="100%"
            borderRadius="lg"
            boxShadow="0 20px 60px rgba(0,0,0,0.5)"
            transition="all 0.3s ease"
          />
          
          {/* Previous Button */}
          {ProductPics.length > 1 && (
            <IconButton
              icon={<FaChevronLeft size={24} />}
              position="absolute"
              left={{ base: 2, md: 6 }}
              top="50%"
              transform="translateY(-50%)"
              bg="white"
              color="gray.800"
              size="lg"
              borderRadius="full"
              boxShadow="0 4px 20px rgba(0,0,0,0.3)"
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? ProductPics.length - 1 : prev - 1)}
              _hover={{ bg: 'gray.100', transform: 'translateY(-50%) scale(1.1)' }}
              zIndex={10}
              aria-label="Previous image"
            />
          )}
          
          {/* Next Button */}
          {ProductPics.length > 1 && (
            <IconButton
              icon={<FaChevronRight size={24} />}
              position="absolute"
              right={{ base: 2, md: 6 }}
              top="50%"
              transform="translateY(-50%)"
              bg="white"
              color="gray.800"
              size="lg"
              borderRadius="full"
              boxShadow="0 4px 20px rgba(0,0,0,0.3)"
              onClick={() => setCurrentImageIndex(prev => prev === ProductPics.length - 1 ? 0 : prev + 1)}
              _hover={{ bg: 'gray.100', transform: 'translateY(-50%) scale(1.1)' }}
              zIndex={10}
              aria-label="Next image"
            />
          )}
        </Flex>
        
        {/* Image Indicators (dots) */}
        {ProductPics.length > 1 && (
          <HStack
            position="absolute"
            bottom={20}
            left="50%"
            transform="translateX(-50%)"
            spacing={2}
            zIndex={10}
          >
            {ProductPics.map((_, idx) => (
              <Box
                key={idx}
                w={currentImageIndex === idx ? "24px" : "8px"}
                h="8px"
                bg={currentImageIndex === idx ? "white" : "rgba(255,255,255,0.5)"}
                borderRadius="full"
                cursor="pointer"
                onClick={() => setCurrentImageIndex(idx)}
                transition="all 0.3s ease"
                _hover={{ bg: 'white' }}
              />
            ))}
          </HStack>
        )}
        
        {/* Image counter badge */}
        {ProductPics.length > 1 && (
          <Badge
            position="absolute"
            bottom={6}
            left={6}
            bg="rgba(0,0,0,0.7)"
            color="white"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="600"
            backdropFilter="blur(10px)"
          >
            {currentImageIndex + 1} / {ProductPics.length} Photos
          </Badge>
        )}

        {/* Category Badge */}
        <Badge
          position="absolute"
          top={6}
          left={6}
          bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
          color="white"
          px={4}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="700"
          textTransform="capitalize"
        >
          {data.catagory}
        </Badge>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Breadcrumb */}
        <Box 
          bg="white" 
          p={4} 
          borderRadius="xl" 
          shadow="sm" 
          mb={6}
        >
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.400" />}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/" color="purple.500" fontWeight="500">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={`/${data.catagory}`} color="purple.500" fontWeight="500">
                {data.catagory}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={`/${data.subcatagory}`} color="purple.500" fontWeight="500">
                {data.subcatagory}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="gray.500">{data.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Main Content */}
          <GridItem>
            {/* Price & Title Card */}
            <Box 
              bg="white" 
              borderRadius="2xl" 
              p={8}
              shadow="0 4px 20px rgba(0,0,0,0.08)"
              mb={6}
            >
              <HStack justify="space-between" align="start" mb={4}>
                <Text
                  fontSize="4xl"
                  fontWeight="800"
                  bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
                  bgClip="text"
                >
                  {formatPrice(data.price)}
                </Text>
                <Badge 
                  colorScheme="green" 
                  variant="subtle" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  fontSize="sm"
                >
                  Available
                </Badge>
              </HStack>
              
              <Heading size="xl" color="gray.800" fontWeight="700" mb={4}>
                {data.title}
              </Heading>

              <HStack spacing={6} color="gray.500">
                <HStack>
                  <Icon as={FaMapMarkerAlt} color="pink.500" />
                  <Text>{`${address.city}, ${address.state}`}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaClock} color="purple.500" />
                  <Text>{timeAgo}</Text>
                </HStack>
              </HStack>
            </Box>

            {/* Description Card */}
            <Box 
              bg="white" 
              borderRadius="2xl" 
              p={8}
              shadow="0 4px 20px rgba(0,0,0,0.08)"
            >
              <Heading size="lg" mb={6} color="gray.800" fontWeight="700">
                Description
              </Heading>
              <Text 
                color="gray.600" 
                fontSize="md" 
                whiteSpace="pre-wrap"
                lineHeight="tall"
              >
                {data.description}
              </Text>

              {/* Trust Badges */}
              <Divider my={8} />
              <HStack spacing={6} flexWrap="wrap">
                <HStack 
                  bg="green.50" 
                  px={4} 
                  py={2} 
                  borderRadius="full"
                  color="green.600"
                >
                  <Icon as={FaShieldAlt} />
                  <Text fontWeight="600" fontSize="sm">Verified Seller</Text>
                </HStack>
                <HStack 
                  bg="cyan.50" 
                  px={4} 
                  py={2} 
                  borderRadius="full"
                  color="cyan.600"
                >
                  <Icon as={FaCheckCircle} />
                  <Text fontWeight="600" fontSize="sm">Safe Transaction</Text>
                </HStack>
              </HStack>
            </Box>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <Stack spacing={6} position="sticky" top="100px">
              {/* Seller Card */}
              <Box 
                bg="white" 
                borderRadius="2xl"
                overflow="hidden"
                shadow="0 4px 20px rgba(0,0,0,0.08)"
              >
                <Box 
                  bgGradient="linear(135deg, #0ea5e9, #7c3aed)" 
                  py={4} 
                  px={6}
                >
                  <Text color="white" fontWeight="600" fontSize="sm">
                    SELLER INFORMATION
                  </Text>
                </Box>
                
                <Box p={6}>
                  <Link to={own ? "/profile" : `/profile/${data.useremail}`} style={{ textDecoration: "none" }}>
                    <Flex 
                      alignItems="center" 
                      gap={4}
                      p={4}
                      mx={-4}
                      borderRadius="xl"
                      transition="all 0.2s"
                      _hover={{ bg: "gray.50" }}
                    >
                      <Avatar 
                        size="xl" 
                        src={getSafeImageUrl(data.ownerpicture, 80)} 
                        name={data.owner}
                        ring={3}
                        ringColor="purple.100"
                      />
                      <Box flex="1">
                        <HStack>
                          <Heading size="md" color="gray.800">{data.owner}</Heading>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          Seller
                        </Text>
                      </Box>
                      <ChevronRightIcon color="gray.400" boxSize={6} />
                    </Flex>
                  </Link>
                  
                  <Divider my={6} />
                  
                  {own ? (
                    <Button
                      w="100%"
                      size="lg"
                      colorScheme="red"
                      variant="outline"
                      borderRadius="xl"
                      h="56px"
                      fontWeight="700"
                      onClick={handleRemove}
                      isLoading={isRemoving}
                      loadingText="Removing..."
                      leftIcon={<FaTrash />}
                    >
                      Remove Ad
                    </Button>
                  ) : (
                    <Button
                      w="100%"
                      size="lg"
                      bgGradient="linear(135deg, #7c3aed 0%, #d946ef 100%)"
                      color="white"
                      borderRadius="xl"
                      h="56px"
                      fontWeight="700"
                      onClick={handleClick}
                      leftIcon={<FaComments />}
                      _hover={{
                        bgGradient: "linear(135deg, #6d28d9 0%, #c026d3 100%)",
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
                      }}
                      transition="all 0.3s"
                    >
                      Chat with Seller
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Location Card */}
              <Box 
                bg="white" 
                borderRadius="2xl"
                overflow="hidden"
                shadow="0 4px 20px rgba(0,0,0,0.08)"
              >
                <Box py={4} px={6}>
                  <Heading size="sm" color="gray.700">Posted Location</Heading>
                </Box>
                
                <Box h="200px" w="100%">
                  <MapComponent
                    area={address.area}
                    city={address.city}
                    state={address.state}
                  />
                </Box>
                
                <Box p={6} bg="gray.50">
                  <HStack color="gray.600">
                    <Icon as={FaMapMarkerAlt} color="pink.500" />
                    <Text fontSize="sm" fontWeight="500">
                      {`${address.area}, ${address.city}, ${address.state}, ${address.postcode}`}
                    </Text>
                  </HStack>
                </Box>
              </Box>

              {/* Safety Tips */}
              <Box 
                bg="yellow.50" 
                borderRadius="2xl"
                p={6}
                border="1px solid"
                borderColor="yellow.100"
              >
                <HStack mb={3}>
                  <Icon as={FaShieldAlt} color="yellow.600" />
                  <Heading size="sm" color="yellow.700">Safety Tips</Heading>
                </HStack>
                <VStack align="start" spacing={2} color="yellow.700" fontSize="sm">
                  <Text>• Meet in a safe, public place</Text>
                  <Text>• Check the item before paying</Text>
                  <Text>• Don't pay in advance</Text>
                </VStack>
              </Box>
            </Stack>
          </GridItem>
        </Grid>
      </Container>

      <Modallogin
        setStaticModal={setStaticModal}
        toggleShow={toggleShow}
        staticModal={staticModal}
      />
    </Box>
  );
};

export default PreviewAd;
