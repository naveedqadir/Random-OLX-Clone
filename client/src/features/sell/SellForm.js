import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useToast,
  Center,
  Spinner,
  Icon,
  HStack,
  Badge,
  SimpleGrid
} from "@chakra-ui/react";
import Sell from "./Sell";
import MultipleImageUploadComponent from "./multiple-image-upload.component";
import Price from "./Price";
import SelectLocation from "./SelectLocation";
import Details from "./Details";
import Addetails from "./Addetails";
import axios from "axios";
import { categories } from "../../components/common/Catagories";
import NotFound from "../../components/common/NotFound";
import { FiTag, FiEdit3, FiImage, FiSend, FiPlus } from "react-icons/fi";

export default function SellForm() {
  const { category, item } = useParams();
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const isValidCategory = categories.some(
    (cat) => cat.title.toLowerCase() === category.toLowerCase()
  );
  const isValidItem = categories.some((cat) => cat.items.includes(item));

  const [showComponent, setShowComponent] = useState(false);
  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  const [formInputs, setFormInputs] = useState([]);

  const handleAddForm = () => {
    if (formInputs.length < 12) {
      setFormInputs((prevFormInputs) => [
        ...prevFormInputs,
        <MultipleImageUploadComponent
          key={prevFormInputs.length}
          onFileSelect={(file) => handleFileChange(file)}
        />,
      ]);
    }
  };

  const [loading, setLoading] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [price, setPrice] = useState();
  const [location, setLocation] = useState([]);
  const [address, setaddress] = useState([]);
  const [addorloc, setaddorloc] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const toast = useToast();


  const handleFileChange = (file) => {
    setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, file]);
  };
  const handlePriceChange = (price) => {
    setPrice(price);
  };

  const handleAddressChange = ({ location, address, addorloc }) => {
    setLocation(location);
    setaddress(address);
    setaddorloc(addorloc);
  };

  const handleDetailsChange = ({ title, description }) => {
    setTitle(title);
    setDescription(description);
  };


  function handleNameSelect(name) {
    setName(name);
  }
  function handleImageSelect(img) {
   setImage(img);
  }

