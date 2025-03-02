import { useEffect, useRef } from 'react';

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isDark: boolean) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(
    x, y, 
    x - size * 0.5, y, 
    x - size * 0.5, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x - size * 0.5, y + size * 0.6, 
    x, y + size * 0.8, 
    x, y + size
  );
  ctx.bezierCurveTo(
    x, y + size * 0.8, 
    x + size * 0.5, y + size * 0.6, 
    x + size * 0.5, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x + size * 0.5, y, 
    x, y, 
    x, y + size * 0.3
  );
  ctx.closePath();
}

function drawPulse(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, progress: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  
  // Calculate the actual drawing width based on progress
  const drawWidth = width * progress;
  
  // Draw the pulse wave with progress
  const segmentWidth = drawWidth / 6;
  
  if (progress > 0) ctx.lineTo(x + Math.min(segmentWidth, drawWidth), y);
  if (progress > 1/6) ctx.lineTo(x + Math.min(segmentWidth * 1.5, drawWidth), y - 20);
  if (progress > 2/6) ctx.lineTo(x + Math.min(segmentWidth * 2.5, drawWidth), y + 20);
  if (progress > 3/6) ctx.lineTo(x + Math.min(segmentWidth * 3.5, drawWidth), y - 40);
  if (progress > 4/6) ctx.lineTo(x + Math.min(segmentWidth * 4.5, drawWidth), y + 40);
  if (progress > 5/6) ctx.lineTo(x + Math.min(segmentWidth * 5.5, drawWidth), y);
  if (progress > 5.9/6) ctx.lineTo(x + drawWidth, y);
  
  ctx.stroke();
}

