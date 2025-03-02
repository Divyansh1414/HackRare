import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Background } from '../Background';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Background />
      <Navbar />
      <Box flex="1" width="100%" maxW="1200px" mx="auto" px={4} py={6}>
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};