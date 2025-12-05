import React, { useEffect, useState } from "react";
import CatNavbar from "../../components/layout/CatNavbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Grid,
  GridItem,
  Box,
  Text,
  HStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import {
  CloseIcon,
  DeleteIcon,
  HamburgerIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { FaComments } from "react-icons/fa";
import Inbox from "./Inbox";
import FetchChat from "./FetchChat";
import SendChat from "./SendChat";
import Loading from "../../components/common/Loading";
import { getSafeImageUrl } from "../../utils/imageUtils";

export default function MyChat() {
  const { id, useremail } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const authToken = localStorage.getItem("authToken");
  const authemail = localStorage.getItem("authemail");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState({});
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [ChatScreen, setChatScreen] = useState(false);

  const handleCloseChat = () => {
    setChatScreen(false);
    navigate('/chat');
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (id && useremail) {
      const fetchData = async () => {
        setChatScreen(true);
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
          setProduct(response.data.product);
          setIsLoading(false);
        } catch (error) {
          setChatScreen(false);
        }
      };
      fetchData();
      if (useremail === authemail) {
        setChatScreen(false);
      } else {
        setChatScreen(true);
        try{
          axios
            .get(`${backendUrl}/profilesearch?useremail=${useremail}`)
            .then((response) => {
              setProfileData(response.data);
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              setChatScreen(false);
            });
          }
          catch{
            setChatScreen(false);
          }
      }

    } else {
      setIsLoading(false);
    }
  }, [id, useremail, authToken, authemail, backendUrl]);

  if (isLoading) {
    return <Loading />;
  }

  const handleDelete = () => {
    setIsLoading(true);
    axios
      .post(
        `${backendUrl}/deletechat/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        navigate('/chat');
        toast({
          title: "Chat Deleted",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "No Chats Found",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <CatNavbar />
      <Container maxW="container.xl" py={{ base: 3, md: 6 }} px={{ base: 3, md: 6 }}>
        <Grid templateColumns={{ base: "1fr", lg: "320px 1fr" }} gap={{ base: 4, md: 6 }}>
          <GridItem display={{ base: ChatScreen ? "none" : "block", lg: "block" }}>
            <Inbox />
          </GridItem>

          <GridItem display={{ base: ChatScreen ? "block" : "none", lg: "block" }}>
            {ChatScreen ? (
              <Flex direction="column" h="full">
                {/* Chat Header */}
                <Box 
                  bg="white" 
                  borderRadius="2xl" 
                  overflow="hidden"
                  boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                  mb={4}
                >
                  <Flex 
                    p={4} 
                    align="center" 
                    justify="space-between"
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    <Flex 
                      align="center" 
                      as={Link} 
                      to={`/profile/${useremail}`}
                      _hover={{ opacity: 0.8 }}
                      transition="all 0.2s"
                    >
                      <Box position="relative" mr={4}>
                        <Avatar
                          src={getSafeImageUrl(profileData.picture, 48)}
                          name={profileData.name || "Unknown User"}
                          size="md"
                          ring={2}
                          ringColor="purple.100"
                        />
                        <Box
                          position="absolute"
                          bottom={0}
                          right={0}
                          bg="green.500"
                          w={3}
                          h={3}
                          borderRadius="full"
                          border="2px solid white"
                        />
                      </Box>
                      <Box>
                        <HStack>
                          <Heading size="sm" color="gray.800">
                            {profileData.name || "Unknown User"}
                          </Heading>
                        </HStack>
                      </Box>
                    </Flex>
                    
                    <HStack spacing={1}>
                      <IconButton
                        icon={<CloseIcon boxSize={3} />}
                        size="sm"
                        variant="ghost"
                        onClick={handleCloseChat}
                        aria-label="Back to inbox"
                        borderRadius="full"
                        display={{ base: "flex", lg: "none" }}
                      />
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<HamburgerIcon />}
                          variant="ghost"
                          size="sm"
                          borderRadius="full"
                        />
                        <MenuList borderRadius="xl" shadow="xl">
                          <MenuItem
                            icon={<DeleteIcon color="red.500" />}
                            onClick={handleDelete}
                            _hover={{ bg: "red.50" }}
                          >
                            Delete Chat
                          </MenuItem>
                          <MenuItem
                            as={Link}
                            to={`/preview_ad/${id}`}
                            icon={<ViewIcon color="green.500" />}
                            _hover={{ bg: "green.50" }}
                          >
                            See Product
                          </MenuItem>
                        </MenuList>
                      </Menu>
                      <IconButton
                        icon={<CloseIcon boxSize={3} />}
                        size="sm"
                        variant="ghost"
                        onClick={handleCloseChat}
                        aria-label="Close chat"
                        borderRadius="full"
                        display={{ base: "none", lg: "flex" }}
                      />
                    </HStack>
                  </Flex>
                  
                  {/* Product Info */}
                  <Flex 
                    p={3} 
                    bg="gray.50" 
                    align="center"
                    gap={3}
                  >
                    <Image
                      boxSize="50px"
                      objectFit="cover"
                      src={product.productpic1 || "https://via.placeholder.com/50x50?text=No+Image"}
                      alt="Product"
                      borderRadius="lg"
                      fallbackSrc="https://via.placeholder.com/50x50?text=No+Image"
                    />
                    <Box flex={1}>
                      <Text fontWeight="600" fontSize="sm" noOfLines={1} color="gray.700">
                        {product.title}
                      </Text>
                      <Text
                        fontWeight="700"
                        fontSize="sm"
                        bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
                        bgClip="text"
                      >
                        {formatPrice(product.price)}
                      </Text>
                    </Box>
                    <Badge 
                      colorScheme="green" 
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                    >
                      Available
                    </Badge>
                  </Flex>
                </Box>
                
                {/* Chat Area */}
                <Box 
                  flex="1" 
                  display="flex" 
                  flexDirection="column"
                  bg="white"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                >
                  {profileData && profileData.name ? (
                    <FetchChat id={id} toData={profileData} to={useremail} />
                  ) : (
                    <Loading />
                  )}
                  <Box p={4} borderTop="1px" borderColor="gray.100">
                    <SendChat id={id} to={useremail} />
                  </Box>
                </Box>
              </Flex>
            ) : (
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
                h={{ base: "auto", lg: "70vh" }}
                minH={{ base: "200px", lg: "auto" }}
                py={{ base: 10, lg: 0 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                display={{ base: "none", lg: "flex" }}
              >
                <Box
                  p={5}
                  bgGradient="linear(135deg, rgba(14, 165, 233, 0.1), rgba(124, 58, 237, 0.1))"
                  borderRadius="full"
                  mb={4}
                >
                  <Icon as={FaComments} boxSize={10} color="purple.500" />
                </Box>
                <Heading size="sm" color="gray.700" mb={2}>
                  Your Messages
                </Heading>
                <Text color="gray.500" textAlign="center" maxW="280px" fontSize="sm">
                  Select a conversation from the sidebar to start chatting
                </Text>
              </Flex>
            )}
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
