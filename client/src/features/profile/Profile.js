import {
  Heading,
  Avatar,
  Box,
  Flex,
  Text,
  Button,
  Container,
  VStack,
  HStack,
  Icon,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FaEdit, FaShoppingBag, FaCheckCircle } from 'react-icons/fa';
import CatNavbar from '../../components/layout/CatNavbar';
import MyadCards from '../ads/MyadCards.js';
import { getAvatarProps } from '../../utils/imageUtils';

export default function Profile() {
  const authname = localStorage.getItem('authname');
  const picture = localStorage.getItem("authpicture");

  return (
    <Box bg="gray.50" minH="100vh">
      <CatNavbar />
      
      {/* Hero Banner */}
      <Box
        bgGradient="linear(135deg, #0ea5e9 0%, #7c3aed 50%, #d946ef 100%)"
        h="200px"
        position="relative"
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="70%"
          h="100%"
          bg="white"
          opacity={0.05}
          borderRadius="full"
          filter="blur(40px)"
        />
      </Box>

      <Container maxW="container.xl" mt="-120px" position="relative" zIndex={1} pb={16}>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          {/* Profile Sidebar */}
          <Box
            w={{ base: 'full', lg: '380px' }}
            bg="white"
            boxShadow="0 20px 40px rgba(0,0,0,0.1)"
            rounded="2xl"
            overflow="hidden"
            h="fit-content"
            position={{ lg: 'sticky' }}
            top="100px"
          >
            <Flex 
              direction="column" 
              align="center" 
              pt={12}
              pb={6}
              px={6}
              position="relative"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="100px"
                bgGradient="linear(180deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%)"
              />
              
              <Avatar
                size="2xl"
                {...getAvatarProps(picture, 128)}
                ring={4}
                ringColor="white"
                boxShadow="0 10px 30px rgba(0,0,0,0.15)"
              />
              
              <HStack mt={4} spacing={2}>
                <Heading 
                  fontSize="2xl" 
                  fontWeight="800"
                  bgGradient="linear(135deg, #1e293b, #475569)"
                  bgClip="text"
                >
                  {authname}
                </Heading>
                <Icon as={FaCheckCircle} color="cyan.500" boxSize={5} />
              </HStack>
              
              
              <Text color="gray.500" fontSize="sm" mt={2}>
                Welcome to your profile
              </Text>
            </Flex>

            <Divider />

            <VStack spacing={3} p={6} align="stretch">
              <HStack justify="space-between" p={3} bg="gray.50" borderRadius="xl">
                <HStack spacing={3}>
                  <Box 
                    p={2} 
                    bg="green.100" 
                    borderRadius="lg"
                  >
                    <Icon as={FaCheckCircle} color="green.500" boxSize={4} />
                  </Box>
                  <Text fontWeight="600" color="gray.700">Account Status</Text>
                </HStack>
                <Badge 
                  colorScheme="green" 
                  variant="subtle" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  fontWeight="600"
                >
                  Active
                </Badge>
              </HStack>
            </VStack>

            <Box px={6} pb={6}>
              <Button
                w="full"
                as="a"
                href='/editprofile'
                size="lg"
                bgGradient="linear(135deg, #7c3aed 0%, #d946ef 100%)"
                color="white"
                borderRadius="xl"
                leftIcon={<FaEdit />}
                fontWeight="700"
                _hover={{
                  bgGradient: "linear(135deg, #6d28d9 0%, #c026d3 100%)",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
                }}
                transition="all 0.3s"
              >
                Edit Profile
              </Button>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box flex={1}>
            <Box 
              bg="white" 
              rounded="2xl" 
              shadow="0 4px 20px rgba(0,0,0,0.08)" 
              p={8} 
              mb={8}
            >
              <HStack spacing={4}>
                <Box
                  p={3}
                  bgGradient="linear(135deg, #667eea, #764ba2)"
                  borderRadius="xl"
                >
                  <Icon as={FaShoppingBag} color="white" boxSize={6} />
                </Box>
                <Box>
                  <Heading size="lg" fontWeight="800" color="gray.800">
                    My Listings
                  </Heading>
                  <Text color="gray.500">
                    Manage your ads and profile settings
                  </Text>
                </Box>
              </HStack>
            </Box>
            
            <MyadCards />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}