function drawDNA(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, time: number) {
  const width = 30;
  const rungs = 10;
  const frequency = 0.1;
  const amplitude = width / 2;
  
  // Draw the two strands
  for (let strand = 0; strand < 2; strand++) {
    ctx.beginPath();
    for (let i = 0; i <= height; i += 5) {
      const offset = strand === 0 ? 0 : Math.PI;
      const xPos = x + Math.sin(i * frequency + time + offset) * amplitude;
      ctx.lineTo(xPos, y + i);
    }
    ctx.stroke();
  }
  
  // Draw the rungs
  for (let i = 0; i < rungs; i++) {
    const yPos = y + (height / rungs) * i;
    const leftX = x + Math.sin(yPos * frequency + time) * amplitude;
    const rightX = x + Math.sin(yPos * frequency + time + Math.PI) * amplitude;
    
    ctx.beginPath();
    ctx.moveTo(leftX, yPos);
    ctx.lineTo(rightX, yPos);
    ctx.stroke();
  }
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMouseInCanvasRef = useRef(false);

  // Track mouse position for interactive elements
  const handleMouseMove = (e: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseEnter = () => {
    isMouseInCanvasRef.current = true;
  };
  
  const handleMouseLeave = () => {
    isMouseInCanvasRef.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gradient = gradientRef.current;
    if (!canvas || !gradient) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Add mouse event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation variables
    let frame = 0;
    let time = 0;
    const hearts: Array<{ x: number; y: number; size: number; speed: number; opacity: number; rotation: number; rotationSpeed: number }> = [];
    const pulses: Array<{ x: number; y: number; width: number; progress: number; speed: number }> = [];
    const dnaHelices: Array<{ x: number; y: number; height: number; speed: number; opacity: number }> = [];

    // Create initial hearts with increased speed
    for (let i = 0; i < 15; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    // Create initial pulses
    for (let i = 0; i < 5; i++) {
      pulses.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 100 + 100,
        progress: Math.random(),
        speed: Math.random() * 0.01 + 0.005
      });
    }

    // Create DNA helices
    for (let i = 0; i < 3; i++) {
      dnaHelices.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height - 200),
        height: Math.random() * 100 + 150,
        speed: (Math.random() - 0.5) * 0.01,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      // Check if dark mode is active directly in the animation loop
      const isDark = document.documentElement.classList.contains('dark');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;
      
      // Get current theme colors based on current dark mode state
      const color = isDark ? '129, 140, 248' : '79, 70, 229'; // indigo-400 : indigo-700
      const accentColor = isDark ? '236, 72, 153' : '219, 39, 119'; // pink-500 : pink-600
      
      // Update and draw hearts
      hearts.forEach(heart => {
        ctx.save();
        ctx.fillStyle = `rgba(${color}, ${heart.opacity})`;
        ctx.strokeStyle = `rgba(${color}, ${heart.opacity * 1.5})`;
        ctx.lineWidth = 1;
        
        // Move hearts upward
        heart.y -= heart.speed;
        
        // Add slight horizontal movement based on sine wave
        heart.x += Math.sin(time * 0.5 + heart.y * 0.01) * 0.5;
        
        // Rotate hearts
        heart.rotation += heart.rotationSpeed;
        
        // Reset when out of view
        if (heart.y + heart.size < 0) {
          heart.y = canvas.height + heart.size;
          heart.x = Math.random() * canvas.width;
          heart.speed = Math.random() * 1.5 + 0.8;
        }
        
        // Draw heart with rotation
        ctx.translate(heart.x, heart.y);
        ctx.rotate(heart.rotation);
        drawHeart(ctx, 0, 0, heart.size, isDark);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Update and draw pulses
      pulses.forEach(pulse => {
        ctx.save();
        ctx.strokeStyle = `rgba(${accentColor}, 0.3)`;
        ctx.lineWidth = 2;
        
        // Update progress
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.x = Math.random() * canvas.width;
          pulse.y = Math.random() * canvas.height;
          pulse.width = Math.random() * 100 + 100;
        }
        
        // Draw pulse with animated progress
        drawPulse(ctx, pulse.x, pulse.y, pulse.width, pulse.progress);
        ctx.restore();
      });

      // Update and draw DNA helices
      dnaHelices.forEach(dna => {
        ctx.save();
        ctx.strokeStyle = `rgba(${color}, ${dna.opacity})`;
        ctx.lineWidth = 1.5;
        
        // Move DNA helices slowly
        dna.x += dna.speed * canvas.width;
        
        // Wrap around screen edges
        if (dna.x < -50) dna.x = canvas.width + 50;
        if (dna.x > canvas.width + 50) dna.x = -50;
        
        // Draw DNA helix
        drawDNA(ctx, dna.x, dna.y, dna.height, time);
        ctx.restore();
      });

      // Interactive element - draw ripple effect when mouse is in canvas
      if (isMouseInCanvasRef.current) {
        const rippleRadius = (time * 50) % 100;
        ctx.save();
        ctx.beginPath();
        ctx.arc(mousePositionRef.current.x, mousePositionRef.current.y, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentColor}, ${1 - rippleRadius / 100})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Second ripple with delay
        if (rippleRadius > 30) {
          ctx.beginPath();
          ctx.arc(mousePositionRef.current.x, mousePositionRef.current.y, rippleRadius - 30, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color}, ${1 - (rippleRadius - 30) / 100})`;
          ctx.stroke();
        }
        ctx.restore();
        
        // Add small hearts around cursor when moving
        if (Math.random() > 0.9) {
          hearts.push({
            x: mousePositionRef.current.x + (Math.random() - 0.5) * 50,
            y: mousePositionRef.current.y + (Math.random() - 0.5) * 50,
            size: Math.random() * 10 + 5,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.7 + 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05
          });
          
          // Keep the array size manageable
          if (hearts.length > 50) {
            hearts.shift();
          }
        }
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div 
        ref={gradientRef}
        className="fixed inset-0 -z-20 transition-colors duration-500 ease-in-out bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30"
      >
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/50 backdrop-blur-[100px] transition-colors duration-500"></div>
      </div>
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 -z-10 cursor-none"
      />
    </>
  );
}