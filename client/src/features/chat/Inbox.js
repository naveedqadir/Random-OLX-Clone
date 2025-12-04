import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../components/common/Loading";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Avatar,
  Text,
  Flex,
  LinkBox,
  LinkOverlay,
  Icon
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getSafeImageUrl } from "../../utils/imageUtils";
import { FiInbox, FiMessageCircle } from "react-icons/fi";

export default function Inbox() {
  const [newChats, setNewChats] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const authemail = localStorage.getItem("authemail");
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchNewChats = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/newchats`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data;
        setNewChats(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchNewChats, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [authToken, backendUrl]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (newChats.length === 0) {
    return (
      <Box bg="transparent" py={{ base: 4, md: 6 }}>
        <Box
          bg="rgba(255,255,255,0.9)"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          p={{ base: 8, md: 10 }}
          border="1px solid"
          borderColor="rgba(0,0,0,0.05)"
          boxShadow="0 4px 20px rgba(0,0,0,0.06)"
          textAlign="center"
        >
          <Box
            w={{ base: 16, md: 20 }}
            h={{ base: 16, md: 20 }}
            mx="auto"
            mb={4}
            borderRadius="full"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 8px 30px rgba(102,126,234,0.3)"
          >
            <Icon as={FiInbox} w={{ base: 7, md: 8 }} h={{ base: 7, md: 8 }} color="white" />
          </Box>
          <Heading
            size={{ base: "md", md: "lg" }}
            mb={2}
            bgGradient="linear(to-r, #667eea, #764ba2)"
            bgClip="text"
          >
            No Messages Yet
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
            Start a conversation to see messages here
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="transparent" py={{ base: 0, md: 0 }}>
      {/* Header */}
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        borderRadius="2xl"
        p={{ base: 4, md: 6 }}
        mb={4}
        position="relative"
        overflow="hidden"
        boxShadow="0 10px 30px rgba(102,126,234,0.3)"
      >
        <Box
          position="absolute"
          top="-50%"
          right="-10%"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="rgba(255,255,255,0.1)"
        />
        <HStack spacing={3} position="relative" zIndex={1}>
          <Icon as={FiMessageCircle} w={{ base: 5, md: 6 }} h={{ base: 5, md: 6 }} color="white" />
          <Box>
            <Heading color="white" size={{ base: "sm", md: "md" }}>
              Inbox
            </Heading>
            <Text color="whiteAlpha.800" fontSize={{ base: "xs", md: "sm" }}>
              {newChats.length} conversation{newChats.length !== 1 ? 's' : ''}
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Messages List */}
      <Box
        bg="rgba(255,255,255,0.9)"
        backdropFilter="blur(20px)"
        borderRadius="xl"
        overflow="hidden"
        border="1px solid"
        borderColor="rgba(0,0,0,0.05)"
        boxShadow="0 4px 20px rgba(0,0,0,0.06)"
      >
        <VStack spacing={0} align="stretch">
          {newChats
            .filter(chat => chat && chat.message)
            .map((chat, index) => (
              <LinkBox
                key={index}
                as="article"
                p={{ base: 3, md: 4 }}
                borderBottomWidth={index !== newChats.length - 1 ? "1px" : "0px"}
                borderColor="rgba(0,0,0,0.05)"
                _hover={{ 
                  bg: "rgba(102,126,234,0.05)",
                  transform: "translateX(2px)"
                }}
                transition="all 0.2s ease"
                cursor="pointer"
              >
                <Flex align="center" justify="space-between">
                  <HStack spacing={3} flex={1}>
                    <Box position="relative" flexShrink={0}>
                      <Avatar
                        size={{ base: "md", md: "md" }}
                        name={chat.user?.name || "Unknown User"}
                        src={getSafeImageUrl(chat.user?.picture, 96)}
                        border="2px solid"
                        borderColor="white"
                        boxShadow="0 2px 10px rgba(0,0,0,0.1)"
                      />
                      <Box
                        position="absolute"
                        bottom={0}
                        right={0}
                        w={3}
                        h={3}
                        bg="#10b981"
                        borderRadius="full"
                        border="2px solid white"
                      />
                    </Box>
                    <Box flex={1} minW={0}>
                      <Flex justify="space-between" align="center" mb={0.5} gap={2}>
                        <LinkOverlay
                          as={Link}
                          to={
                            chat.to === authemail
                              ? `/chat/${chat.product_id}/${chat.from}`
                              : `/chat/${chat.product_id}/${chat.to}`
                          }
                        >
                          <Text fontWeight="600" fontSize={{ base: "sm", md: "md" }} color="gray.800" noOfLines={1}>
                            {chat.user?.name || "Unknown User"}
                          </Text>
                        </LinkOverlay>
                        <Text
                          color="gray.400"
                          fontSize="xs"
                          fontWeight="500"
                          flexShrink={0}
                        >
                          {formatTime(chat.createdAt)}
                        </Text>
                      </Flex>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" noOfLines={1}>
                        {chat.message}
                      </Text>
                    </Box>
                  </HStack>
                </Flex>
              </LinkBox>
            ))}
        </VStack>
      </Box>
    </Box>
  );
}
