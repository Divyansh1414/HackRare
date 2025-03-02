import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Stack,
  Progress,
  Badge,
  Flex,
  Spinner,
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  Tooltip,
  Link,
} from '@chakra-ui/react';
import { AlertTriangle, Brain, ExternalLink, Info } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { getRelatedDisorders } from '../store/slices/symptomsSlice';

export const DisorderRecommendations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSymptoms, relatedDisorders, disordersStatus } = useSelector(
    (state: RootState) => state.symptoms
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      dispatch(getRelatedDisorders(selectedSymptoms));
    }
  }, [selectedSymptoms, dispatch]);
  
  if (disordersStatus === 'loading') {
    return (
      <Box textAlign="center" p={4}>
        <Spinner size="md" color="blue.500" />
        <Text mt={2} fontSize="sm">Analyzing symptoms...</Text>
      </Box>
    );
  }
  
  if (selectedSymptoms.length === 0) {
    return (
      <Box 
        p={4} 
        bg={cardBg} 
        borderRadius="lg" 
        boxShadow="md" 
        borderWidth="1px"
        borderColor={borderColor}
        mb={6}
      >
        <Heading size="md" mb={3}>Potential Disorders</Heading>
        <Text color="gray.500" fontSize="sm">
          Add symptoms to see potential disorder recommendations.
        </Text>
      </Box>
    );
  }
  
  if (relatedDisorders.length === 0) {
    return (
      <Box 
        p={4} 
        bg={cardBg} 
        borderRadius="lg" 
        boxShadow="md" 
        borderWidth="1px"
        borderColor={borderColor}
        mb={6}
      >
        <Heading size="md" mb={3}>Potential Disorders</Heading>
        <Flex align="center" justify="center" direction="column" py={4}>
          <AlertTriangle className="h-6 w-6 text-yellow-500 mb-2" />
          <Text color="gray.500">No related disorders found for the selected symptoms.</Text>
        </Flex>
      </Box>
    );
  }
  
  // Get disorder descriptions
  const disorderDescriptions: Record<string, { description: string, url: string }> = {
    'Epilepsy': {
      description: 'A neurological disorder characterized by recurrent seizures due to abnormal electrical activity in the brain.',
      url: 'https://www.mayoclinic.org/diseases-conditions/epilepsy/symptoms-causes/syc-20350093'
    },
    'Cerebral Palsy': {
      description: 'A group of disorders that affect movement and muscle tone or posture, caused by damage to the developing brain.',
      url: 'https://www.mayoclinic.org/diseases-conditions/cerebral-palsy/symptoms-causes/syc-20353999'
    },
    'Aicardi Syndrome': {
      description: 'A rare genetic disorder characterized by the absence of the corpus callosum, infantile spasms, and abnormal retinal lesions.',
      url: 'https://rarediseases.org/rare-diseases/aicardi-syndrome/'
    },
    'Hydrocephalus': {
      description: 'A buildup of fluid in the cavities deep within the brain, causing increased pressure and potential brain damage.',
      url: 'https://www.mayoclinic.org/diseases-conditions/hydrocephalus/symptoms-causes/syc-20373604'
    },
    'Dandy-Walker Malformation': {
      description: 'A congenital brain malformation involving the cerebellum and the fluid-filled spaces around it.',
      url: 'https://rarediseases.org/rare-diseases/dandy-walker-malformation/'
    },
    'Tuberous Sclerosis': {
      description: 'A rare genetic disease that causes benign tumors to grow in the brain and other organs, often leading to seizures and developmental problems.',
      url: 'https://www.mayoclinic.org/diseases-conditions/tuberous-sclerosis/symptoms-causes/syc-20365969'
    },
    'Migraine': {
      description: 'A neurological condition characterized by recurrent headaches, often with nausea, vomiting, and sensitivity to light and sound.',
      url: 'https://www.mayoclinic.org/diseases-conditions/migraine-headache/symptoms-causes/syc-20360201'
    },
    'Chiari Malformation': {
      description: 'A condition in which brain tissue extends into the spinal canal, causing headaches, neck pain, and other neurological symptoms.',
      url: 'https://www.mayoclinic.org/diseases-conditions/chiari-malformation/symptoms-causes/syc-20354010'
    }
  };
  
  return (
    <Box 
      p={4} 
      bg={cardBg} 
      borderRadius="lg" 
      boxShadow="md" 
      borderWidth="1px"
      borderColor={borderColor}
      mb={6}
    >
      <Heading size="md" mb={4}>Potential Disorders</Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>
        Based on the symptoms you've selected, these disorders may be relevant. The relevance score indicates how closely the symptoms match known patterns.
      </Text>
      
      <Stack spacing={4}>
        {relatedDisorders.map((disorder) => (
          <Card key={disorder.name} variant="outline" size="sm">
            <CardBody>
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center">
                  <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <Heading size="sm">{disorder.name}</Heading>
                  {disorderDescriptions[disorder.name] && (
                    <Tooltip 
                      label={disorderDescriptions[disorder.name].description} 
                      placement="top" 
                      hasArrow
                    >
                      <Box ml={2} cursor="help">
                        <Info size={14} className="text-gray-400" />
                      </Box>
                    </Tooltip>
                  )}
                </Flex>
                <Badge 
                  colorScheme={
                    disorder.relevanceScore > 75 ? "green" : 
                    disorder.relevanceScore > 50 ? "yellow" : 
                    disorder.relevanceScore > 25 ? "orange" : "red"
                  }
                >
                  {disorder.relevanceScore}% match
                </Badge>
              </Flex>
              
              <Progress 
                value={disorder.relevanceScore} 
                colorScheme={
                  disorder.relevanceScore > 75 ? "green" : 
                  disorder.relevanceScore > 50 ? "yellow" : 
                  disorder.relevanceScore > 25 ? "orange" : "red"
                }
                size="sm"
                borderRadius="full"
                mb={2}
              />
              
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray.500">
                  Matched {disorder.matchedSymptomCount} of {disorder.totalSymptomCount} typical symptoms
                </Text>
                {disorderDescriptions[disorder.name] && (
                  <Link 
                    href={disorderDescriptions[disorder.name].url} 
                    isExternal 
                    fontSize="xs" 
                    color="blue.500"
                    display="flex"
                    alignItems="center"
                  >
                    Learn more <ExternalLink size={10} className="ml-1" />
                  </Link>
                )}
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};