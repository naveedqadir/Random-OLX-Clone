import React from "react";
import { categories } from "../common/Catagories";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Text,
  Container,
  SimpleGrid,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { FaThLarge, FaChevronRight } from "react-icons/fa";

export default function CatNavbar() {
  return (
    <Box 
      bg="linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)" 
      borderBottom="1px" 
      borderColor="rgba(0,0,0,0.05)" 
      position="sticky" 
      top={{ base: "70px", md: "80px" }} 
      zIndex="900"
      backdropFilter="blur(20px)"
      boxShadow="0 4px 20px rgba(0,0,0,0.03)"
    >
      <Container maxW="container.xl" px={{ base: 3, md: 4 }}>
        <Flex align="center" h={{ base: "50px", md: "56px" }} justify={{ base: "center", md: "flex-start" }}>
          <Menu isLazy>
            <MenuButton 
              as={Button} 
              rightIcon={<ChevronDownIcon color="white" />} 
              size={{ base: "sm", md: "md" }}
              mr={{ base: 0, md: 6 }}
              fontWeight="700"
              fontSize={{ base: "xs", md: "sm" }}
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              leftIcon={<Icon as={FaThLarge} color="white" boxSize={{ base: 3, md: 4 }} />}
              _hover={{ 
                bgGradient: 'linear(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(102,126,234,0.35)'
              }}
              _active={{ 
                bgGradient: 'linear(135deg, #4c51bf 0%, #553c9a 100%)',
                transform: 'translateY(0)'
              }}
              px={{ base: 3, md: 5 }}
              py={{ base: 4, md: 5 }}
              borderRadius="xl"
              boxShadow="0 4px 15px rgba(102,126,234,0.25)"
              transition="all 0.2s ease"
            >
              <Text display={{ base: "none", sm: "inline" }}>ALL CATEGORIES</Text>
              <Text display={{ base: "inline", sm: "none" }}>BROWSE</Text>
            </MenuButton>
            <MenuList 
              p={{ base: 3, md: 6 }}
              minW={{ base: "calc(100vw - 24px)", sm: "calc(100vw - 40px)", md: "900px" }} 
              maxW={{ base: "calc(100vw - 24px)", sm: "calc(100vw - 40px)", md: "900px" }}
              maxH={{ base: "60vh", md: "70vh" }} 
              overflowY="auto" 
              zIndex={1000} 
              shadow="0 25px 50px -12px rgba(0, 0, 0, 0.2)"
              borderRadius={{ base: "xl", md: "2xl" }}
              border="1px solid"
              borderColor="rgba(0,0,0,0.08)"
              bg="white"
              mt={2}
              mx="auto"
              left={{ base: "50%", md: "auto" }}
              transform={{ base: "translateX(-50%)", md: "none" }}
              sx={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(102,126,234,0.3)', borderRadius: '10px' },
              }}
            >
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 3, sm: 4, md: 8 }}>
                {categories.map((category, index) => (
                  <Box key={index} p={{ base: 2, md: 0 }} bg={{ base: "gray.50", md: "transparent" }} borderRadius="xl">
                    <Link to={`/${category.title}`}>
                      <HStack 
                        spacing={2} 
                        mb={{ base: 2, md: 4 }}
                        p={2}
                        mx={-2}
                        borderRadius="lg"
                        transition="all 0.2s"
                        _hover={{ bg: "purple.50" }}
                      >
                        <Box
                          w={{ base: 8, md: 10 }}
                          h={{ base: 8, md: 10 }}
                          borderRadius="xl"
                          bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FaThLarge} color="white" boxSize={{ base: 3, md: 4 }} />
                        </Box>
                        <Text 
                          fontWeight="700" 
                          fontSize={{ base: "sm", md: "sm" }}
                          color="gray.800"
                        >
                          {category.title}
                        </Text>
                      </HStack>
                    </Link>
                    <Box display="flex" flexDirection="column" gap={{ base: 1, md: 2 }} pl={2}>
                      {category.items.map((subCategory, subIndex) => (
                        <Link key={`${index}-${subIndex}`} to={`/${subCategory}`}>
                          <HStack
                            spacing={2}
                            py={{ base: 1, md: 1.5 }}
                            px={2}
                            mx={-2}
                            borderRadius="md"
                            transition="all 0.2s"
                            _hover={{ 
                              bg: { base: "white", md: "gray.50" },
                              transform: "translateX(4px)"
                            }}
                          >
                            <Icon as={FaChevronRight} boxSize={2} color="gray.300" />
                            <Text 
                              fontSize={{ base: "xs", md: "sm" }}
                              color="gray.600"
                              _hover={{ color: "purple.600" }}
                            >
                              {subCategory}
                            </Text>
                          </HStack>
                        </Link>
                      ))}
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </MenuList>
          </Menu>

          <HStack 
            spacing={1} 
            overflowX="auto" 
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }} 
            w="full"
            display={{ base: "none", md: "flex" }}
          >
            {categories.map((category, index) => (
              <Link key={index} to={`/${category.title}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  fontWeight="600"
                  fontSize="sm"
                  color="gray.600"
                  px={4}
                  borderRadius="full"
                  whiteSpace="nowrap"
                  _hover={{ 
                    color: "purple.600", 
                    bg: "purple.50"
                  }}
                  transition="all 0.2s"
                >
                  {category.title}
                </Button>
              </Link>
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
