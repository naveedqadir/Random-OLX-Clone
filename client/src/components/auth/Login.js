import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Checkbox,
  Alert,
  AlertIcon,
  Link,
  Flex,
  Heading,
  VStack,
  HStack,
  Icon,
  Divider,
  InputGroup,
  InputLeftElement,
  PinInput,
  PinInputField,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaUser, FaArrowRight, FaShieldAlt, FaArrowLeft, FaKey, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import GoogleSignIn from './GoogleSignIn';
import { getSafeImageUrl } from '../../utils/imageUtils';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [err, setErr] = useState();
  const toast = useToast();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

  // Forgot Password State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOTP, setForgotOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

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
    setResetSuccess(false);
    onOpen();
  };

  const handleForgotClose = () => {
    onClose();
    setForgotStep(1);
    setForgotError('');
    setResetSuccess(false);
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
      setResetSuccess(true);
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
      setRegError("Passwords Don't Match");
      return;
    }

    axios
      .post(`${backendUrl}/register`, {
        email: regEmail,
        password: regPassword,
        name: regName,
      })
      .then((response) => {
        setRegistered(true);
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
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
    axios
      .post(`${backendUrl}/login`, {
        email: loginEmail,
        password: loginPassword,
      })
      .then((response) => {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('authemail', response.data.email);
        localStorage.setItem('authname', response.data.name);
        localStorage.setItem('authphone', response.data.phone);
        localStorage.setItem('authpicture', getSafeImageUrl(response.data.picture, 96));
        window.location.href = '/';
      })
      .catch((error) => {
        setErr(error.response?.status);
      });
  }

  return (
    <Box 
      minH="100vh" 
      bgGradient="linear(135deg, #0ea5e9 0%, #7c3aed 50%, #d946ef 100%)"
      py={20}
      position="relative"
      overflow="hidden"
    >
      {/* Background shapes */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="50%"
        h="60%"
        bg="white"
        opacity={0.05}
        borderRadius="full"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="-10%"
        w="40%"
        h="50%"
        bg="white"
        opacity={0.05}
        borderRadius="full"
        filter="blur(60px)"
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <Box
          bg="white"
          borderRadius="3xl"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          overflow="hidden"
        >
          {/* Header */}
          <Box 
            bgGradient="linear(135deg, #1e293b 0%, #334155 100%)" 
            p={8}
            textAlign="center"
          >
            <Heading 
              size="xl" 
              color="white"
              fontWeight="800"
              mb={2}
            >
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Heading>
            <Text color="gray.400">
              {isLogin 
                ? 'Sign in to access your account' 
                : 'Join millions of buyers and sellers'}
            </Text>
          </Box>

          <Box p={8}>
            {/* Google Sign In */}
            <VStack spacing={4} mb={6}>
              <GoogleSignIn isVisible={true} />
              
              <HStack w="full" my={4}>
                <Divider />
                <Text 
                  fontSize="sm" 
                  color="gray.500" 
                  whiteSpace="nowrap"
                  fontWeight="500"
                >
                  or continue with email
                </Text>
                <Divider />
              </HStack>
            </VStack>

            {isLogin ? (
              <form onSubmit={login}>
                <Stack spacing={5}>
                  <FormControl id="login-email" isRequired>
                    <FormLabel fontWeight="600" color="gray.700">Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FaEnvelope} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        type="email" 
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)}
                        size="lg"
                        bg="gray.50"
                        border="2px solid"
                        borderColor="gray.100"
                        borderRadius="xl"
                        _hover={{ borderColor: 'gray.200' }}
                        _focus={{ 
                          borderColor: 'purple.400',
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                        }}
                        placeholder="your@email.com"
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl id="login-password" isRequired>
                    <FormLabel fontWeight="600" color="gray.700">Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" h="full">
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        type="password" 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)}
                        size="lg"
                        bg="gray.50"
                        border="2px solid"
                        borderColor="gray.100"
                        borderRadius="xl"
                        _hover={{ borderColor: 'gray.200' }}
                        _focus={{ 
                          borderColor: 'purple.400',
                          bg: 'white',
                          boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                        }}
                        placeholder="••••••••"
                      />
                    </InputGroup>
                  </FormControl>
                  <Flex justify="space-between" align="center">
                    <Checkbox colorScheme="purple" fontWeight="500" color="gray.600">
                      Remember me
                    </Checkbox>
                    <Link 
                      color="purple.500" 
                      onClick={handleForgotOpen}
                      fontWeight="600"
                      _hover={{ color: 'purple.600', cursor: 'pointer' }}
                    >
                      Forgot password?
                    </Link>
                  </Flex>
                  <Button 
                    type="submit" 
                    size="lg"
                    bgGradient="linear(135deg, #7c3aed 0%, #d946ef 100%)"
                    color="white"
                    borderRadius="xl"
                    h="56px"
                    fontWeight="700"
                    fontSize="lg"
                    rightIcon={<FaArrowRight />}
                    _hover={{
                      bgGradient: "linear(135deg, #6d28d9 0%, #c026d3 100%)",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)'
                    }}
                    _active={{
                      transform: 'translateY(0)',
                    }}
                    transition="all 0.3s"
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>
            ) : (
              !registered ? (
                <form onSubmit={register}>
                  <Stack spacing={5}>
                    <FormControl id="register-name" isRequired>
                      <FormLabel fontWeight="600" color="gray.700">Full Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" h="full">
                          <Icon as={FaUser} color="gray.400" />
                        </InputLeftElement>
                        <Input 
                          type="text" 
                          value={regName} 
                          onChange={(e) => setRegName(e.target.value)}
                          size="lg"
                          bg="gray.50"
                          border="2px solid"
                          borderColor="gray.100"
                          borderRadius="xl"
                          _hover={{ borderColor: 'gray.200' }}
                          _focus={{ 
                            borderColor: 'purple.400',
                            bg: 'white',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                          }}
                          placeholder="John Doe"
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl id="register-email" isRequired>
                      <FormLabel fontWeight="600" color="gray.700">Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" h="full">
                          <Icon as={FaEnvelope} color="gray.400" />
                        </InputLeftElement>
                        <Input 
                          type="email" 
                          value={regEmail} 
                          onChange={(e) => setRegEmail(e.target.value)}
                          size="lg"
                          bg="gray.50"
                          border="2px solid"
                          borderColor="gray.100"
                          borderRadius="xl"
                          _hover={{ borderColor: 'gray.200' }}
                          _focus={{ 
                            borderColor: 'purple.400',
                            bg: 'white',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                          }}
                          placeholder="your@email.com"
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl id="register-password" isRequired>
                      <FormLabel fontWeight="600" color="gray.700">Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" h="full">
                          <Icon as={FaLock} color="gray.400" />
                        </InputLeftElement>
                        <Input 
                          type="password" 
                          value={regPassword} 
                          onChange={(e) => setRegPassword(e.target.value)}
                          size="lg"
                          bg="gray.50"
                          border="2px solid"
                          borderColor="gray.100"
                          borderRadius="xl"
                          _hover={{ borderColor: 'gray.200' }}
                          _focus={{ 
                            borderColor: 'purple.400',
                            bg: 'white',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                          }}
                          placeholder="••••••••"
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl id="register-rpassword" isRequired>
                      <FormLabel fontWeight="600" color="gray.700">Confirm Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" h="full">
                          <Icon as={FaShieldAlt} color="gray.400" />
                        </InputLeftElement>
                        <Input 
                          type="password" 
                          value={regRPassword} 
                          onChange={(e) => setRegRPassword(e.target.value)}
                          size="lg"
                          bg="gray.50"
                          border="2px solid"
                          borderColor="gray.100"
                          borderRadius="xl"
                          _hover={{ borderColor: 'gray.200' }}
                          _focus={{ 
                            borderColor: 'purple.400',
                            bg: 'white',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                          }}
                          placeholder="••••••••"
                        />
                      </InputGroup>
                    </FormControl>
                    {regError && (
                      <Alert status="error" borderRadius="xl">
                        <AlertIcon />
                        {regError}
                      </Alert>
                    )}
                    <Checkbox isRequired colorScheme="purple" fontWeight="500" color="gray.600">
                      I agree to the Terms & Privacy Policy
                    </Checkbox>
                    {err === 409 && (
                      <Alert status="error" borderRadius="xl">
                        <AlertIcon />
                        User already exists. Please login instead.
                      </Alert>
                    )}
                    <Button 
                      type="submit" 
                      size="lg"
                      bgGradient="linear(135deg, #0ea5e9 0%, #7c3aed 100%)"
                      color="white"
                      borderRadius="xl"
                      h="56px"
                      fontWeight="700"
                      fontSize="lg"
                      rightIcon={<FaArrowRight />}
                      _hover={{
                        bgGradient: "linear(135deg, #0284c7 0%, #6d28d9 100%)",
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(14, 165, 233, 0.4)'
                      }}
                      _active={{
                        transform: 'translateY(0)',
                      }}
                      transition="all 0.3s"
                    >
                      Create Account
                    </Button>
                  </Stack>
                </form>
              ) : (
                <Alert 
                  status="success" 
                  borderRadius="xl"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  py={8}
                >
                  <AlertIcon boxSize="40px" mr={0} />
                  <Text mt={4} fontSize="lg" fontWeight="600">
                    Account created successfully!
                  </Text>
                  <Text mt={2} color="gray.600">
                    You can now sign in to your account.
                  </Text>
                  <Button 
                    mt={4} 
                    colorScheme="green" 
                    onClick={switchMode}
                  >
                    Go to Login
                  </Button>
                </Alert>
              )
            )}

            {err === 404 && (
              <Alert status="error" mt={4} borderRadius="xl">
                <AlertIcon />
                Incorrect email address
              </Alert>
            )}
            {err === 400 && (
              <Alert status="error" mt={4} borderRadius="xl">
                <AlertIcon />
                Incorrect password
              </Alert>
            )}

            <Text mt={8} textAlign="center" color="gray.600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button 
                variant="link" 
                color="purple.500"
                fontWeight="700"
                onClick={switchMode}
                _hover={{ color: 'purple.600' }}
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </Button>
            </Text>
          </Box>
        </Box>
      </Container>

      {/* Forgot Password Modal */}
      <Modal isOpen={isOpen} onClose={handleForgotClose} isCentered size="md">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl" mx={4}>
          <ModalHeader 
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            borderTopRadius="2xl"
            py={6}
          >
            <VStack spacing={2}>
              <Icon as={forgotStep === 3 ? FaCheckCircle : FaKey} boxSize={8} />
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
                <Text color="gray.600" textAlign="center">
                  Enter your email address and we'll send you a verification code to reset your password.
                </Text>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700">Email Address</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FaEnvelope} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your@email.com"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      border="2px solid"
                      borderColor="gray.100"
                      _focus={{
                        borderColor: 'purple.400',
                        bg: 'white',
                      }}
                    />
                  </InputGroup>
                </FormControl>
                {forgotError && (
                  <Alert status="error" borderRadius="xl">
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
                  rightIcon={<FaArrowRight />}
                  _hover={{
                    bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                  }}
                >
                  Send OTP
                </Button>
              </VStack>
            )}

            {forgotStep === 2 && (
              <VStack spacing={6}>
                <Text color="gray.600" textAlign="center">
                  We've sent a 4-digit code to <strong>{forgotEmail}</strong>
                </Text>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700" textAlign="center">
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
                        _focus={{ borderColor: 'purple.400' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                      <PinInputField
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: 'purple.400' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                      <PinInputField
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: 'purple.400' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                      <PinInputField
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: 'purple.400' }}
                        fontSize="xl"
                        fontWeight="bold"
                      />
                    </PinInput>
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700">New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FaLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      border="2px solid"
                      borderColor="gray.100"
                      _focus={{
                        borderColor: 'purple.400',
                        bg: 'white',
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700">Confirm New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="full">
                      <Icon as={FaShieldAlt} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm password"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      border="2px solid"
                      borderColor="gray.100"
                      _focus={{
                        borderColor: 'purple.400',
                        bg: 'white',
                      }}
                    />
                  </InputGroup>
                </FormControl>
                {forgotError && (
                  <Alert status="error" borderRadius="xl">
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
                    leftIcon={<FaArrowLeft />}
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
                    rightIcon={<FaArrowRight />}
                    _hover={{
                      bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                    }}
                  >
                    Reset Password
                  </Button>
                </HStack>
                <Button
                  variant="link"
                  color="purple.500"
                  onClick={sendResetOTP}
                  isLoading={forgotLoading}
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
                  <Icon as={FaCheckCircle} color="white" boxSize={10} />
                </Box>
                <Text color="gray.700" fontWeight="600" fontSize="lg" textAlign="center">
                  Your password has been reset successfully!
                </Text>
                <Text color="gray.500" textAlign="center">
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
    </Box>
  );
}

export default Login;
