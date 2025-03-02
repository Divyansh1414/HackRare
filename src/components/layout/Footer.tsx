import React from 'react';
import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { Brain, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderTopWidth={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      mt="auto"
    >
      <Container
        as={Stack}
        maxW="6xl"
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack direction="row" alignItems="center">
          <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <Text fontWeight="bold">PhenoWise</Text>
        </Stack>
        
        <Text>
          Made with <Heart className="inline h-4 w-4 text-red-500" /> for healthcare professionals
        </Text>
        
        <Stack direction="row" spacing={6}>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Contact</Link>
        </Stack>
      </Container>
    </Box>
  );
};