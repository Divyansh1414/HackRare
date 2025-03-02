import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Heading, Text, Button, useColorModeValue, Flex } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { DiagnosisVisualization } from '../components/DiagnosisVisualization';
import { RootState } from '../store';

export const DiagnosesPage: React.FC = () => {
  const { diagnoses } = useSelector((state: RootState) => state.diagnoses);
  
  return (
    <Box>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        mb={6}
      >
        <Box>
          <Heading size="lg" mb={2}>Diagnosis Results</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Visualize and explore potential diagnoses based on symptoms
          </Text>
        </Box>
        
        <Button
          as={RouterLink}
          to="/symptoms"
          leftIcon={<ArrowLeft size={16} />}
          variant="outline"
          mt={{ base: 4, md: 0 }}
        >
          Back to Symptoms
        </Button>
      </Flex>
      
      <DiagnosisVisualization />
    </Box>
  );
};