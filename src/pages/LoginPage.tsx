import React from 'react';
import { Flex, Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <Flex
      minH="calc(100vh - 160px)"
      align="center"
      justify="center"
      direction="column"
      p={4}
    >
      <Box textAlign="center" mb={8}>
        <Heading
          as="h1"
          size="xl"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
          mb={2}
        >
          Welcome Back
        </Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')}>
          Sign in to access your medical diagnosis tools
        </Text>
      </Box>
      
      <LoginForm />
    </Flex>
  );
};