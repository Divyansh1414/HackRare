import React, { useEffect, useRef } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface HPOTermHighlighterProps {
  htmlContent: string;
  extractedTerms: Array<{id: string, name: string}>;
}

export const HPOTermHighlighter: React.FC<HPOTermHighlighterProps> = ({ 
  htmlContent, 
  extractedTerms 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  
  useEffect(() => {
    if (containerRef.current) {
      // Create a mapping of colors for each HPO term
      const colorMap: Record<string, string> = {};
      const colors = [
        'rgba(239, 68, 68, 0.2)', // red
        'rgba(249, 115, 22, 0.2)', // orange
        'rgba(234, 179, 8, 0.2)',  // yellow
        'rgba(34, 197, 94, 0.2)',  // green
        'rgba(6, 182, 212, 0.2)',  // cyan
        'rgba(59, 130, 246, 0.2)', // blue
        'rgba(168, 85, 247, 0.2)', // purple
        'rgba(236, 72, 153, 0.2)', // pink
      ];
      
      extractedTerms.forEach((term, index) => {
        colorMap[term.id] = colors[index % colors.length];
      });
      
      // Add styles for the highlighted terms
      const style = document.createElement('style');
      style.textContent = `
        .hpo-highlight {
          border-radius: 3px;
          padding: 0 2px;
          cursor: pointer;
          position: relative;
        }
        
        .hpo-highlight:hover::after {
          content: attr(data-hpo-id);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 10;
        }
      `;
      
      // Add specific styles for each HPO term
      extractedTerms.forEach(term => {
        style.textContent += `
          .hpo-highlight[data-hpo-id="${term.id}"] {
            background-color: ${colorMap[term.id]};
            border: 1px solid ${colorMap[term.id].replace('0.2', '0.4')};
          }
        `;
      });
      
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [extractedTerms, htmlContent]);

  return (
    <Box
      ref={containerRef}
      p={4}
      bg={bgColor}
      borderRadius="md"
      fontSize="sm"
      whiteSpace="pre-wrap"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      sx={{
        '& .hpo-highlight': {
          transition: 'all 0.2s ease-in-out',
        },
        '& .hpo-highlight:hover': {
          opacity: 0.8,
        }
      }}
    />
  );
};