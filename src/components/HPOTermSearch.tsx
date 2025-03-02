import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  Text, 
  Stack, 
  Input, 
  InputGroup, 
  InputLeftElement,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
  Button,
  useColorModeValue,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  HStack,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { Search, Plus, Brain, ArrowRight, Download, Trash2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { 
  searchHPOTerms, 
  addSymptom, 
  clearSearchResults,
  removeSymptom,
  updateSymptom
} from '../store/slices/symptomsSlice';
import { fetchDiagnoses } from '../store/slices/diagnosesSlice';
import { HPOTerm, PatientSymptom } from '../types';

export const HPOTermSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<HPOTerm | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { searchResults, searchStatus, selectedSymptoms } = useSelector(
    (state: RootState) => state.symptoms
  );
  
  const { status: diagnosesStatus } = useSelector(
    (state: RootState) => state.diagnoses
  );

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const tableBgColor = useColorModeValue('white', 'gray.800');
  const tableHeaderBgColor = useColorModeValue('gray.50', 'gray.700');

  // Search for HPO terms when the query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      dispatch(searchHPOTerms(searchQuery));
      setIsDropdownOpen(true);
    } else {
      dispatch(clearSearchResults());
      setIsDropdownOpen(false);
    }
  }, [searchQuery, dispatch]);

  const handleAddSymptom = (term: HPOTerm) => {
    const newSymptom: PatientSymptom = {
      ...term,
      severity: 'Frequent (79-30%)',
      duration: '',
      onset: '',
      dateAdded: new Date().toISOString(),
    };
    
    dispatch(addSymptom(newSymptom));
    setSelectedTerm(null);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };
  
  const handleRemoveSymptom = (id: string) => {
    dispatch(removeSymptom(id));
  };
  
  const handleUpdateSeverity = (symptom: PatientSymptom, severity: 'Excluded (0%)' | 'Occasional (29-5%)' | 'Frequent (79-30%)' | 'Very frequent (99-80%)' | 'Obligate (100%)' | 'Very rare (<4-1%)') => {
    dispatch(updateSymptom({
      id: symptom.id,
      updates: { severity }
    }));
  };
  
  const handleAnalyzeSymptoms = () => {
    if (selectedSymptoms.length > 0) {
      dispatch(fetchDiagnoses(selectedSymptoms));
      
      // Here you would typically call your Python ML code
      // For now, we'll just log the data that would be sent
      console.log("Data for ML analysis:", 
        selectedSymptoms.map(s => ({
          hpo_id: s.id,
          name: s.name,
          frequency: s.severity
        }))
      );
      
      // In a real implementation, you might use a fetch call to your backend:
      // fetch('/api/analyze-gene-phenotypes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ symptoms: selectedSymptoms })
      // })
      // .then(response => response.json())
      // .then(data => console.log('ML results:', data))
      // .catch(error => console.error('Error calling ML service:', error));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Excluded (0%)': return 'gray';
      case 'Very rare (<4-1%)': return 'blue';
      case 'Occasional (29-5%)': return 'green';
      case 'Frequent (79-30%)': return 'yellow';
      case 'Very frequent (99-80%)': return 'orange';
      case 'Obligate (100%)': return 'red';
      default: return 'gray';
    }
  };
  
  // Function to export HPO terms and frequencies for ML processing
  const exportHPOData = () => {
    if (selectedSymptoms.length === 0) return;
    
    // Format data for export
    const data = selectedSymptoms.map(s => ({
      hpo_id: s.id,
      name: s.name,
      frequency: s.severity
    }));
    
    // Create a JSON string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hpo_symptoms.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={4} bg={bgColor} borderRadius="lg" boxShadow="md" mb={4}>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="md">
          Search Symptoms (HPO Terms)
        </Heading>
        
        <HStack spacing={2}>
          {selectedSymptoms.length > 0 && (
            <Tooltip label="Export HPO data for ML processing">
              <IconButton
                aria-label="Export data"
                icon={<Download size={16} />}
                size="sm"
                onClick={exportHPOData}
              />
            </Tooltip>
          )}
          <Button
            as={RouterLink}
            to="/diagnoses"
            colorScheme="blue"
            size="sm"
            rightIcon={<ArrowRight size={16} />}
            isDisabled={selectedSymptoms.length === 0}
          >
            View Diagnoses
          </Button>
        </HStack>
      </Flex>
      
      <Box position="relative" mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search className="h-5 w-5 text-gray-400" />
          </InputLeftElement>
          <Input
            placeholder="Type to search (e.g., headache, seizure, macrocephaly)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="md"
          />
        </InputGroup>
        
        {isDropdownOpen && searchResults.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            maxH="300px"
            overflowY="auto"
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            zIndex={10}
            boxShadow="md"
          >
            {searchStatus === 'loading' ? (
              <Flex justify="center" align="center" p={4}>
                <Spinner size="sm" mr={2} />
                <Text>Searching...</Text>
              </Flex>
            ) : (
              <Stack spacing={0}>
                {searchResults.map((term) => (
                  <Box
                    key={term.id}
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: hoverBgColor }}
                    onClick={() => handleAddSymptom(term)}
                    borderBottomWidth="1px"
                    borderBottomColor={borderColor}
                  >
                    <Flex align="center" justify="space-between">
                      <Box>
                        <Text fontWeight="medium">{term.name}</Text>
                        <Text fontSize="xs" color="gray.500">{term.id}</Text>
                      </Box>
                      <Plus className="h-4 w-4" />
                    </Flex>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>

      {selectedSymptoms.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple" size="sm" bg={tableBgColor} borderRadius="md" overflow="hidden">
            <Thead bg={tableHeaderBgColor}>
              <Tr>
                <Th>HPO Term</Th>
                <Th>ID</Th>
                <Th>Frequency</Th>
                <Th width="50px"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedSymptoms.map((symptom) => (
                <Tr key={symptom.id}>
                  <Td fontWeight="medium">{symptom.name}</Td>
                  <Td fontSize="sm" color="gray.500">{symptom.id}</Td>
                  <Td>
                    <Select 
                      size="xs" 
                      value={symptom.severity}
                      onChange={(e) => handleUpdateSeverity(
                        symptom, 
                        e.target.value as 'Excluded (0%)' | 'Occasional (29-5%)' | 'Frequent (79-30%)' | 'Very frequent (99-80%)' | 'Obligate (100%)' | 'Very rare (<4-1%)'
                      )}
                      width="180px"
                      bg={`${getSeverityColor(symptom.severity)}.50`}
                      borderColor={`${getSeverityColor(symptom.severity)}.200`}
                    >
                      <option value="Excluded (0%)">Excluded (0%)</option>
                      <option value="Very rare (<4-1%)">Very rare (&lt;4-1%)</option>
                      <option value="Occasional (29-5%)">Occasional (29-5%)</option>
                      <option value="Frequent (79-30%)">Frequent (79-30%)</option>
                      <option value="Very frequent (99-80%)">Very frequent (99-80%)</option>
                      <option value="Obligate (100%)">Obligate (100%)</option>
                    </Select>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Remove symptom"
                      icon={<Trash2 size={14} />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveSymptom(symptom.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          <Flex justify="space-between" mt={4}>
            <Text fontSize="sm" color="gray.500">
              {selectedSymptoms.length} HPO term{selectedSymptoms.length !== 1 ? 's' : ''} selected
            </Text>
            
            <Button
              onClick={handleAnalyzeSymptoms}
              colorScheme="blue"
              size="md"
              leftIcon={<Brain size={16} />}
              isLoading={diagnosesStatus === 'loading'}
              loadingText="Analyzing"
            >
              Analyze Symptoms
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box p={6} borderWidth="1px" borderStyle="dashed" borderRadius="md" borderColor={borderColor} textAlign="center">
          <Text color="gray.500">
            No symptoms selected. Search and add HPO terms above.
          </Text>
        </Box>
      )}
    </Box>
  );
};