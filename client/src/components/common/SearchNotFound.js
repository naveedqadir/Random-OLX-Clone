import { useState } from 'react';
import { Box, Heading, Text, Button, Flex, Icon, VStack, Input, InputGroup, InputLeftElement, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FiSearch, FiHome } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import CatNavbar from "../layout/CatNavbar";


const SearchNotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
      <CatNavbar />
      
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minH="80vh"
        px={4}
      >
        <Box
          bg="rgba(255,255,255,0.8)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          p={{ base: 10, md: 16 }}
          maxW="lg"
          w="full"
          textAlign="center"
          border="1px solid"
          borderColor="rgba(255,255,255,0.3)"
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.15)"
          position="relative"
          overflow="hidden"
        >
          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-40px"
            right="-40px"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="120px"
            h="120px"
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(16,185,129,0.2), rgba(102,126,234,0.2))"
          />

          <VStack spacing={6} position="relative" zIndex={1}>
            {/* Animated search icon */}
            <Flex
              w={28}
              h={28}
              borderRadius="full"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 15px 40px rgba(102,126,234,0.4)"
              animation="pulse 2s infinite"
            >
              <Icon as={FiSearch} w={12} h={12} color="white" />
            </Flex>

            {/* Title */}
            <Heading
              as="h2"
              size="2xl"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              fontWeight="800"
            >
              Oops!
            </Heading>

            {/* Description */}
            <VStack spacing={2}>
              <Text fontSize="xl" color="gray.600" fontWeight="500">
                We can't seem to find that
              </Text>
              <Text fontSize="md" color="gray.400">
                Try searching for something else
              </Text>
            </VStack>

            {/* Search Input */}
            <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '24rem' }}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" h="full">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search again..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="white"
                  border="2px solid"
                  borderColor="gray.100"
                  borderRadius="xl"
                  py={6}
                  pr="3.5rem"
                  _focus={{
                    borderColor: "#667eea",
                    boxShadow: "0 0 0 3px rgba(102,126,234,0.2)"
                  }}
                  _hover={{
                    borderColor: "gray.200"
                  }}
                />
                <InputRightElement h="full" pr={2}>
                  <IconButton
                    type="submit"
                    size="sm"
                    icon={<SearchIcon />}
                    bgGradient="linear(135deg, #667eea, #764ba2)"
                    color="white"
                    borderRadius="lg"
                    _hover={{
                      bgGradient: "linear(135deg, #5a6fd6, #6a4190)",
                      transform: "scale(1.05)"
                    }}
                    aria-label="Search"
                  />
                </InputRightElement>
              </InputGroup>
            </form>

            {/* Home Button */}
            <Button
              as={Link}
              to="/"
              size="lg"
              w="full"
              maxW="sm"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              fontWeight="700"
              borderRadius="xl"
              py={7}
              leftIcon={<FiHome />}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 15px 35px rgba(102,126,234,0.4)"
              }}
              transition="all 0.3s ease"
            >
              Go to Home
            </Button>
          </VStack>
        </Box>
      </Flex>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </Box>
  );
};

export default SearchNotFound;
