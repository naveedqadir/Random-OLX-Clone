import { Box, Flex, Text, Avatar, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../../components/common/Loading";
import { getSafeImageUrl } from "../../utils/imageUtils";

export default function FetchChat({ id, toData, to }) {
  const authPicture = localStorage.getItem("authpicture");
  const authName = localStorage.getItem("authname");
  const authemail = localStorage.getItem("authemail");
  const authToken = localStorage.getItem("authToken");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [newMessages, setNewMessages] = useState([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (id) {
      const fetchNewMessages = async () => {
        const currentMessageLength = newMessages.length;
        try {
          const response = await axios.get(`${backendUrl}/api/new-messages`, {
            params: { id, to },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = response.data;
          setNewMessages(data);
          setIsLoading(false);

          if (currentMessageLength !== data.length) {
            setHasNewMessages(true);
          } else {
            setHasNewMessages(false);
          }
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      };

      const intervalId = setInterval(fetchNewMessages, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [id, authToken, newMessages, backendUrl, to]);

  useEffect(() => {
    if (hasNewMessages) {
      scrollToBottom();
      setHasNewMessages(false);
    }
  }, [hasNewMessages]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      className="message-container"
      h="450px"
      overflowY="auto"
      ref={messageContainerRef}
      p={6}
      bg="linear-gradient(180deg, rgba(248,250,252,0.8) 0%, rgba(241,245,249,0.9) 100%)"
      borderRadius="2xl"
      sx={{
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(102,126,234,0.3)',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(102,126,234,0.5)',
        },
      }}
    >
      <VStack spacing={4} align="stretch">
        {newMessages.map((message, index) => {
          const isMe = message.from === authemail;
          return (
            <Flex 
              key={index} 
              justify={isMe ? "flex-end" : "flex-start"} 
              align="flex-end"
              style={{
                animation: `fadeIn 0.3s ease ${index * 0.05}s both`
              }}
            >
              {!isMe && (
                <Avatar
                  size="sm"
                  src={getSafeImageUrl(toData?.picture, 60)}
                  name={toData?.name}
                  mr={3}
                  mb={1}
                  border="2px solid white"
                  boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                />
              )}
              <Box
                maxW="70%"
                bg={isMe 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                  : "rgba(255,255,255,0.9)"
                }
                color={isMe ? "white" : "gray.700"}
                px={5}
                py={3}
                borderRadius="2xl"
                borderBottomRightRadius={isMe ? "4px" : "2xl"}
                borderBottomLeftRadius={!isMe ? "4px" : "2xl"}
                boxShadow={isMe 
                  ? "0 4px 15px rgba(102,126,234,0.3)" 
                  : "0 2px 10px rgba(0,0,0,0.05)"
                }
                backdropFilter={!isMe ? "blur(10px)" : undefined}
                border={!isMe ? "1px solid rgba(255,255,255,0.5)" : undefined}
              >
                <Text fontSize="md" lineHeight="1.5">{message.message}</Text>
                <Text 
                  fontSize="xs" 
                  opacity={isMe ? 0.8 : 0.5} 
                  textAlign="right" 
                  mt={2}
                  fontWeight="500"
                >
                  {formatTime(message.createdAt)}
                </Text>
              </Box>
              {isMe && (
                <Avatar
                  size="sm"
                  src={getSafeImageUrl(authPicture, 60)}
                  name={authName}
                  ml={3}
                  mb={1}
                  border="2px solid white"
                  boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                />
              )}
            </Flex>
          );
        })}
      </VStack>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