async function handleFormSubmit(event) {
  event.preventDefault();

  const errors = [];

  // Title validation
  if (!title || title.trim().length === 0) {
    errors.push("Please add a title");
  } else if (title.trim().length < 3) {
    errors.push("Title must be at least 3 characters");
  } else if (title.length > 100) {
    errors.push("Title must be less than 100 characters");
  }

  // Description validation
  if (!description || description.trim().length === 0) {
    errors.push("Please add a description");
  } else if (description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  } else if (description.length > 5000) {
    errors.push("Description is too long");
  }

  // Location validation
  if (((!address || Object.keys(address).length === 0) && addorloc === "address") || 
      ((!location || Object.keys(location).length === 0) && addorloc === "location")) {
    errors.push("Please add address or select current location");
  }

  // Image validation
  if (!uploadedFiles || uploadedFiles.length === 0) {
    errors.push("Please upload at least one product image");
  } else if (uploadedFiles.length > 12) {
    errors.push("Maximum 12 images allowed");
  }

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push("Please add your name");
  }

  // Price validation
  if (!price) {
    errors.push("Please provide a price");
  } else if (isNaN(price) || price <= 0) {
    errors.push("Please enter a valid price");
  } else if (price > 100000000) {
    errors.push("Price cannot exceed ₹10 crore");
  }

  if (errors.length > 0) {
    toast({
      title: "Validation Error",
      description: errors.join(". "),
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  
  setLoading("post");

  try {
    const locationData = addorloc === "address" ? address : location;

    const [imageUrl, picUrls] = await Promise.all([
      image
        ? (async () => {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", cloudinaryUploadPreset);
            const { data } = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
              formData,
              {
                headers: {
                  Accept: "multipart/form-data",
                },
              }
            );
            return data.secure_url;
          })()
        : "",
      uploadedFiles.length > 0
        ? Promise.all(
            uploadedFiles.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", cloudinaryUploadPreset);
              const { data } = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
                formData,
                {
                  headers: {
                    Accept: "multipart/form-data",
                  },
                }
              );
              return data.secure_url;
            })
          )
        : [],
    ]);
    
    const token = localStorage.getItem('authToken');
    await axios.post(`${backendUrl}/add_product`, {
      title: title.trim(),
      description: description.trim(),
      address: locationData,
      price: Number(price),
      uploadedFiles: picUrls,
      image: imageUrl,
      name: name.trim(),
      catagory: category,
      subcatagory: item,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setLoading("redirect");

  } catch (error) {
    setLoading("");
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      toast({
        title: "Please Log In",
        description: error.response?.data?.message || "You need to be logged in to post an ad. Please log in and try again.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }

    const errorMessage = error.response?.data?.errors?.join(". ") || 
                         error.response?.data?.message || 
                         "Failed to post your ad. Please try again.";
    toast({
      title: "Error",
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
}
  return (
    <Box bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" minH="100vh" py={10}>
      {isValidCategory && isValidItem ? (
        <Container maxW="container.lg">
          {loading === "post" ? (
            <Center h="80vh">
              <VStack spacing={6}>
                <Box
                  w={24}
                  h={24}
                  borderRadius="full"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 15px 40px rgba(102,126,234,0.4)"
                >
                  <Spinner size="xl" color="white" thickness="4px" />
                </Box>
                <Text fontSize="lg" fontWeight="600" color="gray.600">Posting your ad...</Text>
              </VStack>
            </Center>
          ) : (
            <Box>
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
                <HStack justify="space-between" position="relative" zIndex={1}>
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Icon as={FiTag} w={8} h={8} color="white" />
                      <Heading color="white" size="xl">Post Your Ad</Heading>
                    </HStack>
                    <HStack>
                      <Badge
                        bg="rgba(255,255,255,0.2)"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        textTransform="capitalize"
                      >
                        {category}
                      </Badge>
                      <Text color="whiteAlpha.800">/</Text>
                      <Badge
                        bg="rgba(16,185,129,0.3)"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                      >
                        {item}
                      </Badge>
                    </HStack>
                  </VStack>
                  <Button
                    variant="ghost"
                    color="white"
                    leftIcon={<FiEdit3 />}
                    onClick={handleClick}
                    _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                    borderRadius="xl"
                  >
                    Change
                  </Button>
                </HStack>
                {showComponent && <Box mt={6}><Sell /></Box>}
              </Box>

              {/* Main Form */}
              <Box
                bg="rgba(255,255,255,0.8)"
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                border="1px solid"
                borderColor="rgba(255,255,255,0.3)"
                boxShadow="0 25px 50px -12px rgba(0,0,0,0.1)"
                overflow="hidden"
              >
                <VStack spacing={0} align="stretch">
                  {/* Details Section */}
                  <Box p={8}>
                    <Details
                      onTitleSelect={(title) =>
                        handleDetailsChange({ title, description })
                      }
                      onDescriptionSelect={(description) =>
                        handleDetailsChange({ title, description })
                      }
                    />
                  </Box>

                  {/* Price Section */}
                  <Box px={8}>
                    <Price
                      onPriceSelect={(price) => handlePriceChange(price)}
                    />
                  </Box>

                  {/* Images Section */}
                  <Box p={8}>
                    <Box
                      bg="rgba(255,255,255,0.6)"
                      backdropFilter="blur(10px)"
                      borderRadius="2xl"
                      p={6}
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.3)"
                      boxShadow="0 10px 40px rgba(0,0,0,0.08)"
                    >
                      <HStack mb={5}>
                        <Icon as={FiImage} w={5} h={5} color="#667eea" />
                        <Text fontWeight="700" fontSize="lg" color="gray.700">Photos</Text>
                        <Badge
                          bg="rgba(102,126,234,0.1)"
                          color="#667eea"
                          borderRadius="full"
                          px={2}
                          fontSize="xs"
                        >
                          {formInputs.length}/12
                        </Badge>
                      </HStack>
                      
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={4}>
                        {formInputs.map((formInput) => formInput)}
                      </SimpleGrid>
                      
                      {formInputs.length < 12 && (
                        <Button
                          onClick={handleAddForm}
                          variant="outline"
                          color="#667eea"
                          borderColor="#667eea"
                          borderRadius="xl"
                          leftIcon={<FiPlus />}
                          _hover={{
                            bg: 'rgba(102,126,234,0.1)'
                          }}
                        >
                          Add Image
                        </Button>
                      )}
                      <Text mt={3} fontSize="xs" color="gray.400">
                        Add up to 12 photos. First photo will be the cover.
                      </Text>
                    </Box>
                  </Box>

                  {/* Location Section */}
                  <Box px={8}>
                    <SelectLocation
                      onlocationSelect={(location) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                      onaddressSelect={(address) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                      setAddOrLoc={(addorloc) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                    />
                  </Box>

                  {/* Your Details Section */}
                  <Box px={8}>
                    <Addetails onNameSelect={handleNameSelect} onImageSelect={handleImageSelect} />
                  </Box>

                  {/* Submit Button */}
                  <Box p={8}>
                    <form onSubmit={handleFormSubmit}>
                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        fontWeight="700"
                        borderRadius="xl"
                        py={8}
                        leftIcon={<FiSend />}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 35px rgba(102,126,234,0.4)"
                        }}
                        transition="all 0.3s ease"
                      >
                        Post Your Ad
                      </Button>
                    </form>
                  </Box>
                </VStack>
              </Box>
            </Box>
          )}
        </Container>
      ) : (
        <NotFound />
      )}
      {loading === "redirect" && navigate('/adsuccess')}
    </Box>
  );
}
