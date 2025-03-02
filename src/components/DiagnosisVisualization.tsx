import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import { Box, Heading, Text, Spinner, useColorModeValue } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';
import { RootState } from '../store';

export const DiagnosisVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { diagnoses, status } = useSelector((state: RootState) => state.diagnoses);
  const { selectedSymptoms } = useSelector((state: RootState) => state.symptoms);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const linkColor = useColorModeValue('gray.300', 'gray.600');
  
  useEffect(() => {
    if (status !== 'succeeded' || diagnoses.length === 0 || !svgRef.current) {
      return;
    }
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Create data structure for the network graph
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Add diagnoses as nodes
    diagnoses.forEach((diagnosis, i) => {
      nodes.push({
        id: diagnosis.id,
        name: diagnosis.name,
        confidence: diagnosis.confidence,
        type: 'diagnosis',
        radius: 40 + (diagnosis.confidence / 10),
      });
    });
    
    // Add symptoms as nodes
    selectedSymptoms.forEach((symptom) => {
      nodes.push({
        id: symptom.id,
        name: symptom.name,
        type: 'symptom',
        severity: symptom.severity,
        radius: 25,
      });
    });
    
    // Create links between diagnoses and symptoms
    diagnoses.forEach((diagnosis) => {
      diagnosis.matchedSymptoms.forEach((match) => {
        // Only create links for symptoms that are actually selected
        if (selectedSymptoms.some(s => s.id === match.hpoId)) {
          links.push({
            source: diagnosis.id,
            target: match.hpoId,
            weight: match.weight,
          });
        }
      });
    });
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 10));
    
    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', (d) => 2 + d.weight * 4)
      .attr('stroke', linkColor)
      .attr('stroke-opacity', 0.6);
    
    // Create a group for each node
    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => {
        if (d.type === 'diagnosis') {
          return d3.interpolateRdYlGn(d.confidence / 100);
        } else {
          // Symptom colors based on severity
          switch (d.severity) {
            case 'Excluded (0%)': return '#A0AEC0'; // gray
            case 'Very rare (<4-1%)': return '#4299E1'; // blue
            case 'Occasional (29-5%)': return '#48BB78'; // green
            case 'Frequent (79-30%)': return '#ECC94B'; // yellow
            case 'Very frequent (99-80%)': return '#ED8936'; // orange
            case 'Obligate (100%)': return '#E53E3E'; // red
            default: return '#A0AEC0'; // gray
          }
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Add labels to nodes
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.type === 'diagnosis' ? 5 : 4)
      .attr('font-size', (d) => d.type === 'diagnosis' ? '12px' : '10px')
      .attr('fill', '#fff')
      .text((d) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);
    
    // Add confidence labels to diagnosis nodes
    node.filter((d) => d.type === 'diagnosis')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 20)
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .text((d) => `${d.confidence}%`);
    
    // Update positions during simulation
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${innerWidth - 150}, 0)`);
    
    // Diagnosis confidence legend
    legend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('Legend:');
    
    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 20)
      .attr('r', 6)
      .attr('fill', d3.interpolateRdYlGn(0.9));
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 24)
      .attr('font-size', '10px')
      .text('High confidence diagnosis');
    
    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 40)
      .attr('r', 6)
      .attr('fill', d3.interpolateRdYlGn(0.5));
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 44)
      .attr('font-size', '10px')
      .text('Medium confidence diagnosis');
    
    // Symptom severity legend
    legend.append('text')
      .attr('x', 0)
      .attr('y', 70)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('Symptom Severity:');
    
    const severities = [
      { name: 'Excluded (0%)', color: '#A0AEC0', y: 90 },
      { name: 'Very rare (<4-1%)', color: '#4299E1', y: 110 },
      { name: 'Occasional (29-5%)', color: '#48BB78', y: 130 },
      { name: 'Frequent (79-30%)', color: '#ECC94B', y: 150 },
      { name: 'Very frequent (99-80%)', color: '#ED8936', y: 170 },
      { name: 'Obligate (100%)', color: '#E53E3E', y: 190 }
    ];
    
    severities.forEach(severity => {
      legend.append('circle')
        .attr('cx', 10)
        .attr('cy', severity.y)
        .attr('r', 6)
        .attr('fill', severity.color);
      
      legend.append('text')
        .attr('x', 25)
        .attr('y', severity.y + 4)
        .attr('font-size', '10px')
        .text(severity.name);
    });
    
  }, [diagnoses, selectedSymptoms, status, bgColor, linkColor]);
  
  if (status === 'loading') {
    return (
      <Box textAlign="center" p={10}>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>Analyzing symptoms and generating potential diagnoses...</Text>
      </Box>
    );
  }
  
  if (status === 'failed') {
    return (
      <Box textAlign="center" p={10} color="red.500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <Heading size="md">Error Generating Visualization</Heading>
        <Text mt={2}>Unable to process the diagnosis data. Please try again.</Text>
      </Box>
    );
  }
  
  if (diagnoses.length === 0) {
    return (
      <Box 
        p={6} 
        bg={bgColor} 
        borderRadius="lg" 
        boxShadow="md" 
        textAlign="center"
      >
        <Heading size="md" mb={4} color={textColor}>Diagnosis Visualization</Heading>
        <Text color="gray.500">
          No diagnoses available. Add symptoms and analyze to see potential diagnoses.
        </Text>
      </Box>
    );
  }
  
  return (
    <Box 
      p={4} 
      bg={bgColor} 
      borderRadius="lg" 
      boxShadow="md" 
      overflowX="auto"
    >
      <Heading size="md" mb={4} textAlign="center" color={textColor}>
        Diagnosis Visualization
      </Heading>
      <Box textAlign="center">
        <svg ref={svgRef} width="100%" height="600" style={{ maxWidth: '100%' }}></svg>
      </Box>
      <Text fontSize="sm" textAlign="center" color="gray.500" mt={2}>
        Drag nodes to explore relationships. Larger circles indicate higher confidence diagnoses.
      </Text>
    </Box>
  );
};