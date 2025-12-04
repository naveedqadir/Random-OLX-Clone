import { Box, Heading, Text, Button, Flex, Icon, VStack } from '@chakra-ui/react';
import { FiServer, FiRefreshCw } from 'react-icons/fi';

const MaintenancePage = () => {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
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
          bg="linear-gradient(135deg, rgba(239,68,68,0.2), rgba(234,179,8,0.2))"
        />
        <Box
          position="absolute"
          bottom="-30px"
          left="-30px"
          w="120px"
          h="120px"
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))"
        />

        <VStack spacing={6} position="relative" zIndex={1}>
          {/* Server icon with animation */}
          <Flex
            w={28}
            h={28}
            borderRadius="full"
            bg="linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 15px 40px rgba(239,68,68,0.4)"
            animation="pulse 2s infinite"
          >
            <Icon as={FiServer} w={12} h={12} color="white" />
          </Flex>

          {/* Title */}
          <Heading
            as="h2"
            size="2xl"
            bgGradient="linear(to-r, #ef4444, #f59e0b)"
            bgClip="text"
            fontWeight="800"
          >
            Server is Down
          </Heading>

          {/* Message */}
          <VStack spacing={2}>
            <Text fontSize="lg" color="gray.600" fontWeight="500">
              Why did the website go for free hosting?
            </Text>
            <Text fontSize="lg" color="gray.600">
              Because it wanted to save up for a domain vacation! 😄
            </Text>
          </VStack>

          <Text color="gray.400" fontSize="md">
            We apologize for the inconvenience.
          </Text>

          {/* Retry Button */}
          <Button
            size="lg"
            w="full"
            maxW="sm"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            fontWeight="700"
            borderRadius="xl"
            py={7}
            leftIcon={<FiRefreshCw />}
            onClick={() => window.location.reload()}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 15px 35px rgba(102,126,234,0.4)"
            }}
            transition="all 0.3s ease"
          >
            Try Again
          </Button>
        </VStack>
      </Box>

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

export default MaintenancePage;


