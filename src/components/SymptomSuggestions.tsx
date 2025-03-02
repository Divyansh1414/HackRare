import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Flex,
  Tag,
  TagLabel,
  Button,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { addSymptom } from '../store/slices/symptomsSlice';
import { PatientSymptom } from '../types';

export const SymptomSuggestions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { relatedDisorders, selectedSymptoms } = useSelector(
    (state: RootState) => state.symptoms
  );
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Get all HPO terms from the mock data
  const allHpoTerms = [
    { id: 'HP:0001250', name: 'Seizure' },
    { id: 'HP:0002315', name: 'Headache' },
    { id: 'HP:0001251', name: 'Ataxia' },
    { id: 'HP:0002094', name: 'Dyspnea' },
    { id: 'HP:0001945', name: 'Fever' },
    { id: 'HP:0000256', name: 'Macrocephaly' },
    { id: 'HP:0001249', name: 'Intellectual disability' },
    { id: 'HP:0001257', name: 'Spasticity' },
    { id: 'HP:0001274', name: 'Agenesis of corpus callosum' },
    { id: 'HP:0001347', name: 'Hyperreflexia' },
    { id: 'HP:0002060', name: 'Megalencephaly' },
    { id: 'HP:0001508', name: 'Failure to thrive' },
    { id: 'HP:0002007', name: 'Frontal bossing' },
    { id: 'HP:0002018', name: 'Nausea and vomiting' },
    { id: 'HP:0002167', name: 'Abnormality of speech or vocalization' },
    { id: 'HP:0002169', name: 'Clonus' },
    { id: 'HP:0002353', name: 'EEG abnormality' },
    { id: 'HP:0002360', name: 'Sleep abnormality' },
    { id: 'HP:0002650', name: 'Scoliosis' },
    { id: 'HP:0002460', name: 'Abnormal pyramidal sign' },
    { id: 'HP:0000154', name: 'Large face' },
    { id: 'HP:0000496', name: 'Abnormality of eye movement' },
    { id: 'HP:0000508', name: 'Ptosis' },
    { id: 'HP:0000639', name: 'Nystagmus' },
  ];
  
  // Get suggested symptoms based on related disorders
  const getSuggestedSymptoms = () => {
    if (relatedDisorders.length === 0 || selectedSymptoms.length === 0) {
      return [];
    }
    
    // Get all unmatched symptoms from related disorders
    const unmatchedSymptomIds = relatedDisorders
      .flatMap(disorder => disorder.unmatchedSymptoms)
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    // Get the selected symptom IDs
    const selectedSymptomIds = selectedSymptoms.map(s => s.id);
    
    // Filter out symptoms that are already selected
    const suggestedSymptomIds = unmatchedSymptomIds
      .filter(id => !selectedSymptomIds.includes(id));
    
    // Map IDs to full HPO terms
    return suggestedSymptomIds
      .map(id => allHpoTerms.find(term => term.id === id))
      .filter(term => term !== undefined);
  };
  
  const suggestedSymptoms = getSuggestedSymptoms();
  
  if (suggestedSymptoms.length === 0) {
    return null;
  }
  
  const handleAddSymptom = (term: any) => {
    const newSymptom: PatientSymptom = {
      ...term,
      severity: 'Frequent (79-30%)',
      duration: '',
      onset: '',
      dateAdded: new Date().toISOString(),
    };
    
    dispatch(addSymptom(newSymptom));
  };
  
  return (
    <Box 
      p={4} 
      bg={bgColor} 
      borderRadius="lg" 
      boxShadow="md" 
      borderWidth="1px"
      borderColor={borderColor}
      mb={6}
    >
      <Heading size="md" mb={3}>Suggested Additional Symptoms</Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>
        Based on your current selections, you might want to consider these additional symptoms that commonly occur together:
      </Text>
      
      <Wrap spacing={2}>
        {suggestedSymptoms.map((symptom) => (
          <WrapItem key={symptom?.id}>
            <Tag
              size="md"
              borderRadius="full"
              variant="outline"
              colorScheme="purple"
              cursor="pointer"
              onClick={() => handleAddSymptom(symptom)}
              _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
              transition="all 0.2s"
            >
              <TagLabel>{symptom?.name}</TagLabel>
              <Box ml={1} display="inline-flex">
                <Plus size={14} />
              </Box>
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};