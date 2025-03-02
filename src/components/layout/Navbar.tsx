import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Stack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useColorModeValue,
  IconButton,
  HStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { Brain, Menu as MenuIcon, X, LogOut, User, FileText, Activity, Search } from 'lucide-react';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { ThemeToggle } from '../ThemeToggle';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={2}
      backdropFilter="blur(10px)"
      backgroundColor={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <X /> : <MenuIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          variant="ghost"
        />
        
        <HStack spacing={8} alignItems="center">
          <Flex alignItems="center">
            <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
            <Link
              as={RouterLink}
              to="/"
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              _hover={{ textDecoration: 'none' }}
            >
              PhenoWise
            </Link>
          </Flex>
          
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {isAuthenticated && (
              <>
                <Link as={RouterLink} to="/dashboard" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.100', 'gray.700') }}>
                  Dashboard
                </Link>
                <Link as={RouterLink} to="/symptoms" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.100', 'gray.700') }}>
                  Symptoms
                </Link>
                <Link as={RouterLink} to="/diagnoses" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.100', 'gray.700') }}>
                  Diagnoses
                </Link>
                <Link as={RouterLink} to="/upload" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.100', 'gray.700') }}>
                  Upload Report
                </Link>
              </>
            )}
          </HStack>
        </HStack>
        
        <Flex alignItems="center">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
                ml={4}
              >
                <Avatar
                  size="sm"
                  name={user?.name || 'User'}
                  bg="blue.500"
                />
              </MenuButton>
              <MenuList>
                <MenuItem icon={<User size={16} />}>Profile</MenuItem>
                <MenuItem icon={<FileText size={16} />}>History</MenuItem>
                <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Stack direction="row" spacing={4} ml={4}>
              <Button as={RouterLink} to="/login" variant="ghost">
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="blue"
                display={{ base: 'none', md: 'inline-flex' }}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Flex>
      </Flex>
      
      {/* Mobile menu */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justify="space-between" align="center">
              <Flex align="center">
                <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <Text fontWeight="bold">PhenoWise</Text>
              </Flex>
              <IconButton
                icon={<X size={18} />}
                variant="ghost"
                onClick={onClose}
                aria-label="Close menu"
                size="sm"
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4} mt={4}>
              {isAuthenticated ? (
                <>
                  <Link as={RouterLink} to="/dashboard" w="full" onClick={onClose}>
                    <Flex align="center" p={2} borderRadius="md" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                      <Activity size={18} className="mr-3" />
                      Dashboard
                    </Flex>
                  </Link>
                  <Link as={RouterLink} to="/symptoms" w="full" onClick={onClose}>
                    <Flex align="center" p={2} borderRadius="md" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                      <Search size={18} className="mr-3" />
                      Symptoms
                    </Flex>
                  </Link>
                  <Link as={RouterLink} to="/diagnoses" w="full" onClick={onClose}>
                    <Flex align="center" p={2} borderRadius="md" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                      <FileText size={18} className="mr-3" />
                      Diagnoses
                    </Flex>
                  </Link>
                  <Link as={RouterLink} to="/upload" w="full" onClick={onClose}>
                    <Flex align="center" p={2} borderRadius="md" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                      <Activity size={18} className="mr-3" />
                      Upload Report
                    </Flex>
                  </Link>
                  
                  <Divider />
                  
                  <Link as={RouterLink} to="/profile" w="full" onClick={onClose}>
                    <Flex align="center" p={2} borderRadius="md" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                      <User size={18} className="mr-3" />
                      Profile
                    </Flex>
                  </Link>
                  <Box w="full" onClick={() => { handleLogout(); onClose(); }}>
                    <Flex align="center" p={2} borderRadius="md" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} cursor="pointer">
                      <LogOut size={18} className="mr-3" />
                      Logout
                    </Flex>
                  </Box>
                </>
              ) : (
                <>
                  <Link as={RouterLink} to="/login" w="full" onClick={onClose}>
                    <Button variant="ghost" w="full">Sign In</Button>
                  </Link>
                  <Link as={RouterLink} to="/register" w="full" onClick={onClose}>
                    <Button colorScheme="blue" w="full">Sign Up</Button>
                  </Link>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};