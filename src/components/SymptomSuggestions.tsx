import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { addSymptom } from '../store/slices/symptomsSlice';
import { PatientSymptom } from '../types';

export const SymptomSuggestions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSymptoms } = useSelector((state: RootState) => state.symptoms);

  const [suggestedSymptoms, setSuggestedSymptoms] = useState<PatientSymptom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 🔍 Debugging: Track Selected Symptoms
  useEffect(() => {
    console.log("📌 Selected Symptoms:", selectedSymptoms);
  }, [selectedSymptoms]);

  // 🔹 Fetch symptom suggestions from the backend
  useEffect(() => {
    const fetchSuggestedSymptoms = async () => {
      if (selectedSymptoms.length === 0) {
        console.log("⚠️ No symptoms selected, skipping API call.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🚀 Fetching suggested symptoms from backend...");
        const response = await fetch('http://localhost:8000/suggest_symptoms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: selectedSymptoms.map((s) => s.name) }),
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Suggested Symptoms Response:", data);

        if (data.suggested_symptoms) {
          // Map backend keys to frontend expected structure
          const mappedSymptoms = data.suggested_symptoms.map((symptom: any) => ({
            id: symptom["HPO ID"],   // Ensure correct ID mapping
            name: symptom["HPO Term"],
            severity: 'Frequent (79-30%)',
            duration: '',
            onset: '',
            dateAdded: new Date().toISOString(),
          }));

          setSuggestedSymptoms(mappedSymptoms);
        }
      } catch (error) {
        console.error('❌ Error fetching suggested symptoms:', error);
        setError('Failed to load symptom suggestions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedSymptoms();
  }, [selectedSymptoms]);

  // 🔍 Debugging: Track Suggested Symptoms
  useEffect(() => {
    console.log("🔄 Updated Suggested Symptoms:", suggestedSymptoms);
  }, [suggestedSymptoms]);

  if (selectedSymptoms.length === 0) {
    return null;
  }

  const handleAddSymptom = (term: PatientSymptom) => {
    dispatch(addSymptom(term));
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

      {loading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : suggestedSymptoms.length === 0 ? (
        <Text color="gray.500">No additional symptom suggestions found.</Text>
      ) : (
        <Wrap spacing={2}>
          {suggestedSymptoms.map((symptom) => (
            <WrapItem key={symptom.id}>
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
                <TagLabel>{symptom.name}</TagLabel>
                <Box ml={1} display="inline-flex">
                  <Plus size={14} />
                </Box>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Box>
  );
};
