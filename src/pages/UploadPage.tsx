import React from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { FileUpload } from '../components/FileUpload';

export const UploadPage: React.FC = () => {
  return (
    <Box>
      <Box mb={6} textAlign="center">
        <Heading size="lg" mb={2}>Upload Medical Report</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} maxW="600px" mx="auto">
          Upload your medical reports for automated analysis and interpretation
        </Text>
      </Box>
      
      <Box display="flex" justifyContent="center">
        <FileUpload />
      </Box>
    </Box>
  );
};