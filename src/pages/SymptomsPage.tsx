import React from 'react';
import { Box, Heading, Text, useColorModeValue, Button, Flex, Tooltip, IconButton } from '@chakra-ui/react';
import { HPOTermSearch } from '../components/HPOTermSearch';
import { PatientDashboard } from '../components/PatientDashboard';
import { DisorderRecommendations } from '../components/DisorderRecommendations';
import { SymptomSuggestions } from '../components/SymptomSuggestions';
import { Download, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const SymptomsPage: React.FC = () => {
  const { selectedSymptoms } = useSelector((state: RootState) => state.symptoms);
  
  // Function to export HPO data for ML processing
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
  
  // Function to handle file upload for ML results
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const results = JSON.parse(e.target?.result as string);
        console.log("Imported ML results:", results);
        // Here you would dispatch an action to update the state with the ML results
        // dispatch(updateMLResults(results));
      } catch (error) {
        console.error("Error parsing ML results:", error);
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>Symptoms & Patient</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Search for symptoms using HPO terms and manage patient information
          </Text>
        </Box>
        
        {selectedSymptoms.length > 0 && (
          <Flex gap={2}>
            <Tooltip label="Export HPO data for ML processing">
              <Button
                leftIcon={<Download size={16} />}
                size="sm"
                onClick={exportHPOData}
                colorScheme="blue"
                variant="outline"
              >
                Export Data
              </Button>
            </Tooltip>
            
            <Tooltip label="Import ML results">
              <Button
                as="label"
                htmlFor="ml-results-upload"
                leftIcon={<Upload size={16} />}
                size="sm"
                colorScheme="green"
                variant="outline"
                cursor="pointer"
              >
                Import Results
                <input
                  id="ml-results-upload"
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </Button>
            </Tooltip>
          </Flex>
        )}
      </Flex>
      
      <HPOTermSearch />
      <DisorderRecommendations />
      <SymptomSuggestions />
      <PatientDashboard />
    </Box>
  );
};