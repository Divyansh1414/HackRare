import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Flex,
  Button,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Search, FileText, Activity, ArrowRight, Clock } from 'lucide-react';
import { RootState } from '../store';

export const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedSymptoms } = useSelector((state: RootState) => state.symptoms);
  const { diagnoses } = useSelector((state: RootState) => state.diagnoses);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        mb={8}
      >
        <Box>
          <Heading size="lg" mb={2}>
            Welcome, {user?.name || 'User'}
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Here's an overview of your medical diagnosis activities
          </Text>
        </Box>
        <Button
          as={RouterLink}
          to="/symptoms"
          colorScheme="blue"
          mt={{ base: 4, md: 0 }}
          rightIcon={<ArrowRight size={16} />}
        >
          Start New Diagnosis
        </Button>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        <Card bg={cardBg} shadow="md" borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <Flex align="center" mb={2}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="blue.100"
                  color="blue.700"
                  mr={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Search size={18} />
                </Box>
                <StatLabel fontSize="lg">Current Symptoms</StatLabel>
              </Flex>
              <StatNumber>{selectedSymptoms.length}</StatNumber>
              <StatHelpText>Active symptoms for analysis</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} shadow="md" borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <Flex align="center" mb={2}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="purple.100"
                  color="purple.700"
                  mr={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FileText size={18} />
                </Box>
                <StatLabel fontSize="lg">Potential Diagnoses</StatLabel>
              </Flex>
              <StatNumber>{diagnoses.length}</StatNumber>
              <StatHelpText>Based on current symptoms</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} shadow="md" borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <Flex align="center" mb={2}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="green.100"
                  color="green.700"
                  mr={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Clock size={18} />
                </Box>
                <StatLabel fontSize="lg">Recent Activity</StatLabel>
              </Flex>
              <StatNumber>3</StatNumber>
              <StatHelpText>Analyses in the last 7 days</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Card bg={cardBg} shadow="md" borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <Button
                as={RouterLink}
                to="/symptoms"
                variant="outline"
                colorScheme="blue"
                size="lg"
                justifyContent="flex-start"
                leftIcon={<Icon as={Search} boxSize={5} />}
                h="auto"
                py={3}
              >
                Search Symptoms
              </Button>
              <Button
                as={RouterLink}
                to="/diagnoses"
                variant="outline"
                colorScheme="purple"
                size="lg"
                justifyContent="flex-start"
                leftIcon={<Icon as={Activity} boxSize={5} />}
                h="auto"
                py={3}
              >
                View Diagnoses
              </Button>
              <Button
                as={RouterLink}
                to="/upload"
                variant="outline"
                colorScheme="green"
                size="lg"
                justifyContent="flex-start"
                leftIcon={<Icon as={FileText} boxSize={5} />}
                h="auto"
                py={3}
              >
                Upload Report
              </Button>
              <Button
                as={RouterLink}
                to="/history"
                variant="outline"
                colorScheme="gray"
                size="lg"
                justifyContent="flex-start"
                leftIcon={<Icon as={Clock} boxSize={5} />}
                h="auto"
                py={3}
              >
                View History
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} shadow="md" borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Recent Activity</Heading>
            {[1, 2, 3].map((_, index) => (
              <Flex 
                key={index}
                p={3}
                mb={index < 2 ? 2 : 0}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
                align="center"
                justify="space-between"
              >
                <Flex align="center">
                  <Box
                    p={2}
                    borderRadius="full"
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    mr={3}
                  >
                    <Activity size={16} />
                  </Box>
                  <Box>
                    <Text fontWeight="medium">Symptom Analysis</Text>
                    <Text fontSize="sm" color="gray.500">
                      {index === 0 ? 'Today' : index === 1 ? 'Yesterday' : '3 days ago'}
                    </Text>
                  </Box>
                </Flex>
                <Button
                  as={RouterLink}
                  to="/history"
                  size="sm"
                  variant="ghost"
                  rightIcon={<ArrowRight size={14} />}
                >
                  View
                </Button>
              </Flex>
            ))}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};