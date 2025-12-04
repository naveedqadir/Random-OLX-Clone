import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  Container,
  FormControl,
  FormLabel,
  VStack,
  Avatar,
  Center,
  Icon,
  Spinner
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FiUser, FiMail, FiPhone, FiCamera, FiSave, FiArrowLeft, FiShield, FiAlertCircle } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatNavbar from "../../components/layout/CatNavbar";
import axios from "axios";
import { getSafeImageUrl } from "../../utils/imageUtils";

export default function UserProfileEdit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const [isSending, setSending] = useState(false);
  const [verifyscr, Setverifyscr] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const toast = useToast();
  const picture = localStorage.getItem("authpicture");

  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const authemail = localStorage.getItem("authemail");
  const authphone = localStorage.getItem("authphone");

  useEffect(() => {
    const authname = localStorage.getItem("authname");
    if (authname) {
      setName(authname);
    }
    if (authemail) {
      setEmail(authemail);
    }
    if (authphone) {
      setPhoneNumber(authphone);
    }
  }, [authemail, authphone]);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${backendUrl}/verification-status?email=${authemail}`);
        const data = await response.json();
        setIsVerified(data.isVerified);
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authemail]);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handlePhoneChange(event) {
    setPhoneNumber(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  const handleSendOtp = async (event) => {
    setSending(true);
    try {
      await axios.post(`${backendUrl}/send-verification-email`, { email });
      Setverifyscr(true);
      toast({
        title: "Verification Email Sent",
        description: "Enter 4-digit OTP.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while sending the verification email.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  const handlePinSubmit = async (value) => {
    setSending(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${backendUrl}/verify-email`,
        { pin: value, email: email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      localStorage.setItem("authemail", response.data.email);
      localStorage.setItem("authname", response.data.name);
      localStorage.setItem("authToken", response.data.token);
      onClose();
      Setverifyscr(false);

      toast({
        title: "Success",
        description: "Email verified successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error verifying email:", error);
      toast({
        title: "Error",
        description: "Email verification failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  const [imageUrl, setImageUrl] = useState(picture);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    if (phoneNumber.length !== 10) {
      toast({
        title: 'Error',
        description: 'Phone number should be 10 digits.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      let imageUrlToSend = imageUrl;
  
      if (imageUrl.length > 200) {
        const formData = new FormData();
        formData.append('file', imageUrl);
        formData.append('upload_preset', cloudinaryUploadPreset);
  
        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        imageUrlToSend = data.secure_url;
      }
  
      const authToken = localStorage.getItem('authToken');
  
      const response = await axios.post(
        `${backendUrl}/profile_edit`,
        { name, imageUrl: imageUrlToSend, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      localStorage.setItem('authname', response.data.name);
      localStorage.setItem('authphone', response.data.phone);
      localStorage.setItem('authpicture', getSafeImageUrl(response.data.picture, 96));
  
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during image upload or profile update:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating the profile.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" minH="100vh">
      <CatNavbar />
      <Container maxW="container.md" py={10}>
        {/* Header */}
        <Box
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          borderRadius="3xl"
          p={8}
          mb={8}
          position="relative"
          overflow="hidden"
          boxShadow="0 20px 60px rgba(102,126,234,0.4)"
        >
          <Box
            position="absolute"
            top="-50%"
            right="-10%"
            w="300px"
            h="300px"
            borderRadius="full"
            bg="rgba(255,255,255,0.1)"
          />
          <Flex justify="space-between" align="center" position="relative" zIndex={1}>
            <HStack>
              <Icon as={FiUser} w={8} h={8} color="white" />
              <Heading color="white" size="xl">
                Edit Profile
              </Heading>
            </HStack>
            <Button
              as={Link}
              to="/profile"
              variant="ghost"
              color="white"
              leftIcon={<FiArrowLeft />}
              _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            >
              View Profile
            </Button>
          </Flex>
        </Box>

        {/* Main Form Card */}
        <Box
          bg="rgba(255,255,255,0.8)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          border="1px solid"
          borderColor="rgba(255,255,255,0.3)"
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.1)"
          overflow="hidden"
        >
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={0}>
              {/* Basic Information */}
              <Box p={8}>
                <HStack mb={6}>
                  <Icon as={FiUser} w={5} h={5} color="#667eea" />
                  <Text fontWeight="700" color="gray.700">Basic Information</Text>
                </HStack>
                <FormControl id="name" isRequired>
                  <FormLabel fontSize="sm" color="gray.500" fontWeight="500">Full Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    size="lg"
                    bg="white"
                    border="2px solid"
                    borderColor="gray.100"
                    borderRadius="xl"
                    py={6}
                    _focus={{
                      borderColor: '#667eea',
                      boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
                    }}
                    _hover={{ borderColor: 'gray.200' }}
                  />
                </FormControl>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box p={8}>
                <HStack mb={6}>
                  <Icon as={FiMail} w={5} h={5} color="#667eea" />
                  <Text fontWeight="700" color="gray.700">Contact Information</Text>
                </HStack>
                <VStack spacing={6}>
                  <FormControl id="email" isRequired>
                    <FormLabel fontSize="sm" color="gray.500" fontWeight="500">Email Address</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FiMail} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={authemail}
                        onClick={() => {
                          setOverlay(<OverlayOne />);
                          onOpen();
                        }}
                        readOnly
                        cursor="pointer"
                        bg="white"
                        border="2px solid"
                        borderColor="gray.100"
                        borderRadius="xl"
                        _focus={{
                          borderColor: '#667eea',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
                        }}
                        _hover={{ borderColor: 'gray.200' }}
                      />
                    </InputGroup>
                    <Flex mt={3} align="center">
                      {isVerified ? (
                        <Badge
                          bg="rgba(16,185,129,0.1)"
                          color="#10b981"
                          display="flex"
                          alignItems="center"
                          px={3}
                          py={1.5}
                          borderRadius="full"
                          fontWeight="600"
                        >
                          <Icon as={FiShield} mr={2} />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          bg="rgba(239,68,68,0.1)"
                          color="#ef4444"
                          display="flex"
                          alignItems="center"
                          px={3}
                          py={1.5}
                          borderRadius="full"
                          fontWeight="600"
                        >
                          <Icon as={FiAlertCircle} mr={2} />
                          Not Verified
                        </Badge>
                      )}
                    </Flex>
                  </FormControl>

                  <FormControl id="phone" isRequired>
                    <FormLabel fontSize="sm" color="gray.500" fontWeight="500">Phone Number</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FiPhone} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        bg="white"
                        border="2px solid"
                        borderColor="gray.100"
                        borderRadius="xl"
                        _focus={{
                          borderColor: '#667eea',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.2)'
                        }}
                        _hover={{ borderColor: 'gray.200' }}
                      />
                    </InputGroup>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Profile Picture */}
              <Box p={8}>
                <HStack mb={6}>
                  <Icon as={FiCamera} w={5} h={5} color="#667eea" />
                  <Text fontWeight="700" color="gray.700">Profile Picture</Text>
                </HStack>
                <Center flexDirection="column">
                  <Box position="relative" mb={6}>
                    <Avatar
                      size="2xl"
                      src={imageUrl}
                      name={name}
                      border="4px solid white"
                      boxShadow="0 10px 40px rgba(102,126,234,0.3)"
                    />
                    {imageUrl && (
                      <Tooltip label="Remove Image" placement="top">
                        <IconButton
                          icon={<CloseIcon />}
                          size="sm"
                          isRound
                          bg="#ef4444"
                          color="white"
                          position="absolute"
                          top={-1}
                          right={-1}
                          _hover={{ bg: '#dc2626' }}
                          onClick={() =>
                            setImageUrl(
                              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            )
                          }
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <FormControl w="auto">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      variant="unstyled"
                      p={1}
                    />
                  </FormControl>
                </Center>
              </Box>

              <Divider />

              {/* Actions */}
              <Flex p={8} justify="flex-end" gap={4} bg="rgba(0,0,0,0.02)">
                <Button
                  as={Link}
                  to="/profile"
                  variant="ghost"
                  size="lg"
                  borderRadius="xl"
                  px={8}
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  borderRadius="xl"
                  px={10}
                  isLoading={isLoading}
                  loadingText="Saving"
                  leftIcon={<FiSave />}
                  fontWeight="700"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 35px rgba(102,126,234,0.4)'
                  }}
                  transition="all 0.3s ease"
                >
                  Save Changes
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </Container>

      {/* Email Verification Modal */}
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="md"
      >
        {overlay}
        <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
          <ModalHeader
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            textAlign="center"
            py={8}
            position="relative"
          >
            <Box
              position="absolute"
              top="-30px"
              right="-30px"
              w="100px"
              h="100px"
              borderRadius="full"
              bg="rgba(255,255,255,0.1)"
            />
            <VStack spacing={3}>
              <Box
                w={16}
                h={16}
                borderRadius="2xl"
                bg="rgba(255,255,255,0.2)"
                backdropFilter="blur(10px)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiMail} w={8} h={8} color="white" />
              </Box>
              <Heading size="md">
                {verifyscr ? "Enter Verification Code" : "Verify Your Email"}
              </Heading>
              <Text fontSize="sm" opacity={0.8} fontWeight="normal">
                {verifyscr ? "We sent a code to your email" : "Secure your account with email verification"}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={8} px={6}>
            {!verifyscr ? (
              <VStack spacing={6}>
                <Box
                  bg="linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)"
                  borderRadius="xl"
                  p={4}
                  w="full"
                  border="1px solid"
                  borderColor="rgba(102,126,234,0.2)"
                >
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    We will send a 4-digit confirmation code to verify your email address.
                  </Text>
                </Box>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Email Address</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="your@email.com"
                      bg="gray.50"
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="gray.100"
                      _hover={{ borderColor: 'gray.200' }}
                      _focus={{
                        borderColor: '#667eea',
                        bg: 'white',
                        boxShadow: '0 0 0 3px rgba(102,126,234,0.15)'
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  width="full"
                  size="lg"
                  bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  borderRadius="xl"
                  onClick={handleSendOtp}
                  isLoading={isSending}
                  loadingText="Sending..."
                  fontWeight="700"
                  h="56px"
                  _hover={{
                    bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(102,126,234,0.35)'
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  transition="all 0.2s ease"
                >
                  Send Verification Code
                </Button>
              </VStack>
            ) : (
              <VStack spacing={6}>
                <Box
                  bg="linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)"
                  borderRadius="xl"
                  p={4}
                  w="full"
                  border="1px solid"
                  borderColor="rgba(16,185,129,0.2)"
                >
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    Code sent to <Text as="span" fontWeight="700" color="#667eea">{email}</Text>
                  </Text>
                </Box>
                <Button
                  size="sm"
                  variant="ghost"
                  color="#667eea"
                  onClick={() => Setverifyscr(false)}
                  leftIcon={<Icon as={FiArrowLeft} />}
                  _hover={{ bg: 'purple.50' }}
                >
                  Change Email
                </Button>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.600" textAlign="center">Enter 4-Digit Code</FormLabel>
                  <HStack spacing={4} justify="center">
                    <PinInput size="lg" otp onComplete={handlePinSubmit}>
                      <PinInputField
                        w={14}
                        h={14}
                        fontSize="xl"
                        fontWeight="bold"
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        bg="gray.50"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea', 
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.15)' 
                        }}
                      />
                      <PinInputField
                        w={14}
                        h={14}
                        fontSize="xl"
                        fontWeight="bold"
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        bg="gray.50"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea', 
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.15)' 
                        }}
                      />
                      <PinInputField
                        w={14}
                        h={14}
                        fontSize="xl"
                        fontWeight="bold"
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        bg="gray.50"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea', 
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.15)' 
                        }}
                      />
                      <PinInputField
                        w={14}
                        h={14}
                        fontSize="xl"
                        fontWeight="bold"
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        bg="gray.50"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea', 
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.15)' 
                        }}
                      />
                    </PinInput>
                  </HStack>
                </FormControl>
                {isSending && (
                  <HStack spacing={2}>
                    <Spinner size="sm" color="#667eea" />
                    <Text fontSize="sm" color="gray.500">Verifying...</Text>
                  </HStack>
                )}
                <Divider />
                <HStack spacing={1}>
                  <Text fontSize="sm" color="gray.500">Didn't receive the code?</Text>
                  <Button 
                    variant="link" 
                    color="#667eea" 
                    size="sm" 
                    fontWeight="600"
                    onClick={handleSendOtp}
                    isLoading={isSending}
                  >
                    Resend
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}