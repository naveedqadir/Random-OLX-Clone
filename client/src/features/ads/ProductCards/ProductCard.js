import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  AspectRatio,
  Skeleton,
  Badge,
  Icon
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import React, { useState } from "react";

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const address = product.address?.[0] || {};
  const createdAt = new Date(product.createdAt);
  const now = new Date();
  const timeDiff = now.getTime() - createdAt.getTime();
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const timeAgo = () => {
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    return `${Math.floor(daysAgo / 30)} months ago`;
  };

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-8px) scale(1.02)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      position="relative"
      cursor="pointer"
      h="100%"
      display="flex"
      flexDirection="column"
      role="group"
    >
      {/* Category Badge */}
      {product.category && (
        <Badge
          position="absolute"
          top={3}
          left={3}
          zIndex={2}
          bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
          color="white"
          fontSize="xs"
          px={3}
          py={1.5}
          borderRadius="full"
          textTransform="capitalize"
          fontWeight="600"
          boxShadow="0 2px 8px rgba(14, 165, 233, 0.4)"
        >
          {product.category}
        </Badge>
      )}

      {/* Image Container */}
      <Box position="relative" overflow="hidden">
        <AspectRatio ratio={4 / 3}>
          <Box>
            {!imageLoaded && (
              <Skeleton 
                h="100%" 
                w="100%" 
                startColor="gray.100" 
                endColor="gray.200" 
              />
            )}
            <Image
              src={product.productpic1}
              alt={product.subcategory}
              objectFit="cover"
              w="100%"
              h="100%"
              onLoad={() => setImageLoaded(true)}
              display={imageLoaded ? "block" : "none"}
              transition="transform 0.5s ease"
              _groupHover={{ transform: "scale(1.08)" }}
              fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
            />
            {/* Gradient overlay on hover */}
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              h="50%"
              bgGradient="linear(to-t, blackAlpha.600, transparent)"
              opacity={0}
              transition="opacity 0.3s"
              _groupHover={{ opacity: 1 }}
            />
          </Box>
        </AspectRatio>
        
        {/* Subcategory Tag */}
        {product.subcategory && (
          <Badge
            position="absolute"
            bottom={3}
            left={3}
            bg="white"
            color="gray.700"
            fontSize="xs"
            px={3}
            py={1.5}
            borderRadius="full"
            textTransform="capitalize"
            fontWeight="600"
            boxShadow="0 2px 8px rgba(0,0,0,0.1)"
            opacity={0}
            transform="translateY(10px)"
            transition="all 0.3s"
            _groupHover={{ opacity: 1, transform: "translateY(0)" }}
          >
            {product.subcategory}
          </Badge>
        )}
      </Box>

      {/* Content */}
      <VStack p={5} align="stretch" spacing={3} flex="1" justify="space-between">
        <Box>
          {/* Price with gradient */}
          <Text
            fontWeight="800"
            fontSize="xl"
            bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
            bgClip="text"
            mb={2}
          >
            {formatPrice(product.price)}
          </Text>
          
          <Text
            fontSize="md"
            color="gray.700"
            noOfLines={2}
            lineHeight="1.5"
            fontWeight="500"
            title={product.title}
          >
            {product.title}
          </Text>
          
          {product.description && (
            <Text
              fontSize="sm"
              color="gray.500"
              noOfLines={2}
              mt={2}
            >
              {product.description}
            </Text>
          )}
        </Box>

        <Box 
          pt={3} 
          borderTop="1px" 
          borderColor="gray.100"
        >
          <HStack justify="space-between" color="gray.500" fontSize="sm">
            <HStack spacing={1.5}>
              <Icon as={FaMapMarkerAlt} boxSize={3} color="pink.500" />
              <Text noOfLines={1} fontWeight="500" maxW="100px">
                {address.city ? `${address.city}` : "India"}
              </Text>
            </HStack>
            <HStack spacing={1.5} bg="gray.50" px={2} py={1} borderRadius="full">
              <Icon as={FaClock} boxSize={3} color="gray.400" />
              <Text whiteSpace="nowrap" fontSize="xs" fontWeight="500">
                {timeAgo()}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
