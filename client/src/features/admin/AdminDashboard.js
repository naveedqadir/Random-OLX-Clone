import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Flex,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Progress,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiPackage,
  FiMessageSquare,
  FiTrendingUp,
  FiSearch,
  FiTrash2,
  FiShield,
  FiCheck,
  FiMoreVertical,
  FiRefreshCw,
  FiDollarSign,
  FiCalendar,
  FiBarChart2,
  FiEye,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import { getAvatarProps, getSafeImageUrl } from '../../utils/imageUtils';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [productPagination, setProductPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const authToken = localStorage.getItem('authToken');

  const cardBg = useColorModeValue('white', 'gray.800');
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    window.scrollTo(0, 0);
    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/check`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data.isAdmin) {
        setIsAdmin(true);
        fetchAllData();
      }
    } catch (error) {
      console.error('Not authorized:', error);
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges',
        status: 'error',
        duration: 3000,
      });
      navigate('/');
    }
  };

  const fetchAllData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchStats(),
      fetchUsers(1),
      fetchProducts(1),
      fetchCategories()
    ]);
    setLoading(false);
    setRefreshing(false);
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUsers = async (page = 1, search = userSearch) => {
    try {
      const response = await axios.get(
        `${backendUrl}/admin/users?page=${page}&limit=10&search=${search}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setUsers(response.data.users);
      setUserPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchProducts = async (page = 1, search = productSearch, category = categoryFilter) => {
    try {
      const response = await axios.get(
        `${backendUrl}/admin/products?page=${page}&limit=10&search=${search}&category=${category}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProducts(response.data.products);
      setProductPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/categories`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${backendUrl}/admin/users/${deleteItem._id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast({
        title: 'User Deleted',
        description: 'User and their products have been removed',
        status: 'success',
        duration: 3000,
      });
      fetchUsers(userPagination.page);
      fetchStats();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete user',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${backendUrl}/admin/products/${deleteItem._id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast({
        title: 'Product Deleted',
        description: 'Product has been removed',
        status: 'success',
        duration: 3000,
      });
      fetchProducts(productPagination.page);
      fetchStats();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete product',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/admin/users/${userId}/toggle-admin`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 3000,
      });
      fetchUsers(userPagination.page);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleToggleVerified = async (userId) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/admin/users/${userId}/toggle-verified`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 3000,
      });
      fetchUsers(userPagination.page);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Box minH="100vh" bg={pageBg} py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="xl" color="gray.800">Admin Dashboard</Heading>
            <Text color="gray.600" mt={1}>Manage users, products, and view analytics</Text>
          </Box>
          <Button
            leftIcon={<FiRefreshCw />}
            colorScheme="pink"
            onClick={fetchAllData}
            isLoading={refreshing}
          >
            Refresh
          </Button>
        </Flex>

        {/* Stats Overview */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardBody>
              <Flex justify="space-between" align="flex-start">
                <Stat>
                  <StatLabel color="gray.500">Total Users</StatLabel>
                  <StatNumber fontSize="3xl" color="blue.500">{stats?.overview?.totalUsers || 0}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats?.overview?.newUsersThisMonth || 0} this month
                  </StatHelpText>
                </Stat>
                <Box p={3} bg="blue.50" borderRadius="lg">
                  <Icon as={FiUsers} boxSize={6} color="blue.500" />
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardBody>
              <Flex justify="space-between" align="flex-start">
                <Stat>
                  <StatLabel color="gray.500">Total Products</StatLabel>
                  <StatNumber fontSize="3xl" color="green.500">{stats?.overview?.totalProducts || 0}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats?.overview?.newProductsThisMonth || 0} this month
                  </StatHelpText>
                </Stat>
                <Box p={3} bg="green.50" borderRadius="lg">
                  <Icon as={FiPackage} boxSize={6} color="green.500" />
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardBody>
              <Flex justify="space-between" align="flex-start">
                <Stat>
                  <StatLabel color="gray.500">Total Messages</StatLabel>
                  <StatNumber fontSize="3xl" color="purple.500">{stats?.overview?.totalMessages || 0}</StatNumber>
                  <StatHelpText>Chat conversations</StatHelpText>
                </Stat>
                <Box p={3} bg="purple.50" borderRadius="lg">
                  <Icon as={FiMessageSquare} boxSize={6} color="purple.500" />
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardBody>
              <Flex justify="space-between" align="flex-start">
                <Stat>
                  <StatLabel color="gray.500">Verification Rate</StatLabel>
                  <StatNumber fontSize="3xl" color="orange.500">{stats?.overview?.verificationRate || 0}%</StatNumber>
                  <StatHelpText>{stats?.overview?.verifiedUsers || 0} verified users</StatHelpText>
                </Stat>
                <Box p={3} bg="orange.50" borderRadius="lg">
                  <Icon as={FiCheck} boxSize={6} color="orange.500" />
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </Grid>

        {/* Price Stats & Top Categories */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mb={8}>
          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardHeader>
              <HStack>
                <Icon as={FiDollarSign} color="pink.500" />
                <Heading size="md">Price Statistics</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text color="gray.500" fontSize="sm">Average Price</Text>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {formatPrice(stats?.priceStats?.avgPrice || 0)}
                  </Text>
                </Box>
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text color="gray.500" fontSize="sm">Total Listings Value</Text>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {formatPrice(stats?.priceStats?.totalValue || 0)}
                  </Text>
                </Box>
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text color="gray.500" fontSize="sm">Highest Price</Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.500">
                    {formatPrice(stats?.priceStats?.maxPrice || 0)}
                  </Text>
                </Box>
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text color="gray.500" fontSize="sm">Lowest Price</Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.500">
                    {formatPrice(stats?.priceStats?.minPrice || 0)}
                  </Text>
                </Box>
              </Grid>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardHeader>
              <HStack>
                <Icon as={FiBarChart2} color="pink.500" />
                <Heading size="md">Products by Category</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {stats?.productsByCategory?.slice(0, 5).map((cat, index) => (
                  <Box key={cat._id || index}>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm" fontWeight="medium">{cat._id || 'Uncategorized'}</Text>
                      <Text fontSize="sm" color="gray.500">{cat.count} products</Text>
                    </Flex>
                    <Progress
                      value={(cat.count / (stats?.overview?.totalProducts || 1)) * 100}
                      size="sm"
                      colorScheme="pink"
                      borderRadius="full"
                    />
                  </Box>
                ))}
                {(!stats?.productsByCategory || stats.productsByCategory.length === 0) && (
                  <Text color="gray.500" textAlign="center">No products yet</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Top Sellers & Recent Activity */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mb={8}>
          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardHeader>
              <HStack>
                <Icon as={FiTrendingUp} color="pink.500" />
                <Heading size="md">Top Sellers</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {stats?.topSellers?.map((seller, index) => (
                  <Flex key={seller._id} justify="space-between" align="center" p={3} bg="gray.50" borderRadius="lg">
                    <HStack>
                      <Badge colorScheme="pink" borderRadius="full" px={2}>#{index + 1}</Badge>
                      <Box>
                        <Text fontWeight="medium">{seller.owner || 'Unknown'}</Text>
                        <Text fontSize="xs" color="gray.500">{seller._id}</Text>
                      </Box>
                    </HStack>
                    <Badge colorScheme="green">{seller.productCount} products</Badge>
                  </Flex>
                ))}
                {(!stats?.topSellers || stats.topSellers.length === 0) && (
                  <Text color="gray.500" textAlign="center">No sellers yet</Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="sm" borderRadius="xl">
            <CardHeader>
              <HStack>
                <Icon as={FiCalendar} color="pink.500" />
                <Heading size="md">Recent Users</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {stats?.recentUsers?.map((user) => (
                  <Flex key={user._id} justify="space-between" align="center" p={3} bg="gray.50" borderRadius="lg">
                    <HStack>
                      <Avatar size="sm" {...getAvatarProps(user)} />
                      <Box>
                        <Text fontWeight="medium">{user.name || 'No name'}</Text>
                        <Text fontSize="xs" color="gray.500">{user.email}</Text>
                      </Box>
                    </HStack>
                    <VStack spacing={0} align="end">
                      <Badge colorScheme={user.isEmailVerified ? 'green' : 'gray'} fontSize="xs">
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                      <Text fontSize="xs" color="gray.400">{formatDate(user.createdAt)}</Text>
                    </VStack>
                  </Flex>
                ))}
                {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                  <Text color="gray.500" textAlign="center">No users yet</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Tabs for Users & Products Management */}
        <Card bg={cardBg} shadow="sm" borderRadius="xl">
          <Tabs colorScheme="pink" isLazy>
            <TabList px={6} pt={4}>
              <Tab><HStack><Icon as={FiUsers} /><Text>Users</Text></HStack></Tab>
              <Tab><HStack><Icon as={FiPackage} /><Text>Products</Text></HStack></Tab>
            </TabList>

            <TabPanels>
              {/* Users Tab */}
              <TabPanel>
                <HStack mb={4}>
                  <InputGroup maxW="300px">
                    <InputLeftElement>
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && fetchUsers(1, userSearch)}
                    />
                  </InputGroup>
                  <Button colorScheme="pink" onClick={() => fetchUsers(1, userSearch)}>Search</Button>
                </HStack>

                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th>Email</Th>
                        <Th>Products</Th>
                        <Th>Status</Th>
                        <Th>Joined</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <Tr key={user._id}>
                          <Td>
                            <HStack>
                              <Avatar size="sm" {...getAvatarProps(user)} />
                              <Text fontWeight="medium">{user.name || 'No name'}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{user.email}</Text>
                          </Td>
                          <Td>
                            <Badge colorScheme="blue">{user.productCount || 0}</Badge>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <Badge colorScheme={user.isEmailVerified ? 'green' : 'gray'}>
                                {user.isEmailVerified ? 'Verified' : 'Unverified'}
                              </Badge>
                              {user.isAdmin && <Badge colorScheme="purple">Admin</Badge>}
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{formatDate(user.createdAt)}</Text>
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem
                                  icon={<FiShield />}
                                  onClick={() => handleToggleAdmin(user._id)}
                                >
                                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                </MenuItem>
                                <MenuItem
                                  icon={<FiCheck />}
                                  onClick={() => handleToggleVerified(user._id)}
                                >
                                  {user.isEmailVerified ? 'Unverify Email' : 'Verify Email'}
                                </MenuItem>
                                <MenuItem
                                  icon={<FiTrash2 />}
                                  color="red.500"
                                  onClick={() => {
                                    setDeleteItem({ ...user, type: 'user' });
                                    onOpen();
                                  }}
                                  isDisabled={user.isAdmin}
                                >
                                  Delete User
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                {/* User Pagination */}
                <Flex justify="space-between" align="center" mt={4}>
                  <Text color="gray.500" fontSize="sm">
                    Showing {((userPagination.page - 1) * 10) + 1}-{Math.min(userPagination.page * 10, userPagination.total)} of {userPagination.total} users
                  </Text>
                  <ButtonGroup size="sm">
                    <Button
                      onClick={() => fetchUsers(userPagination.page - 1)}
                      isDisabled={userPagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <Button variant="ghost" cursor="default">
                      {userPagination.page} / {userPagination.pages}
                    </Button>
                    <Button
                      onClick={() => fetchUsers(userPagination.page + 1)}
                      isDisabled={userPagination.page >= userPagination.pages}
                    >
                      Next
                    </Button>
                  </ButtonGroup>
                </Flex>
              </TabPanel>

              {/* Products Tab */}
              <TabPanel>
                <HStack mb={4} flexWrap="wrap" gap={2}>
                  <InputGroup maxW="300px">
                    <InputLeftElement>
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && fetchProducts(1, productSearch, categoryFilter)}
                    />
                  </InputGroup>
                  <Select
                    maxW="200px"
                    placeholder="All Categories"
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      fetchProducts(1, productSearch, e.target.value);
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                  <Button colorScheme="pink" onClick={() => fetchProducts(1, productSearch, categoryFilter)}>Search</Button>
                </HStack>

                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Product</Th>
                        <Th>Category</Th>
                        <Th>Price</Th>
                        <Th>Seller</Th>
                        <Th>Created</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {products.map((product) => (
                        <Tr key={product._id}>
                          <Td>
                            <HStack>
                              <Box
                                w="40px"
                                h="40px"
                                borderRadius="md"
                                overflow="hidden"
                                bg="gray.100"
                              >
                                <img
                                  src={getSafeImageUrl(product.productpic1)}
                                  alt={product.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                                />
                              </Box>
                              <Text fontWeight="medium" noOfLines={1} maxW="200px">
                                {product.title}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge colorScheme="blue">{product.catagory}</Badge>
                          </Td>
                          <Td>
                            <Text fontWeight="semibold" color="green.500">
                              {formatPrice(product.price)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{product.owner}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{formatDate(product.createdAt)}</Text>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <Tooltip label="View Product">
                                <IconButton
                                  as={Link}
                                  to={`/preview_ad/${product._id}`}
                                  icon={<FiEye />}
                                  size="sm"
                                  variant="ghost"
                                  aria-label="View"
                                />
                              </Tooltip>
                              <Tooltip label="Delete Product">
                                <IconButton
                                  icon={<FiTrash2 />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  aria-label="Delete"
                                  onClick={() => {
                                    setDeleteItem({ ...product, type: 'product' });
                                    onOpen();
                                  }}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                {/* Product Pagination */}
                <Flex justify="space-between" align="center" mt={4}>
                  <Text color="gray.500" fontSize="sm">
                    Showing {((productPagination.page - 1) * 10) + 1}-{Math.min(productPagination.page * 10, productPagination.total)} of {productPagination.total} products
                  </Text>
                  <ButtonGroup size="sm">
                    <Button
                      onClick={() => fetchProducts(productPagination.page - 1)}
                      isDisabled={productPagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <Button variant="ghost" cursor="default">
                      {productPagination.page} / {productPagination.pages}
                    </Button>
                    <Button
                      onClick={() => fetchProducts(productPagination.page + 1)}
                      isDisabled={productPagination.page >= productPagination.pages}
                    >
                      Next
                    </Button>
                  </ButtonGroup>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete {deleteItem?.type === 'user' ? 'User' : 'Product'}
              </AlertDialogHeader>

              <AlertDialogBody>
                {deleteItem?.type === 'user' ? (
                  <>
                    Are you sure you want to delete <strong>{deleteItem?.name || deleteItem?.email}</strong>?
                    This will also delete all their products and cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete <strong>{deleteItem?.title}</strong>?
                    This action cannot be undone.
                  </>
                )}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={deleteItem?.type === 'user' ? handleDeleteUser : handleDeleteProduct}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Box>
  );
}
