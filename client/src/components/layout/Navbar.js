import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Box,
  Text,
  Flex,
  Container,
  HStack,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import { FaUser, FaHeart, FaSignOutAlt, FaPlus, FaComments, FaShieldAlt } from "react-icons/fa";
import { getAvatarProps } from "../../utils/imageUtils";
import axios from "axios";

import Modallogin from "../auth/Modallogin";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // for register and login
  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (auth) {
        try {
          const authToken = localStorage.getItem('authToken');
          const response = await axios.get(`${backendUrl}/admin/check`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authemail");
    localStorage.removeItem("authname");
    localStorage.removeItem("authpicture");
    localStorage.removeItem("authphone");
    navigate("/");
    setAuth(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const name = localStorage.getItem("authname");
  const picture = localStorage.getItem("authpicture");

  return (
    <Box 
      position="sticky" 
      top="0" 
      zIndex="1000" 
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      boxShadow="0 1px 3px rgba(0,0,0,0.05)"
    >
      <Container maxW="container.xl" py={3}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <HStack spacing={8}>
            <Box 
              as={Link} 
              to="/" 
              display="flex" 
              alignItems="center"
              _hover={{ transform: 'scale(1.02)' }}
              transition="all 0.2s"
            >
              <Box
                as="img"
                src="/logo.png"
                alt="Random Logo"
                h="42px"
                mr={2}
              />
            </Box>

            {/* Navigation Links - Desktop */}
            <HStack spacing={6} display={{ base: 'none', lg: 'flex' }}>
              <Box as={Link} to="/">
                <Text 
                  fontWeight="600" 
                  color="gray.600" 
                  _hover={{ color: 'brand.600' }}
                  transition="color 0.2s"
                >
                  Home
                </Text>
              </Box>
              <Box as={Link} to="/Electronics & Appliances">
                <Text 
                  fontWeight="600" 
                  color="gray.600" 
                  _hover={{ color: 'brand.600' }}
                  transition="color 0.2s"
                >
                  Electronics
                </Text>
              </Box>
              <Box as={Link} to="/OLX Autos (Cars)">
                <Text 
                  fontWeight="600" 
                  color="gray.600" 
                  _hover={{ color: 'brand.600' }}
                  transition="color 0.2s"
                >
                  Cars
                </Text>
              </Box>
            </HStack>
          </HStack>

          {/* Search Bar - Desktop */}
          <Box 
            flex="1" 
            maxW="500px" 
            mx={8} 
            display={{ base: 'none', md: 'block' }}
          >
            <form onSubmit={handleSearch}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search for anything..."
                  bg="gray.50"
                  border="2px solid"
                  borderColor="transparent"
                  borderRadius="full"
                  _hover={{ bg: 'gray.100' }}
                  _focus={{ 
                    bg: 'white', 
                    borderColor: 'brand.400',
                    boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.15)'
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="brand"
                    borderRadius="full"
                    type="submit"
                  >
                    Go
                  </Button>
                </InputRightElement>
              </InputGroup>
            </form>
          </Box>

          {/* Right Side Actions */}
          <HStack spacing={3}>
            {auth && (
              <IconButton
                as={Link}
                to="/chat"
                icon={<FaComments />}
                variant="ghost"
                colorScheme="brand"
                borderRadius="full"
                size="lg"
                position="relative"
                _hover={{ bg: 'brand.50' }}
              />
            )}

            {auth ? (
              <Menu>
                <MenuButton>
                  <Avatar 
                    {...getAvatarProps(picture, 40)} 
                    size="sm" 
                    ring={3} 
                    ringColor="brand.400"
                    cursor="pointer"
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                </MenuButton>
                <MenuList 
                  p={4} 
                  borderRadius="2xl" 
                  boxShadow="xl" 
                  border="none"
                  minW="280px"
                >
                  <VStack spacing={3} mb={4}>
                    <Avatar {...getAvatarProps(picture, 80)} size="xl" ring={4} ringColor="brand.100" />
                    <Box textAlign="center">
                      <Text fontWeight="700" fontSize="lg">{name}</Text>
                      <Badge colorScheme={isAdmin ? "purple" : "brand"} borderRadius="full">
                        {isAdmin ? "Admin" : "Member"}
                      </Badge>
                    </Box>
                  </VStack>
                  <MenuDivider />
                  <MenuItem 
                    onClick={() => navigate('/editprofile')} 
                    borderRadius="xl" 
                    py={3}
                    icon={<Icon as={FaUser} color="brand.500" />}
                    _hover={{ bg: 'brand.50' }}
                  >
                    View Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={() => navigate('/myads')} 
                    borderRadius="xl" 
                    py={3}
                    icon={<Icon as={FaHeart} color="pink.500" />}
                    _hover={{ bg: 'pink.50' }}
                  >
                    My Ads
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem 
                      onClick={() => navigate('/admin')} 
                      borderRadius="xl" 
                      py={3}
                      icon={<Icon as={FaShieldAlt} color="purple.500" />}
                      _hover={{ bg: 'purple.50' }}
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem 
                    onClick={handleLogout} 
                    borderRadius="xl" 
                    py={3}
                    icon={<Icon as={FaSignOutAlt} color="red.500" />}
                    _hover={{ bg: 'red.50' }}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                variant="ghost"
                colorScheme="brand"
                onClick={toggleShow}
                borderRadius="full"
                display={{ base: 'none', md: 'flex' }}
              >
                Sign In
              </Button>
            )}

            <Button
              as={Link}
              to="/sell"
              leftIcon={<FaPlus />}
              bgGradient="linear(135deg, #d946ef 0%, #c026d3 100%)"
              color="white"
              borderRadius="full"
              px={6}
              size="lg"
              fontWeight="700"
              boxShadow="lg"
              _hover={{
                bgGradient: "linear(135deg, #c026d3 0%, #a21caf 100%)",
                transform: 'translateY(-2px)',
                boxShadow: 'xl',
              }}
              _active={{ transform: 'translateY(0)' }}
              display={{ base: 'none', md: 'flex' }}
            >
              Sell Now
            </Button>

            {/* Mobile Menu Button */}
            <IconButton
              icon={<HamburgerIcon />}
              variant="ghost"
              display={{ base: 'flex', lg: 'none' }}
              onClick={onOpen}
              borderRadius="full"
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              <form onSubmit={handleSearch}>
                <InputGroup>
                  <InputLeftElement>
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search..." 
                    borderRadius="full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </form>
              
              <Button as={Link} to="/" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                Home
              </Button>
              <Button as={Link} to="/Electronics & Appliances" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                Electronics
              </Button>
              <Button as={Link} to="/OLX Autos (Cars)" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                Cars
              </Button>
              
              {auth ? (
                <>
                  <Button as={Link} to="/chat" variant="ghost" justifyContent="flex-start" leftIcon={<FaComments />} onClick={onClose}>
                    Messages
                  </Button>
                  <Button as={Link} to="/myads" variant="ghost" justifyContent="flex-start" leftIcon={<FaHeart />} onClick={onClose}>
                    My Ads
                  </Button>
                  <Button as={Link} to="/editprofile" variant="ghost" justifyContent="flex-start" leftIcon={<FaUser />} onClick={onClose}>
                    Profile
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" justifyContent="flex-start" leftIcon={<FaSignOutAlt />} color="red.500">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={toggleShow} colorScheme="brand" borderRadius="full">
                  Sign In
                </Button>
              )}
              
              <Button
                as={Link}
                to="/sell"
                leftIcon={<FaPlus />}
                bgGradient="linear(135deg, #d946ef 0%, #c026d3 100%)"
                color="white"
                borderRadius="full"
                size="lg"
                onClick={onClose}
              >
                Sell Now
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modallogin
        setStaticModal={setStaticModal}
        toggleShow={toggleShow}
        staticModal={staticModal}
      />
    </Box>
  );
}
