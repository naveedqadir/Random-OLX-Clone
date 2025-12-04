import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    Icon,
    VStack,
    Heading,
    Text,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    HStack,
    Divider,
    Alert,
    AlertIcon,
    Checkbox,
    Link,
    useToast,
    Flex,
    PinInput,
    PinInputField,
    useDisclosure,
} from "@chakra-ui/react";
import { FiLogIn, FiMail, FiLock, FiUser, FiArrowRight, FiShield, FiArrowLeft, FiKey, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import GoogleSignIn from './GoogleSignIn';
import { getSafeImageUrl } from '../../utils/imageUtils';

export default function Modallogin({staticModal, setStaticModal, toggleShow}) {
  const [isLogin, setIsLogin] = useState(true);
  const [err, setErr] = useState();
  const toast = useToast();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Close modal handler
  const handleClose = () => {
    setStaticModal(false);
    if (toggleShow) toggleShow();
  };

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRPassword, setRegRPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [regError, setRegError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password State
  const { isOpen: isForgotOpen, onOpen: onForgotOpen, onClose: onForgotClose } = useDisclosure();
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOTP, setForgotOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErr(null);
    setRegError('');
  };

  const handleForgotOpen = () => {
    setForgotStep(1);
    setForgotEmail('');
    setForgotOTP('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError('');
    onForgotOpen();
  };

  const handleForgotClose = () => {
    onForgotClose();
    setForgotStep(1);
    setForgotError('');
  };

  const sendResetOTP = async () => {
    if (!forgotEmail) {
      setForgotError('Please enter your email address');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await axios.post(`${backendUrl}/forgot-password`, { email: forgotEmail });
      setForgotStep(2);
      toast({
        title: 'OTP Sent',
        description: 'Check your email for the verification code',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setForgotError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const verifyAndResetPassword = async () => {
    if (forgotOTP.length !== 4) {
      setForgotError('Please enter the complete 4-digit OTP');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await axios.post(`${backendUrl}/reset-password`, {
        email: forgotEmail,
        otp: forgotOTP,
        newPassword: newPassword,
      });
      setForgotStep(3);
      toast({
        title: 'Password Reset Successful',
        description: 'You can now login with your new password',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setForgotError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  function register(event) {
    event.preventDefault();
    if (regPassword !== regRPassword) {
      setRegError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    axios
      .post(`${backendUrl}/register`, {
        email: regEmail,
        password: regPassword,
        name: regName,
      })
      .then((response) => {
        setRegistered(true);
        setIsLoading(false);
        toast({
          title: 'Account created!',
          description: "You can now sign in.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setErr(error.response?.status);
        if (error.response?.data?.error?.message) {
          setRegError(error.response.data.error.message);
        } else if (error.response?.data?.message) {
          setRegError(error.response.data.message);
        }
      });
  }

  function login(event) {
    event.preventDefault();
    setIsLoading(true);
    axios
      .post(`${backendUrl}/login`, {
        email: loginEmail,
        password: loginPassword,
      })
      .then((response) => {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('authemail', response.data.email);
        localStorage.setItem('authname', response.data.name);
        localStorage.setItem('authphone', response.data.phone || '');
        localStorage.setItem('authpicture', getSafeImageUrl(response.data.picture, 96));
        window.location.href = '/';
      })
      .catch((error) => {
        setIsLoading(false);
        setErr(error.response?.status);
      });
  }

  return (
    <Modal 
      isOpen={staticModal} 
      onClose={handleClose} 
      isCentered 
      size={{ base: "full", sm: "md" }}
      motionPreset="scale"
      scrollBehavior="inside"
      closeOnOverlayClick={true}
      closeOnEsc={true}
    >
      <ModalOverlay 
        bg="blackAlpha.700" 
        backdropFilter="blur(10px)"
        onClick={handleClose}
      />
      <ModalContent 
        borderRadius={{ base: 0, sm: "2xl" }}
        overflow="hidden"
        bg="white"
        boxShadow="0 25px 50px -12px rgba(0,0,0,0.4)"
        mx={{ base: 0, sm: 4 }}
        my={{ base: 0, sm: 4 }}
        maxH={{ base: "100vh", sm: "90vh" }}
      >
        {/* Header */}
        <Box
          bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
          pt={{ base: 10, sm: 8 }}
          pb={6}
          px={6}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-40px"
            right="-40px"
            w="120px"
            h="120px"
            borderRadius="full"
            bg="rgba(255,255,255,0.1)"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="80px"
            h="80px"
            borderRadius="full"
            bg="rgba(255,255,255,0.08)"
          />
          
          <ModalCloseButton 
            color="white" 
            top={4}
            right={4}
            borderRadius="full"
            w={10}
            h={10}
            onClick={handleClose}
            _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            zIndex={10}
          />
          
          <VStack spacing={3} align="center" position="relative" zIndex={1}>
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
              <Icon as={FiLogIn} w={8} h={8} color="white" />
            </Box>
            <Heading size="lg" color="white" fontWeight="700">
              {isLogin ? 'Welcome Back!' : 'Join Us'}
            </Heading>
            <Text color="whiteAlpha.800" fontSize="sm" textAlign="center">
              {isLogin ? 'Sign in to access your account' : 'Create an account to get started'}
            </Text>
          </VStack>
        </Box>
        
        {/* Body */}
        <Box p={{ base: 5, sm: 6 }} overflowY="auto">
          {/* Google Sign In */}
          <VStack spacing={4} mb={5}>
            <Box w="full" display="flex" justifyContent="center">
              <GoogleSignIn isVisible={staticModal} />
            </Box>
            
            <HStack w="full">
              <Divider borderColor="gray.200" />
              <Text 
                fontSize="xs" 
                color="gray.400" 
                whiteSpace="nowrap"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                or
              </Text>
              <Divider borderColor="gray.200" />
            </HStack>
          </VStack>

          {isLogin ? (
            /* Login Form */
            <form onSubmit={login}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)}
                      size="lg"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ 
                        borderColor: '#667eea',
                        bg: 'white',
                        boxShadow: '0 0 0 3px rgba(102,126,234,0.1)'
                      }}
                      placeholder="your@email.com"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      type="password" 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)}
                      size="lg"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ 
                        borderColor: '#667eea',
                        bg: 'white',
                        boxShadow: '0 0 0 3px rgba(102,126,234,0.1)'
                      }}
                      placeholder="••••••••"
                    />
                  </InputGroup>
                </FormControl>

                <Flex justify="space-between" align="center" w="full">
                  <Checkbox colorScheme="purple" size="sm">
                    <Text fontSize="sm" color="gray.600">Remember me</Text>
                  </Checkbox>
                  <Link 
                    color="#667eea" 
                    fontSize="sm"
                    fontWeight="600"
                    onClick={handleForgotOpen}
                    cursor="pointer"
                    _hover={{ color: '#764ba2' }}
                  >
                    Forgot password?
                  </Link>
                </Flex>

                {err === 404 && (
                  <Alert status="error" borderRadius="lg" fontSize="sm">
                    <AlertIcon />
                    Email not found
                  </Alert>
                )}
                {err === 400 && (
                  <Alert status="error" borderRadius="lg" fontSize="sm">
                    <AlertIcon />
                    Incorrect password
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  w="full"
                  size="lg"
                  bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  borderRadius="xl"
                  h="52px"
                  fontWeight="700"
                  rightIcon={<FiArrowRight />}
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  _hover={{
                    bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(102,126,234,0.35)'
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          ) : (
            /* Register Form */
            !registered ? (
              <form onSubmit={register}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Full Name</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FiUser} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        type="text" 
                        value={regName} 
                        onChange={(e) => setRegName(e.target.value)}
                        size="lg"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea',
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.1)'
                        }}
                        placeholder="John Doe"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FiMail} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        type="email" 
                        value={regEmail} 
                        onChange={(e) => setRegEmail(e.target.value)}
                        size="lg"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea',
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.1)'
                        }}
                        placeholder="your@email.com"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FiLock} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        type="password" 
                        value={regPassword} 
                        onChange={(e) => setRegPassword(e.target.value)}
                        size="lg"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea',
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.1)'
                        }}
                        placeholder="••••••••"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Confirm Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FiShield} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        type="password" 
                        value={regRPassword} 
                        onChange={(e) => setRegRPassword(e.target.value)}
                        size="lg"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ 
                          borderColor: '#667eea',
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.1)'
                        }}
                        placeholder="••••••••"
                      />
                    </InputGroup>
                  </FormControl>

                  {regError && (
                    <Alert status="error" borderRadius="lg" fontSize="sm">
                      <AlertIcon />
                      {regError}
                    </Alert>
                  )}
                  {err === 409 && (
                    <Alert status="error" borderRadius="lg" fontSize="sm">
                      <AlertIcon />
                      User already exists
                    </Alert>
                  )}

                  <Checkbox isRequired colorScheme="purple" size="sm" alignSelf="start">
                    <Text fontSize="sm" color="gray.600">
                      I agree to the{' '}
                      <Link color="#667eea" fontWeight="600">Terms</Link>
                      {' '}&{' '}
                      <Link color="#667eea" fontWeight="600">Privacy Policy</Link>
                    </Text>
                  </Checkbox>

                  <Button 
                    type="submit" 
                    w="full"
                    size="lg"
                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    borderRadius="xl"
                    h="52px"
                    fontWeight="700"
                    rightIcon={<FiArrowRight />}
                    isLoading={isLoading}
                    loadingText="Creating account..."
                    _hover={{
                      bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(102,126,234,0.35)'
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.2s"
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>
            ) : (
              /* Success State */
              <VStack spacing={4} py={6}>
                <Box
                  w={16}
                  h={16}
                  borderRadius="full"
                  bg="green.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiShield} w={8} h={8} color="green.500" />
                </Box>
                <Heading size="md" color="gray.800">Account Created!</Heading>
                <Text color="gray.500" textAlign="center" fontSize="sm">
                  Your account has been created successfully. You can now sign in.
                </Text>
                <Button 
                  colorScheme="green"
                  borderRadius="xl"
                  onClick={switchMode}
                  rightIcon={<FiArrowRight />}
                >
                  Go to Login
                </Button>
              </VStack>
            )
          )}

          {/* Footer */}
          <Text mt={6} textAlign="center" fontSize="sm" color="gray.500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button 
              variant="link" 
              color="#667eea"
              fontWeight="700"
              fontSize="sm"
              onClick={switchMode}
              _hover={{ color: '#764ba2' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </Text>
        </Box>
      </ModalContent>

      {/* Forgot Password Modal */}
      <Modal isOpen={isForgotOpen} onClose={handleForgotClose} isCentered size="md">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl" mx={4}>
          <ModalHeader 
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            borderTopRadius="2xl"
            py={6}
          >
            <VStack spacing={2}>
              <Icon as={forgotStep === 3 ? FiCheck : FiKey} boxSize={8} />
              <Text fontWeight="700">
                {forgotStep === 1 && 'Forgot Password'}
                {forgotStep === 2 && 'Enter OTP'}
                {forgotStep === 3 && 'Password Reset'}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={8} px={6}>
            {forgotStep === 1 && (
              <VStack spacing={6}>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Enter your email address and we'll send you a verification code to reset your password.
                </Text>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700" fontSize="sm">Email Address</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your@email.com"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: '#667eea',
                        bg: 'white',
                      }}
                    />
                  </InputGroup>
                </FormControl>
                {forgotError && (
                  <Alert status="error" borderRadius="xl" fontSize="sm">
                    <AlertIcon />
                    {forgotError}
                  </Alert>
                )}
                <Button
                  w="full"
                  size="lg"
                  bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  borderRadius="xl"
                  onClick={sendResetOTP}
                  isLoading={forgotLoading}
                  rightIcon={<FiArrowRight />}
                  _hover={{
                    bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                  }}
                >
                  Send OTP
                </Button>
              </VStack>
            )}

            {forgotStep === 2 && (
              <VStack spacing={5}>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  We've sent a 4-digit code to <strong>{forgotEmail}</strong>
                </Text>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700" textAlign="center" fontSize="sm">
                    Enter Verification Code
                  </FormLabel>
                  <HStack justify="center" spacing={3}>
                    <PinInput
                      otp
                      size="lg"
                      value={forgotOTP}
                      onChange={setForgotOTP}
                    >
                      <PinInputField
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: '#667eea' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                      <PinInputField
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: '#667eea' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                      <PinInputField
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: '#667eea' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                      <PinInputField
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: '#667eea' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                    </PinInput>
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700" fontSize="sm">New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: '#667eea',
                        bg: 'white',
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700" fontSize="sm">Confirm New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FiShield} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm password"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: '#667eea',
                        bg: 'white',
                      }}
                    />
                  </InputGroup>
                </FormControl>
                {forgotError && (
                  <Alert status="error" borderRadius="xl" fontSize="sm">
                    <AlertIcon />
                    {forgotError}
                  </Alert>
                )}
                <HStack w="full" spacing={3}>
                  <Button
                    flex={1}
                    size="lg"
                    variant="outline"
                    borderRadius="xl"
                    leftIcon={<FiArrowLeft />}
                    onClick={() => setForgotStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    flex={2}
                    size="lg"
                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    borderRadius="xl"
                    onClick={verifyAndResetPassword}
                    isLoading={forgotLoading}
                    rightIcon={<FiArrowRight />}
                    _hover={{
                      bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                    }}
                  >
                    Reset
                  </Button>
                </HStack>
                <Button
                  variant="link"
                  color="#667eea"
                  onClick={sendResetOTP}
                  isLoading={forgotLoading}
                  fontSize="sm"
                >
                  Resend OTP
                </Button>
              </VStack>
            )}

            {forgotStep === 3 && (
              <VStack spacing={6}>
                <Box
                  w={20}
                  h={20}
                  borderRadius="full"
                  bgGradient="linear(135deg, #10b981 0%, #059669 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiCheck} color="white" boxSize={10} />
                </Box>
                <Text color="gray.700" fontWeight="600" fontSize="lg" textAlign="center">
                  Password reset successful!
                </Text>
                <Text color="gray.500" textAlign="center" fontSize="sm">
                  You can now sign in with your new password.
                </Text>
                <Button
                  w="full"
                  size="lg"
                  bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  borderRadius="xl"
                  onClick={handleForgotClose}
                  _hover={{
                    bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                  }}
                >
                  Back to Login
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Modal>
  )
}
