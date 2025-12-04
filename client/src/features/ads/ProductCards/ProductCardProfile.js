import { Box, Heading, Image, Text, HStack, VStack, Badge, Icon } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin } from 'react-icons/fi'

export default function ProductCardProfile({ad}) {
  return (
    <Box
      as={Link}
      to={`/preview_ad/${ad._id}`}
      bg="rgba(255,255,255,0.8)"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="rgba(255,255,255,0.3)"
      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        borderColor: "rgba(102,126,234,0.3)"
      }}
      display="block"
      textDecoration="none"
    >
      <HStack p={4} spacing={4} align="start">
        {/* Image */}
        <Box position="relative" flexShrink={0}>
          <Image
            src={ad.productpic1}
            alt={ad.title}
            w="110px"
            h="110px"
            objectFit="cover"
            borderRadius="xl"
            boxShadow="0 4px 15px rgba(0,0,0,0.1)"
          />
          <Badge
            position="absolute"
            top={2}
            left={2}
            bg="rgba(16,185,129,0.9)"
            color="white"
            fontSize="xs"
            borderRadius="md"
            px={2}
            py={0.5}
          >
            Active
          </Badge>
        </Box>

        {/* Content */}
        <VStack align="start" spacing={2} flex={1} minW={0}>
          <Heading 
            size="md" 
            color="gray.800"
            fontWeight="700"
            noOfLines={1}
          >
            {ad.title}
          </Heading>
          
          <Text 
            fontSize="sm" 
            color="gray.500" 
            noOfLines={2}
            lineHeight="1.5"
          >
            {ad.description}
          </Text>

          <HStack spacing={2} mt={1}>
            {ad.address && (
              <HStack spacing={1} color="gray.400" fontSize="xs">
                <Icon as={FiMapPin} w={3} h={3} />
                <Text noOfLines={1}>
                  {ad.address.city || ad.address.state || 'Location'}
                </Text>
              </HStack>
            )}
          </HStack>

          {/* Price */}
          <Text 
            fontSize="xl" 
            fontWeight="800"
            bgGradient="linear(to-r, #667eea, #764ba2)"
            bgClip="text"
          >
            ₹{ad.price?.toLocaleString()}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
