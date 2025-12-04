import React, { useState } from "react";
import { useToast, Box, Textarea, Button, Icon, HStack } from "@chakra-ui/react";
import axios from "axios";
import { FiSend } from "react-icons/fi";

export default function SendChat({ id, to }) {
  const [message, setMessage] = useState("");
  const authToken = localStorage.getItem("authToken");
  const toast = useToast();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        sendMessage(e);
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      const response = await axios.post(
        `${backendUrl}/sendMessage`,
        { message, id, to },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("");
      }
      if (response.status === 201) {
        setMessage("You cannot send Message");
        toast({
          title: "You cannot send Message",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Box 
      as="form" 
      onSubmit={sendMessage} 
      bg="rgba(255,255,255,0.8)"
      backdropFilter="blur(10px)"
      p={4} 
      borderRadius="2xl"
      border="1px solid"
      borderColor="rgba(255,255,255,0.3)"
      boxShadow="0 -4px 20px rgba(0,0,0,0.05)"
    >
      <HStack spacing={3}>
        <Textarea
          placeholder="Type a message..."
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          size="md"
          resize="none"
          rows={2}
          bg="white"
          border="2px solid"
          borderColor="gray.100"
          borderRadius="xl"
          py={3}
          px={4}
          _focus={{
            borderColor: '#667eea',
            boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
          }}
          _hover={{ borderColor: 'gray.200' }}
          _placeholder={{ color: 'gray.400' }}
        />
        <Button
          type="submit"
          size="lg"
          h="60px"
          w="60px"
          borderRadius="xl"
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          isDisabled={message.trim().length === 0}
          _hover={{
            transform: 'scale(1.05)',
            boxShadow: '0 8px 25px rgba(102,126,234,0.4)'
          }}
          _active={{
            transform: 'scale(0.95)'
          }}
          _disabled={{
            opacity: 0.5,
            cursor: 'not-allowed',
            _hover: {
              transform: 'none',
              boxShadow: 'none'
            }
          }}
          transition="all 0.2s ease"
        >
          <Icon as={FiSend} w={5} h={5} />
        </Button>
      </HStack>
    </Box>
  );
}
