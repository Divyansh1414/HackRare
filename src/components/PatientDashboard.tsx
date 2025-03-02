import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Badge,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
  Divider,
  Select,
  Tooltip,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { Clock, Calendar, AlertTriangle, Trash2, Edit } from 'lucide-react';
import { RootState } from '../store';
import { removeSymptom, updateSymptom } from '../store/slices/symptomsSlice';
import { PatientSymptom } from '../types';

export const PatientDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedSymptoms } = useSelector((state: RootState) => state.symptoms);
  const { currentPatient } = useSelector((state: RootState) => state.patient);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const handleRemoveSymptom = (id: string) => {
    dispatch(removeSymptom(id));
  };
  
  const handleUpdateSeverity = (symptom: PatientSymptom, severity: 'Excluded (0%)' | 'Occasional (29-5%)' | 'Frequent (79-30%)' | 'Very frequent (99-80%)' | 'Obligate (100%)' | 'Very rare (<4-1%)') => {
    dispatch(updateSymptom({
      id: symptom.id,
      updates: { severity }
    }));
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

  return (
    <Box mb={8}>
      <Card borderWidth="1px" borderColor={borderColor} bg={cardBg} shadow="md" borderRadius="lg">
        <CardHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Heading size="md">Patient Dashboard</Heading>
              {currentPatient && (
                <Text color="gray.500" fontSize="sm">
                  {currentPatient.name}, {currentPatient.age} years, {currentPatient.sex}
                </Text>
              )}
            </Box>
            {!currentPatient && (
              <Badge colorScheme="blue">No patient selected</Badge>
            )}
          </Flex>
        </CardHeader>
        
        <Divider />
        
        <CardBody>
          <Heading size="sm" mb={4}>Reported Symptoms</Heading>
          
          {selectedSymptoms.length === 0 ? (
            <Flex 
              direction="column" 
              alignItems="center" 
              justifyContent="center" 
              p={6} 
              borderWidth="1px" 
              borderStyle="dashed" 
              borderColor={borderColor} 
              borderRadius="md"
            >
              <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
              <Text color="gray.500">No symptoms have been added yet</Text>
              <Text fontSize="sm" color="gray.400">Use the search above to add patient symptoms</Text>
            </Flex>
          ) : (
            <Stack spacing={4}>
              {selectedSymptoms.map((symptom) => (
                <Card key={symptom.id} variant="outline" size="sm">
                  <CardBody>
                    <Flex justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Flex alignItems="center" mb={2}>
                          <Heading size="xs">{symptom.name}</Heading>
                          <Badge ml={2} colorScheme="purple" fontSize="xs">{symptom.id}</Badge>
                        </Flex>
                        
                        <Stack direction="row" spacing={4} mt={2}>
                          <Flex alignItems="center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <Select 
                              size="xs" 
                              value={symptom.severity}
                              onChange={(e) => handleUpdateSeverity(
                                symptom, 
                                e.target.value as 'Excluded (0%)' | 'Occasional (29-5%)' | 'Frequent (79-30%)' | 'Very frequent (99-80%)' | 'Obligate (100%)' | 'Very rare (<4-1%)'
                              )}
                              width="180px"
                            >
                              <option value="Excluded (0%)">Excluded (0%)</option>
                              <option value="Very rare (<4-1%)">Very rare (&lt;4-1%)</option>
                              <option value="Occasional (29-5%)">Occasional (29-5%)</option>
                              <option value="Frequent (79-30%)">Frequent (79-30%)</option>
                              <option value="Very frequent (99-80%)">Very frequent (99-80%)</option>
                              <option value="Obligate (100%)">Obligate (100%)</option>
                            </Select>
                          </Flex>
                          
                          {symptom.duration && (
                            <Flex alignItems="center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              <Text fontSize="xs">{symptom.duration}</Text>
                            </Flex>
                          )}
                          
                          <Badge colorScheme={getSeverityColor(symptom.severity)}>
                            {symptom.severity}
                          </Badge>
                        </Stack>
                      </Box>
                      
                      <Flex>
                        <Tooltip label="Edit symptom details">
                          <IconButton
                            aria-label="Edit symptom"
                            icon={<Edit className="h-4 w-4" />}
                            size="sm"
                            variant="ghost"
                          />
                        </Tooltip>
                        <Tooltip label="Remove symptom">
                          <IconButton
                            aria-label="Remove symptom"
                            icon={<Trash2 className="h-4 w-4" />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleRemoveSymptom(symptom.id)}
                          />
                        </Tooltip>
                      </Flex>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};