import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Image,
  useColorModeValue,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { Brain, Search, FileText, Activity, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      title: 'Symptom Search',
      description: 'Search for symptoms using HPO terms with our comprehensive database.',
      icon: Search,
    },
    {
      title: 'Differential Diagnosis',
      description: 'Get potential diagnoses based on reported symptoms and their severity.',
      icon: Brain,
    },
    {
      title: 'Visual Analysis',
      description: 'Visualize relationships between symptoms and potential diagnoses.',
      icon: Activity,
    },
    {
      title: 'Report Upload',
      description: 'Upload medical reports for automated analysis and interpretation.',
      icon: FileText,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="container.xl" pt={10} pb={20}>
        <Flex
          align="center"
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 8, md: 12 }}
        >
          <Box flex="1">
            <Heading
              as="h1"
              size="2xl"
              fontWeight="bold"
              lineHeight="1.2"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              Medical Differential Diagnosis Made Simple
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')} mb={8}>
              A powerful tool for healthcare professionals to analyze symptoms, 
              identify potential diagnoses, and visualize medical relationships.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="blue"
                rightIcon={<ArrowRight size={18} />}
              >
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                variant="outline"
              >
                Sign In
              </Button>
            </Stack>
          </Box>
          <Flex flex="1" justify="center">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Medical professional using a tablet"
              borderRadius="xl"
              shadow="2xl"
              maxW="500px"
              w="100%"
            />
          </Flex>
        </Flex>
      </Container>

      {/* Features Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="xl"
            textAlign="center"
            mb={16}
          >
            Powerful Features for Medical Professionals
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            {features.map((feature, index) => (
              <Box
                key={index}
                bg={useColorModeValue('white', 'gray.800')}
                p={8}
                borderRadius="lg"
                shadow="md"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-5px)',
                  shadow: 'lg',
                }}
              >
                <Flex
                  w={12}
                  h={12}
                  align="center"
                  justify="center"
                  color="white"
                  rounded="full"
                  bg="blue.500"
                  mb={4}
                >
                  <Icon as={feature.icon} boxSize={6} />
                </Flex>
                <Heading as="h3" size="md" mb={3}>
                  {feature.title}
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.300')}>
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20}>
        <Container maxW="container.lg">
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            bg={useColorModeValue('blue.50', 'blue.900')}
            p={10}
            borderRadius="xl"
            shadow="xl"
          >
            <Heading as="h2" size="xl" mb={4}>
              Ready to Improve Your Diagnostic Process?
            </Heading>
            <Text fontSize="lg" maxW="2xl" mb={8} color={useColorModeValue('gray.600', 'gray.300')}>
              Join thousands of healthcare professionals who use our platform to make faster,
              more accurate diagnoses and provide better patient care.
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="blue"
              px={8}
            >
              Create Free Account
            </Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};