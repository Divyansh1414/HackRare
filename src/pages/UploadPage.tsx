import React, { useState } from 'react';
import hpoTerms from 'C:/Users/dpradhan/Downloads/project-bolt-sb1-raqbfqae (1)/project/hpo_terms.json';
import { 
  Box, 
  Heading, 
  Text, 
  useColorModeValue, 
  Card, 
  CardBody, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Button,
  VStack,
  Spinner,
  Flex,
  Badge,
  HStack,
  useToast,
  Divider
} from '@chakra-ui/react';
import { FileUpload } from '../components/FileUpload';
import { Search, Download, Brain, Upload } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addSymptom } from '../store/slices/symptomsSlice';
import { PatientSymptom } from '../types';

export const UploadPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [clinicalText, setClinicalText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedTerms, setExtractedTerms] = useState<Array<{id: string, name: string}>>([]);
  const [highlightedText, setHighlightedText] = useState('');
  
  const toast = useToast();
  const dispatch = useDispatch();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const highlightBgColor = useColorModeValue('gray.50', 'gray.700');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClinicalText(e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setClinicalText(event.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };
  
  const extractHPOTerms = async () => {
    if (!clinicalText.trim()) {
      toast({
        title: 'No text provided',
        description: 'Please enter clinical notes or upload a file',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    

try {
  // Simulating API delay (remove in production)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Convert clinical text to lowercase for case-insensitive matching
  const textLower = clinicalText.toLowerCase();

  // Extract matching HPO terms from the JSON file dynamically
  const mockExtractedTerms = hpoTerms.filter(term =>
    textLower.includes(term.name.toLowerCase()) // Match based on term name
  );

  setExtractedTerms(mockExtractedTerms);
      
      // Create highlighted text
      let highlightedTextContent = clinicalText;
      mockExtractedTerms.forEach(term => {
        const regex = new RegExp(term.name, 'gi');
        highlightedTextContent = highlightedTextContent.replace(
          regex, 
          `<span class="hpo-highlight" data-hpo-id="${term.id}" style="background-color: rgba(147, 51, 234, 0.2); border-radius: 3px; padding: 0 2px; border: 1px solid rgba(147, 51, 234, 0.4);">${term.name}</span>`
        );
      });
      
      setHighlightedText(highlightedTextContent);
      
      toast({
        title: 'HPO Terms Extracted',
        description: `Found ${mockExtractedTerms.length} HPO terms in the clinical notes`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error extracting HPO terms:', error);
      toast({
        title: 'Extraction Failed',
        description: 'Failed to extract HPO terms from the clinical notes',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addTermToSymptoms = (term: {id: string, name: string}) => {
    const newSymptom: PatientSymptom = {
      ...term,
      severity: 'Frequent (79-30%)',
      duration: '',
      onset: '',
      dateAdded: new Date().toISOString(),
    };
    
    dispatch(addSymptom(newSymptom));
    
    toast({
      title: 'Symptom Added',
      description: `Added ${term.name} to your symptoms list`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  const addAllTermsToSymptoms = () => {
    extractedTerms.forEach(term => {
      const newSymptom: PatientSymptom = {
        ...term,
        severity: 'Frequent (79-30%)',
        duration: '',
        onset: '',
        dateAdded: new Date().toISOString(),
      };
      
      dispatch(addSymptom(newSymptom));
    });
    
    toast({
      title: 'All Symptoms Added',
      description: `Added ${extractedTerms.length} symptoms to your list`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  const downloadExtractedTerms = () => {
    if (extractedTerms.length === 0) return;
    
    const csvContent = [
      'HPO ID,Term Name',
      ...extractedTerms.map(term => `${term.id},${term.name}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted_hpo_terms.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Box mb={6} textAlign="center">
        <Heading size="lg" mb={2}>Upload & Analyze</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} maxW="600px" mx="auto">
          Upload medical reports or clinical notes for automated analysis and HPO term extraction
        </Text>
      </Box>
      
      <Tabs isFitted variant="enclosed" index={activeTab} onChange={setActiveTab}>
        <TabList mb="1em">
          <Tab>Medical Report</Tab>
          <Tab>Clinical Notes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box display="flex" justifyContent="center">
              <FileUpload />
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Card bg={bgColor} shadow="md" borderWidth="1px" borderColor={borderColor} mb={6}>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Tabs variant="soft-rounded" colorScheme="purple" size="sm">
                    <TabList mb="1em">
                      <Tab>Enter Text</Tab>
                      <Tab>Upload File</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        <FormControl>
                          <FormLabel>Clinical Notes</FormLabel>
                          <Textarea
                            value={clinicalText}
                            onChange={handleTextChange}
                            placeholder="Enter clinical notes here..."
                            size="lg"
                            minH="200px"
                            mb={4}
                          />
                        </FormControl>
                      </TabPanel>
                      <TabPanel p={0}>
                        <FormControl>
                          <FormLabel>Upload Text File</FormLabel>
                          <Input
                            type="file"
                            accept=".txt"
                            onChange={handleFileChange}
                            p={2}
                            mb={4}
                          />
                          {file && (
                            <Text fontSize="sm" color="blue.500" mb={4}>
                              File loaded: {file.name}
                            </Text>
                          )}
                          {clinicalText && (
                            <Textarea
                              value={clinicalText}
                              onChange={handleTextChange}
                              size="lg"
                              minH="200px"
                              mb={4}
                            />
                          )}
                        </FormControl>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                  
                  <Button
                    leftIcon={<Search size={16} />}
                    colorScheme="blue"
                    onClick={extractHPOTerms}
                    isLoading={isLoading}
                    loadingText="Extracting Terms"
                    isDisabled={!clinicalText.trim()}
                  >
                    Extract HPO Terms
                  </Button>
                </VStack>
              </CardBody>
            </Card>
            
            {isLoading ? (
              <Flex justify="center" align="center" p={10}>
                <Spinner size="xl" color="blue.500" />
                <Text ml={4}>Analyzing clinical notes...</Text>
              </Flex>
            ) : extractedTerms.length > 0 ? (
              <Card bg={bgColor} shadow="md" borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Heading size="md" mb={4}>Extracted HPO Terms</Heading>
                  
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text>Found {extractedTerms.length} HPO terms in the clinical notes</Text>
                    <HStack>
                      <Button
                        leftIcon={<Brain size={16} />}
                        colorScheme="green"
                        size="sm"
                        onClick={addAllTermsToSymptoms}
                      >
                        Add All to Symptoms
                      </Button>
                      <Button
                        leftIcon={<Download size={16} />}
                        variant="outline"
                        size="sm"
                        onClick={downloadExtractedTerms}
                      >
                        Export CSV
                      </Button>
                    </HStack>
                  </Flex>
                  
                  <Flex wrap="wrap" gap={2} mb={6}>
                    {extractedTerms.map(term => (
                      <Badge
                        key={term.id}
                        colorScheme="purple"
                        p={2}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        onClick={() => addTermToSymptoms(term)}
                        _hover={{ bg: 'purple.100', color: 'purple.800' }}
                      >
                        <Text fontWeight="medium" mr={1}>{term.name}</Text>
                        <Text fontSize="xs" opacity={0.8}>{term.id}</Text>
                      </Badge>
                    ))}
                  </Flex>
                  
                  <Divider mb={4} />
                  
                  <Heading size="sm" mb={3}>Highlighted Clinical Notes</Heading>
                  <Box
                    p={4}
                    bg={highlightBgColor}
                    borderRadius="md"
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                  />
                </CardBody>
              </Card>
            ) : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};