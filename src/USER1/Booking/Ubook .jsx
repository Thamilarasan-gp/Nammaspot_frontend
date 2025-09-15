import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment, Text } from '@react-three/drei';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import * as THREE from 'three';
import { Car, Clock, Calendar, MapPin, DollarSign, AlertCircle, Loader2, MousePointer, ZoomIn, RotateCw, Info, ArrowRight, CarFront, SparklesIcon, Vibrate as GateEntrance, Satellite as GateExit, Navigation, CarTaxiFront, Camera, Shield, TreePine, Building2, Trash2, Zap, Users } from 'lucide-react';
import "./Ubook.css";

// Enhanced Car Model with realistic parking behavior
const CarModel = ({ 
  position, 
  visible, 
  isArriving, 
  color = "#007AFF", 
  carType = "sedan",
  targetPosition,
  targetRotation = [0, 0, 0],
  onArrivalComplete,
  isParked = false,
  licensePlate = "ABC123"
}) => {
  const groupRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(position);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [isMoving, setIsMoving] = useState(false);
  const [headlightIntensity, setHeadlightIntensity] = useState(0);
  const [brakeLights, setBrakeLights] = useState(false);
  
  // Car type configurations
  const carConfigs = {
    sedan: {
      bodySize: [1.6, 0.5, 3.2],
      topSize: [1.3, 0.3, 2.2],
      wheelOffset: 0.7,
      color: color
    },
    suv: {
      bodySize: [1.8, 0.7, 3.5],
      topSize: [1.4, 0.4, 2.5],
      wheelOffset: 0.8,
      color: color
    },
    compact: {
      bodySize: [1.4, 0.4, 2.8],
      topSize: [1.2, 0.25, 2.0],
      wheelOffset: 0.6,
      color: color
    }
  };

  const config = carConfigs[carType] || carConfigs.sedan;

  // Enhanced pathfinding with more realistic routes
  useEffect(() => {
    if (isArriving && visible && targetPosition) {
      setIsMoving(true);
      setHeadlightIntensity(0.8);
      
      // Create more sophisticated waypoints based on parking lot layout
      const entrancePos = [0, 0.2, -65]; // Start from main entrance
      const mainRoadPoint = [0, 0.2, -45]; // Enter main road
      
      // Determine which section the target is in
      const targetX = targetPosition[0];
      const targetZ = targetPosition[2];
      
      // Create section-based routing
      let sectionEntryPoint;
      if (targetX < -15) {
        sectionEntryPoint = [-20, 0.2, -20]; // Left section
      } else if (targetX > 15) {
        sectionEntryPoint = [20, 0.2, -20]; // Right section
      } else {
        sectionEntryPoint = [0, 0.2, -20]; // Center section
      }
      
      const approachPoint = [targetX * 0.8, 0.2, targetZ - 8];
      const finalApproach = [targetX, 0.2, targetZ - 3];
      
      const waypoints = [
        entrancePos,
        mainRoadPoint,
        sectionEntryPoint,
        approachPoint,
        finalApproach,
        targetPosition
      ];
      
      let currentWaypoint = 0;
      const animationDuration = 8000; // 8 seconds for more realistic timing
      const startTime = Date.now();
      
      const animateMovement = () => {
        const elapsed = Date.now() - startTime;
        const totalProgress = Math.min(elapsed / animationDuration, 1);
        
        // Calculate position along path with easing
        const segmentProgress = (totalProgress * (waypoints.length - 1)) % 1;
        const segmentIndex = Math.floor(totalProgress * (waypoints.length - 1));
        
        if (segmentIndex < waypoints.length - 1) {
          const start = waypoints[segmentIndex];
          const end = waypoints[segmentIndex + 1];
          
          // Apply different easing for different segments
          let easedProgress;
          if (segmentIndex === 0) {
            // Slow start from entrance
            easedProgress = segmentProgress * segmentProgress;
          } else if (segmentIndex >= waypoints.length - 2) {
            // Slow down for parking
            easedProgress = 1 - Math.pow(1 - segmentProgress, 3);
          } else {
            // Normal speed on roads
            easedProgress = segmentProgress;
          }
          
          const newPosition = [
            start[0] + (end[0] - start[0]) * easedProgress,
            start[1] + (end[1] - start[1]) * easedProgress,
            start[2] + (end[2] - start[2]) * easedProgress
          ];
          
          // Calculate rotation to face movement direction
          const direction = [end[0] - start[0], 0, end[2] - start[2]];
          const angle = Math.atan2(direction[0], direction[2]);
          setRotation([0, angle, 0]);
          
          // Activate brake lights when approaching final position
          if (segmentIndex >= waypoints.length - 2 && segmentProgress > 0.5) {
            setBrakeLights(true);
          }
          
          setCurrentPosition(newPosition);
        }
        
        if (totalProgress < 1) {
          requestAnimationFrame(animateMovement);
        } else {
          setIsMoving(false);
          setCurrentPosition(targetPosition);
          setRotation(targetRotation);
          setHeadlightIntensity(0);
          setBrakeLights(false);
          if (onArrivalComplete) onArrivalComplete();
        }
      };
      
      requestAnimationFrame(animateMovement);
    } else if (visible) {
      setCurrentPosition(position);
      setRotation(targetRotation);
    }
  }, [isArriving, visible, targetPosition, targetRotation]);

  useFrame((state) => {
    if (groupRef.current && !isMoving && isParked) {
      // Subtle idle animation for parked cars
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  if (!visible) return null;

  return (
    <group position={currentPosition} rotation={rotation} ref={groupRef}>
      {/* Car body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={config.bodySize} />
        <meshStandardMaterial color={config.color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car roof */}
      <mesh position={[0, 0.95, 0.1]} castShadow>
        <boxGeometry args={config.topSize} />
        <meshStandardMaterial color={config.color} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.95, 0.9]} castShadow>
        <boxGeometry args={[config.topSize[0] - 0.05, config.topSize[1] - 0.05, 0.8]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[config.wheelOffset, 0.95, 0.1]} castShadow>
        <boxGeometry args={[0.02, config.topSize[1] - 0.05, 1.8]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-config.wheelOffset, 0.95, 0.1]} castShadow>
        <boxGeometry args={[0.02, config.topSize[1] - 0.05, 1.8]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 0.95, -0.8]} castShadow>
        <boxGeometry args={[config.topSize[0] - 0.1, config.topSize[1] - 0.05, 0.6]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
      </mesh>
      
      {/* Enhanced headlights with dynamic intensity */}
      <mesh position={[0.6, 0.5, config.bodySize[2]/2]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={headlightIntensity} 
        />
      </mesh>
      <mesh position={[-0.6, 0.5, config.bodySize[2]/2]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={headlightIntensity} 
        />
      </mesh>
      
      {/* LED strip lights */}
      <mesh position={[0, 0.4, config.bodySize[2]/2 + 0.1]} castShadow>
        <boxGeometry args={[1.4, 0.05, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
      </mesh>
      
      {/* Taillights with brake light effect */}
      <mesh position={[0.5, 0.5, -config.bodySize[2]/2]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={brakeLights ? 1.5 : 0.5} 
        />
      </mesh>
      <mesh position={[-0.5, 0.5, -config.bodySize[2]/2]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={brakeLights ? 1.5 : 0.5} 
        />
      </mesh>
      
      {/* Detailed wheels with rims */}
      {[[-config.wheelOffset, 1], [config.wheelOffset, 1], [-config.wheelOffset, -1], [config.wheelOffset, -1]].map((pos, i) => (
        <group key={i} position={[pos[0], 0.2, pos[1]]}>
          {/* Tire */}
          <mesh rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.1]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      
      {/* License plates */}
      <mesh position={[0, 0.3, config.bodySize[2]/2 + 0.05]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Html position={[0, 0.3, config.bodySize[2]/2 + 0.08]} center>
        <div className="us-bk-license-plate">{licensePlate}</div>
      </Html>
      
      <mesh position={[0, 0.6, -config.bodySize[2]/2 - 0.05]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Html position={[0, 0.6, -config.bodySize[2]/2 - 0.08]} center rotation={[0, Math.PI, 0]}>
        <div className="us-bk-license-plate">{licensePlate}</div>
      </Html>
      
      {/* Side mirrors */}
      <mesh position={[config.wheelOffset + 0.1, 0.8, 0.6]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color={config.color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-(config.wheelOffset + 0.1), 0.8, 0.6]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color={config.color} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Exhaust pipe */}
      <mesh position={[-0.3, 0.2, -config.bodySize[2]/2 - 0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Enhanced Parking Gate with security booth
const ParkingGate = ({ position, type, isOpen }) => {
  const [gateRotation, setGateRotation] = useState(0);
  
  useEffect(() => {
    const targetRotation = isOpen ? -Math.PI/2 : 0;
    const animate = () => {
      setGateRotation(prev => {
        const diff = targetRotation - prev;
        if (Math.abs(diff) < 0.01) return targetRotation;
        return prev + diff * 0.1;
      });
    };
    
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <group position={position}>
      {/* Security booth */}
      <mesh position={type === 'entrance' ? [-6, 1.5, 0] : [6, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Booth roof */}
      <mesh position={type === 'entrance' ? [-6, 3.2, 0] : [6, 3.2, 0]} castShadow>
        <boxGeometry args={[2.4, 0.3, 2.4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Booth window */}
      <mesh position={type === 'entrance' ? [-5, 2, 0] : [5, 2, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 1.5]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      
      {/* Gate pillars */}
      <mesh position={[-3, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 5, 0.4]} />
        <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[3, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 5, 0.4]} />
        <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Gate mechanism box */}
      <mesh position={[-3, 4.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Gate arm */}
      <group position={[-3, 4.2, 0]}>
        <mesh rotation={[0, 0, gateRotation]} castShadow>
          <boxGeometry args={[6, 0.15, 0.3]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Reflective strips on gate arm */}
        <mesh rotation={[0, 0, gateRotation]} position={[1.5, 0, 0.16]} castShadow>
          <boxGeometry args={[1, 0.05, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, gateRotation]} position={[-1.5, 0, 0.16]} castShadow>
          <boxGeometry args={[1, 0.05, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      {/* Traffic light */}
      <mesh position={[3, 4.5, 1]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      <mesh position={[3, 4.7, 1]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={isOpen ? "#22c55e" : "#ef4444"} 
          emissive={isOpen ? "#22c55e" : "#ef4444"} 
          emissiveIntensity={0.8} 
        />
      </mesh>
      
      {/* Gate sensors */}
      <mesh position={[-3, 0.5, 2]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[3, 0.5, 2]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Sign */}
      <Html position={type === 'entrance' ? [-4, 6, 0] : [4, 6, 0]} center>
        <div className={`us-bk-gate-sign us-bk-gate-${type}`}>
          {type === 'entrance' ? 'ENTRANCE' : 'EXIT'}
        </div>
      </Html>
    </group>
  );
};

// Security Camera Component
const SecurityCamera = ({ position }) => {
  const cameraRef = useRef();
  
  useFrame((state) => {
    if (cameraRef.current) {
      cameraRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });
  
  return (
    <group position={position}>
      {/* Camera pole */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Camera housing */}
      <mesh ref={cameraRef} position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Camera lens */}
      <mesh ref={cameraRef} position={[0, 4.2, 0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* LED indicator */}
      <mesh ref={cameraRef} position={[0.1, 4.3, 0]} castShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

// Enhanced Parking Slot with realistic details and improved animations
const ParkingSlot = ({ 
  position, 
  index, 
  isSelected, 
  isBooked, 
  onSlotClick, 
  slotLabel,
  orientation = 'horizontal',
  slotType = 'regular',
  vehicleNumber = '',
  sectionType = 'standard'
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showCar, setShowCar] = useState(false);
  const [isArriving, setIsArriving] = useState(false);
  const [isParked, setIsParked] = useState(false);

  // Enhanced slot dimensions based on type and orientation
  const getSlotDimensions = () => {
    const baseWidth = slotType === 'compact' ? 3.2 : 4.0;
    const baseDepth = slotType === 'compact' ? 2.2 : 2.8;
    
    if (sectionType === 'angled') {
      return {
        width: orientation === 'horizontal' ? baseWidth : baseDepth,
        depth: orientation === 'horizontal' ? baseDepth : baseWidth,
        angle: orientation === 'horizontal' ? 0 : Math.PI / 6 // 30 degree angle
      };
    }
    
    return {
      width: orientation === 'horizontal' ? baseWidth : baseDepth,
      depth: orientation === 'horizontal' ? baseDepth : baseWidth,
      angle: 0
    };
  };

  const { width, depth, angle } = getSlotDimensions();

  // Calculate proper car position and rotation based on slot orientation
  const carPosition = [position[0], 0.2, position[2]];
  const carRotation = [0, (orientation === 'vertical' ? Math.PI/2 : 0) + angle, 0];

  useFrame((state) => {
    if (meshRef.current) {
      if (isBooked) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.03 + 1;
        meshRef.current.scale.setScalar(pulse);
      } else if (hovered && !isBooked) {
        meshRef.current.position.y = position[1] + 0.12;
        const glow = Math.sin(state.clock.elapsedTime * 4) * 0.3 + 0.7;
        meshRef.current.material.emissiveIntensity = glow * 0.2;
      } else {
        meshRef.current.position.y = position[1];
        meshRef.current.scale.setScalar(isSelected ? 1.08 : 1);
        meshRef.current.material.emissiveIntensity = isSelected ? 0.15 : 0;
      }
    }
  });

  useEffect(() => {
    if (isSelected && !isBooked) {
      setIsArriving(true);
      const timer = setTimeout(() => {
        setShowCar(true);
        setTimeout(() => {
          setIsArriving(false);
          setIsParked(true);
        }, 3000); // Longer animation time
      }, 800);
      return () => clearTimeout(timer);
    } else if (isBooked) {
      setShowCar(true);
      setIsParked(true);
    } else {
      setShowCar(false);
      setIsArriving(false);
      setIsParked(false);
    }
  }, [isSelected, isBooked]);

  const getSlotColor = () => {
    if (slotType === 'handicap') return isBooked ? '#7c3aed' : '#a855f7';
    if (slotType === 'compact') return isBooked ? '#dc2626' : '#10b981';
    if (slotType === 'premium') return isBooked ? '#dc2626' : '#f59e0b';
    if (isBooked) return '#dc2626';
    if (isSelected) return '#3b82f6';
    if (hovered) return '#10b981';
    return '#22c55e';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isBooked) {
      onSlotClick(index);
    }
  };

  return (
    <group position={position} rotation={[0, angle, 0]}>
      {/* Enhanced asphalt base with texture */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[width + 0.6, 0.15, depth + 0.6]} />
        <meshStandardMaterial 
          color="#2d3748" 
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
      
      {/* Main slot marking with enhanced visual feedback */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => !isBooked && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <boxGeometry args={[width, 0.03, depth]} />
        <meshStandardMaterial 
          color={getSlotColor()} 
          transparent={isBooked}
          opacity={isBooked ? 0.7 : 1}
          emissive={getSlotColor()}
          emissiveIntensity={isBooked ? 0.1 : (hovered ? 0.2 : (isSelected ? 0.15 : 0))}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Car model with enhanced positioning */}
      <CarModel 
        position={carPosition} 
        visible={showCar} 
        isArriving={isArriving} 
        isParked={isParked}
        color={isSelected ? "#3b82f6" : (isBooked ? "#dc2626" : "#007AFF")}
        carType={slotType === 'compact' ? 'compact' : (slotType === 'premium' ? 'suv' : 'sedan')}
        targetPosition={carPosition}
        targetRotation={carRotation}
        licensePlate={isBooked ? vehicleNumber : "NEWCAR"}
      />
      
      {/* Enhanced parking lines with better visibility */}
      {/* Front line */}
      <mesh position={[0, 0.03, depth/2]} receiveShadow>
        <boxGeometry args={[width + 0.3, 0.02, 0.2]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.2}
          roughness={0.3}
        />
      </mesh>
      {/* Back line */}
      <mesh position={[0, 0.03, -depth/2]} receiveShadow>
        <boxGeometry args={[width + 0.3, 0.02, 0.2]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.2}
          roughness={0.3}
        />
      </mesh>
      {/* Left line */}
      <mesh position={[-width/2, 0.03, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.02, depth + 0.3]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.2}
          roughness={0.3}
        />
      </mesh>
      

      {/* Right line */}
      <mesh position={[width/2, 0.03, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.02, depth + 0.3]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.2}
          roughness={0.3}
        />
      </mesh>
      
      {/* Enhanced slot type indicators */}
      {slotType === 'handicap' && (
        <>
          <Html position={[0, 0.15, 0]} center>
            <div className="us-bk-handicap-symbol">♿</div>
          </Html>
          {/* Blue handicap background */}
          <mesh position={[0, 0.01, 0]} receiveShadow>
            <boxGeometry args={[1.5, 0.01, 1.5]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
          </mesh>
        </>
      )}
      
      {slotType === 'compact' && (
        <Html position={[0, 0.15, 0]} center>
          <div className="us-bk-compact-symbol">🚗</div>
        </Html>
      )}
      
      {slotType === 'premium' && (
        <>
          <Html position={[0, 0.15, 0]} center>
            <div className="us-bk-premium-symbol">⭐</div>
          </Html>
          {/* Gold premium background */}
          <mesh position={[0, 0.01, 0]} receiveShadow>
            <boxGeometry args={[width * 0.8, 0.01, depth * 0.8]} />
            <meshStandardMaterial color="#f59e0b" transparent opacity={0.2} />
          </mesh>
        </>
      )}
      
      {/* Enhanced slot number with better styling */}
      <Html position={[0, 0.8, 0]} center>
        <div className={`us-bk-slot-label ${slotType === 'handicap' ? 'us-bk-slot-handicap' : ''} ${slotType === 'compact' ? 'us-bk-slot-compact' : ''} ${slotType === 'premium' ? 'us-bk-slot-premium' : ''}`}>
          {slotLabel}
        </div>
      </Html>
      
      {/* Vehicle number for booked slots */}
      {isBooked && vehicleNumber && (
        <Html position={[0, 1.4, 0]} center>
          <div className="us-bk-vehicle-number">{vehicleNumber}</div>
        </Html>
      )}
      
      {/* Enhanced curb stops with realistic design */}
      <mesh position={[0, 0.08, depth/2 - 0.4]} castShadow>
        <boxGeometry args={[width * 0.9, 0.15, 0.4]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.8} />
      </mesh>
      
      {/* Slot status indicator lights */}
      {!isBooked && (
        <mesh position={[width/2 - 0.2, 0.1, depth/2 - 0.2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshStandardMaterial 
            color={isSelected ? "#3b82f6" : "#22c55e"} 
            emissive={isSelected ? "#3b82f6" : "#22c55e"} 
            emissiveIntensity={0.8} 
          />
        </mesh>
      )}
    </group>
  );
};

// Enhanced parking lot environment with more realistic sections
const ParkingLotEnvironment = () => {
  return (
    <>
      {/* Enhanced asphalt ground with realistic texture and wear patterns */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial 
          color="#374151" 
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
      
      {/* Main driving lanes with enhanced realism */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
        <planeGeometry args={[14, 220]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </mesh>
      
      {/* Secondary access roads */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[-35, -0.48, 0]} receiveShadow>
        <planeGeometry args={[8, 180]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[35, -0.48, 0]} receiveShadow>
        <planeGeometry args={[8, 180]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </mesh>
      
      {/* Enhanced lane dividers with proper spacing */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI/2, 0, 0]} position={[0, -0.47, -110 + i * 9]} receiveShadow>
          <planeGeometry args={[0.4, 5]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
      ))}
      
      {/* Crosswalk markings with zebra pattern */}
      {[-25, 0, 25].map(z => (
        <group key={z}>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} rotation={[-Math.PI/2, 0, 0]} position={[-12 + i * 2.4, -0.47, z]} receiveShadow>
              <planeGeometry args={[1.8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.15} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Directional arrows with better visibility */}
      {[-40, -20, 0, 20, 40].map((z, i) => (
        <Html key={i} position={[0, 0.1, z]} center rotation={[-Math.PI/2, 0, 0]}>
          <div className="us-bk-road-arrow">
            {i % 2 === 0 ? '⬆' : '⬇'}
          </div>
        </Html>
      ))}
      
      {/* Enhanced speed bumps with warning stripes */}
      {[-45, -15, 15, 45].map((z, i) => (
        <group key={i}>
          <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.44, z]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 14, 16]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.8} />
          </mesh>
          {/* Warning stripes */}
          {Array.from({ length: 5 }).map((_, j) => (
            <mesh key={j} rotation={[-Math.PI/2, 0, 0]} position={[-6 + j * 3, -0.43, z]} castShadow>
              <cylinderGeometry args={[0.19, 0.19, 1, 8]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Enhanced lighting system with modern LED fixtures */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -55 + i * 10;
        return (
          <group key={i}>
            {/* Modern light pole */}
            <mesh position={[x, 7, -65]} castShadow>
              <cylinderGeometry args={[0.25, 0.35, 14, 16]} />
              <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* LED light fixture with housing */}
            <mesh position={[x, 14, -65]} castShadow>
              <boxGeometry args={[2, 0.8, 2]} />
              <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* LED panel */}
            <mesh position={[x, 13.5, -65]} castShadow>
              <boxGeometry args={[1.8, 0.1, 1.8]} />
              <meshStandardMaterial 
                color="#f1f5f9" 
                emissive="#fbbf24" 
                emissiveIntensity={0.8}
                transparent
                opacity={0.95}
              />
            </mesh>
            
            {/* Enhanced light source */}
            <pointLight 
              position={[x, 14, -65]} 
              intensity={2.5} 
              distance={30}
              color="#fbbf24"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
          </group>
        );
      })}
      
      {/* Enhanced security cameras with better positioning */}
      <SecurityCamera position={[-25, 0, -50]} />
      <SecurityCamera position={[25, 0, -50]} />
      <SecurityCamera position={[-40, 0, -10]} />
      <SecurityCamera position={[40, 0, -10]} />
      <SecurityCamera position={[-25, 0, 30]} />
      <SecurityCamera position={[25, 0, 30]} />
      <SecurityCamera position={[0, 0, 50]} />
      
      {/* Modern payment kiosks with digital displays */}
      {[-18, 18].map((x, i) => (
        <group key={i} position={[x, 0, -55]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[1, 3.6, 0.8]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Digital screen */}
          <mesh position={[0, 2.5, -0.35]} castShadow>
            <boxGeometry args={[0.8, 1.2, 0.1]} />
            <meshStandardMaterial color="#000000" emissive="#0ea5e9" emissiveIntensity={0.4} />
          </mesh>
          {/* Card reader */}
          <mesh position={[0, 1.5, -0.35]} castShadow>
            <boxGeometry args={[0.3, 0.2, 0.1]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
          </mesh>
          <Html position={[0, 4, 0]} center>
           
          </Html>
        </group>
      ))}
      
      {/* Enhanced building structures */}
      {/* Main office complex */}
      <mesh position={[-70, 12, 0]} castShadow receiveShadow>
        <boxGeometry args={[25, 24, 140]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Modern glass office building */}
      <mesh position={[70, 18, -25]} castShadow receiveShadow>
        <boxGeometry args={[18, 36, 90]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
      </mesh>
      
      {/* Shopping center */}
      <mesh position={[0, 8, 75]} castShadow receiveShadow>
        <boxGeometry args={[120, 16, 20]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>
      
      {/* Enhanced windows with realistic patterns */}
      {Array.from({ length: 24 }).map((_, i) => {
        const floor = Math.floor(i / 6);
        const window = i % 6;
        return (
          <mesh key={i} position={[62, 6 + floor * 6, -70 + window * 15]} castShadow>
            <boxGeometry args={[0.3, 4, 8]} />
            <meshStandardMaterial 
              color="#87ceeb" 
              transparent 
              opacity={0.8}
              emissive="#87ceeb"
              emissiveIntensity={0.1}
            />
          </mesh>
        );
      })}
      
      {/* Landscaping with enhanced trees */}
      {[
        [-50, 0, -80], [50, 0, -80], [-50, 0, 80], [50, 0, 80],
        [-90, 0, -40], [-90, 0, 0], [-90, 0, 40], 
        [90, 0, -40], [90, 0, 0], [90, 0, 40],
        [-25, 0, -75], [25, 0, -75], [0, 0, 85]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Enhanced tree trunk with texture */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.9, 5, 12]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
          {/* Tree crown with multiple layers */}
          <mesh position={[0, 7, 0]} castShadow>
            <sphereGeometry args={[3.5, 12, 12]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </mesh>
          <mesh position={[0, 8.5, 0]} castShadow>
            <sphereGeometry args={[2.8, 10, 10]} />
            <meshStandardMaterial color="#32CD32" roughness={0.7} />
          </mesh>
        </group>
      ))}
      
      {/* Enhanced waste management */}
      {[
        [-30, 0, -60], [30, 0, -60], [-45, 0, -10], [45, 0, -10],
        [-30, 0, 40], [30, 0, 40], [0, 0, 65]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.55, 2.4, 16]} />
            <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.6} />
          </mesh>
          <mesh position={[0, 2.6, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 16]} />
            <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Recycling symbol */}
          <Html position={[0, 1.5, 0.5]} center>
            <div className="us-bk-recycle-symbol">♻️</div>
          </Html>
        </group>
      ))}
      
      {/* Enhanced fire safety equipment */}
      {[[-60, 0, -30], [60, 0, -30], [-60, 0, 30], [60, 0, 30]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 2, 16]} />
            <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.4, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.4, 8]} />
            <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-0.4, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.4, 8]} />
            <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Fire department connection */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.6, 16]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      
      {/* Enhanced entrance and exit gates */}
      <ParkingGate position={[0, 0, -65]} type="entrance" isOpen={true} />
      <ParkingGate position={[0, 0, 65]} type="exit" isOpen={true} />
      
      {/* Emergency exits with better signage */}
      {[[-80, 0, 0], [80, 0, 0]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[2.5, 4, 0.3]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 2, 0.2]} castShadow>
            <boxGeometry args={[2.2, 3.5, 0.1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <Html position={[0, 4.5, 0]} center>
            <div className="us-bk-emergency-sign">🚨 EMERGENCY EXIT</div>
          </Html>
        </group>
      ))}
      
      {/* Pedestrian areas with enhanced details */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -55 + Math.random() * 110;
        const z = -60 + Math.random() * 120;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 1.8, 8]} />
              <meshStandardMaterial color="#4b5563" />
            </mesh>
            <mesh position={[0, 2.7, 0]} castShadow>
              <sphereGeometry args={[0.22, 8, 8]} />
              <meshStandardMaterial color="#f0d0b0" />
            </mesh>
            {/* Simple clothing */}
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.8, 8]} />
              <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
            </mesh>
          </group>
        );
      })}
      
      {/* Weather protection canopies */}
      {[[-40, 0, -35], [40, 0, -35], [-40, 0, 35], [40, 0, 35]].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Support pillars */}
          {[[-8, 0, -4], [8, 0, -4], [-8, 0, 4], [8, 0, 4]].map((pillarPos, j) => (
            <mesh key={j} position={pillarPos.concat([4])} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 8, 12]} />
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          {/* Canopy roof */}
          <mesh position={[0, 8.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[18, 0.3, 10]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.3} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </>
  );
};

// Main 3D Scene Component with enhanced realism and better slot arrangement
const Parking3DScene = ({ 
  slots, 
  bookedSlots, 
  onSlotChange, 
  getSlotLabel, 
  isSlotBooked,
  vehicleNumber
}) => {
  // Enhanced parking lot layout with realistic sections
  const createParkingLayout = () => {
    const sections = [];
    const totalSlots = slots.length;
    let slotIndex = 0;
    
    // Section 1: Left side - Regular parking (angled)
    const leftSectionSlots = Math.floor(totalSlots * 0.35);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < Math.ceil(leftSectionSlots / 4); col++) {
        if (slotIndex >= leftSectionSlots) break;
        
        const x = -45 + col * 5.5;
        const z = -30 + row * 8;
        const slotType = col === 0 ? 'handicap' : (col % 3 === 1 ? 'compact' : 'regular');
        
        sections.push({
          index: slotIndex,
          position: [x, 0, z],
          orientation: 'horizontal',
          slotType,
          sectionType: 'angled'
        });
        slotIndex++;
      }
    }
    
    // Section 2: Center - Premium parking (straight)
    const centerSectionSlots = Math.floor(totalSlots * 0.25);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < Math.ceil(centerSectionSlots / 3); col++) {
        if (slotIndex >= leftSectionSlots + centerSectionSlots) break;
        
        const x = -15 + col * 6;
        const z = -25 + row * 10;
        const slotType = 'premium';
        
        sections.push({
          index: slotIndex,
          position: [x, 0, z],
          orientation: 'horizontal',
          slotType,
          sectionType: 'standard'
        });
        slotIndex++;
      }
    }
    
    // Section 3: Right side - Mixed parking
    const rightSectionSlots = totalSlots - slotIndex;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < Math.ceil(rightSectionSlots / 4); col++) {
        if (slotIndex >= totalSlots) break;
        
        const x = 25 + col * 5.5;
        const z = -30 + row * 8;
        const slotType = row === 0 ? 'handicap' : (col % 2 === 0 ? 'compact' : 'regular');
        
        sections.push({
          index: slotIndex,
          position: [x, 0, z],
          orientation: 'horizontal',
          slotType,
          sectionType: 'standard'
        });
        slotIndex++;
      }
    }
    
    return sections;
  };

  const parkingLayout = createParkingLayout();

  return (
    <>
      {/* Enhanced lighting setup for better realism */}
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      
      {/* Main directional light (sun) with enhanced shadows */}
      <directionalLight 
        position={[40, 50, 30]} 
        intensity={1.8} 
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-camera-near={0.1}
        shadow-camera-far={250}
        shadow-bias={-0.0001}
      />
      
      {/* Secondary lighting for better illumination */}
      <directionalLight position={[-30, 40, -20]} intensity={0.6} />
      <directionalLight position={[30, 40, 20]} intensity={0.6} />
      <pointLight position={[0, 25, 0]} intensity={1.5} distance={80} />
      
      {/* Fog for atmospheric effect */}
      <fog attach="fog" args={['#f0f0f0', 80, 200]} />
      
      {/* Enhanced parking lot environment */}
      <ParkingLotEnvironment />

      {/* Parking slots with enhanced layout */}
      {parkingLayout.map((slot) => {
        if (slot.index >= slots.length) return null;
        
        return (
          <ParkingSlot
            key={slot.index}
            position={slot.position}
            index={slot.index}
            isSelected={slots[slot.index]}
            isBooked={isSlotBooked(slot.index)}
            onSlotClick={onSlotChange}
            slotLabel={getSlotLabel(slot.index)}
            orientation={slot.orientation}
            slotType={slot.slotType}
            sectionType={slot.sectionType}
            vehicleNumber={vehicleNumber}
          />
        );
      })}

      {/* Enhanced camera controls with better limits */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={15}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        autoRotate={false}
        autoRotateSpeed={0.3}
        enableDamping={true}
        dampingFactor={0.08}
        panSpeed={0.8}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
      />
    </>
  );
};

// Loading Component
const LoadingSpinner = () => {
  return (
    <div className="us-bk-loading-container">
      <div className="us-bk-loading-spinner">
        <Loader2 size={40} className="us-bk-spinner-icon" />
      </div>
      <p className="us-bk-loading-text">Loading Ultra-Realistic Parking Center...</p>
    </div>
  );
};

// Error Component
const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="us-bk-error-overlay">
      <div className="us-bk-error-card">
        <AlertCircle size={48} className="us-bk-error-icon" />
        <h3 className="us-bk-error-title">Oops! Something went wrong</h3>
        <p className="us-bk-error-message">{error}</p>
        <button className="us-bk-retry-button" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
};

// Enhanced Legend Component
const Legend = () => {
  return (
    <div className="us-bk-legend">
      <h4 className="us-bk-legend-title">
        <Info size={25} />
        Parking Legend
      </h4>
      <div className="us-bk-legend-item">
        <div className="us-bk-legend-color us-bk-legend-available"></div>
        <span>Available slots</span>
      </div>
      <div className="us-bk-legend-item">
        <div className="us-bk-legend-color us-bk-legend-selected"></div>
        <span>Your selection</span>
      </div>
      <div className="us-bk-legend-item">
        <div className="us-bk-legend-color us-bk-legend-booked"></div>
        <span>Already booked</span>
      </div>
      <div className="us-bk-legend-item">
        <div className="us-bk-legend-color us-bk-legend-handicap"></div>
        <span>Handicap accessible</span>
      </div>
      <div className="us-bk-legend-item">
        <div className="us-bk-legend-color us-bk-legend-compact"></div>
        <span>Compact vehicles</span>
      </div>
    </div>
  );
};

// Enhanced Controls Guide Component
const ControlsGuide = () => {
  return (
    <div className="us-bk-controls-guide">
      <h4 className="us-bk-controls-title">
        <MousePointer size={20} />
        3D Navigation
      </h4>
      <div className="us-bk-control-item">
        <RotateCw size={20} />
        <span>Drag to rotate view</span>
      </div>
      <div className="us-bk-control-item">
        <ZoomIn size={20} />
        <span>Scroll to zoom in/out</span>
      </div>
      <div className="us-bk-control-item">
        <MousePointer size={20} />
        <span>Click green slots to reserve</span>
      </div>
      <div className="us-bk-control-item">
        <Car size={20} />
        <span>Cars drive from entrance!</span>
      </div>
      <p className="us-bk-controls-tip">
        <SparklesIcon size={20} />
        Watch realistic car animations and parking center features!
      </p>
    </div>
  );
};

// Main ParkingBooking Component
const ParkingBooking = () => {
  const location = useLocation();
  const { city } = location.state || {};

  const [date, setDate] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [vehicleno, setVehicle] = useState('');
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookedSlotDetails, setBookedSlotDetails] = useState({});
  const [totalSlots, setTotalSlots] = useState(0);
  const [pricePerHour, setPricePerHour] = useState(10);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  const fetchData = () => {
    setIsLoading(true);
    setError(null);
    axios.get('https://nammaspot-backend.onrender.com/getseat', { params: { city } })
      .then(result => {
        console.log('Result from backend:', result.data);
        if (result.data && result.data.seat !== null) {
          setTotalSlots(result.data.seat);
          setSlots(Array(result.data.seat).fill(false));
          setBookedSlots(result.data.slots || []);
          setBookedSlotDetails(result.data.slotDetails || {});
          setPricePerHour(result.data.price);
        } else {
          setError('Seat information is not available for this city.');
        }
        setIsLoading(false);
        setIsRetrying(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
        setIsRetrying(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchData();
  };

  const handleSlotChange = (index) => {
    if (isSlotBooked(index)) {
      return;
    }
    const newSlots = [...slots];
    newSlots[index] = !newSlots[index];
    setSlots(newSlots);
  };

  const calculateDuration = () => {
    if (!entryTime || !exitTime) return 0;
    
    const startTime = new Date(`1970-01-01T${entryTime}:00`);
    const endTime = new Date(`1970-01-01T${exitTime}:00`);
    
    let durationInHours = (endTime - startTime) / 3600000;
    if (durationInHours < 0) {
      durationInHours += 24;
    }
    
    return Math.ceil(durationInHours);
  };

  const calculateTotalAmount = () => {
    const duration = calculateDuration();
    const selectedSlots = slots.filter(slot => slot).length;
    return selectedSlots * pricePerHour * duration;
  };

  const calculateSelectedSlots = () => {
    return slots.filter(slot => slot).length;
  };

  const getSlotLabel = (index) => {
    return (index + 1).toString().padStart(3, '0');
  };

  const isSlotBooked = (index) => {
    return bookedSlots.includes(getSlotLabel(index));
  };

  const getBookedVehicleNumber = (index) => {
    const slotLabel = getSlotLabel(index);
    return bookedSlotDetails[slotLabel]?.vehicleNumber || '';
  };

  const handleProceedToPayment = () => {
    const selectedSlotNumbers = slots
      .map((slot, index) => (slot ? getSlotLabel(index) : null))
      .filter(slot => slot !== null);

    navigate('/confirmbooking', {
      state: {
        slotNumbers: selectedSlotNumbers,
        entryTime,
        exitTime,
        date,
        vehicleno,
        totalAmount: calculateTotalAmount(),
        city,
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="us-bk-container">
      {error && (
        <ErrorMessage error={error} onRetry={handleRetry} />
      )}

      {/* Enhanced Side Panel */}
      <div className="us-bk-side-panel">
        <div className="us-bk-panel-header">
          <div className="us-bk-header-icon-container">
            <CarTaxiFront size={50} className="us-bk-header-icon" />
          </div>
          <h2 className="us-bk-panel-title">Smart Parking</h2>
          <div className="us-bk-header-decoration"></div>
        </div>
        
        <div className="us-bk-form-group">
          <label className="us-bk-form-label">
            <MapPin size={30} color='#007AFF'/>
            Premium Location:
          </label>
          <input
            className="us-bk-form-input"
            value={city}
            readOnly
          />
          <span className="us-bk-price-tag">
            {/* <DollarSign size={16} /> */}
            ₹{pricePerHour}/hour • Secure • 24/7 Monitored
          </span>
        </div>

        <div className="us-bk-form-group">
          <label className="us-bk-form-label">
            <Car size={30} color='#007AFF'/>
            Vehicle Registration:
          </label>
          <input
            className="us-bk-form-input"
            type="text"
            placeholder="Enter vehicle number (e.g., MH01AB1234)"
            value={vehicleno}
            onChange={(e) => setVehicle(e.target.value)}
            maxLength={10}
          />
        </div>

        <div className="us-bk-form-group">
          <label className="us-bk-form-label">
            <Calendar size={30} color='#007AFF'/>
            Parking Date:
          </label>
          <input
            className="us-bk-form-input"
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="us-bk-time-grid">
          <div className="us-bk-form-group">
            <label className="us-bk-form-label">
              <Clock size={30} color='#007AFF'/>
              Entry Time:
            </label>
            <input
              className="us-bk-form-input"
              type="time"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
            />
          </div>

          <div className="us-bk-form-group">
            <label className="us-bk-form-label">
              <Clock size={30} color='#007AFF'/>
              Exit Time:
            </label>
            <input
              className="us-bk-form-input"
              type="time"
              value={exitTime}
              onChange={(e) => setExitTime(e.target.value)}
            />
          </div>
        </div>

        <div className="us-bk-summary-card">
          <div className="us-bk-summary-header">
            <Shield size={30} />
            <span>Booking Summary</span>
          </div>
          <div className="us-bk-summary-item">
            <span>Selected Slots:</span>
            <span className="us-bk-summary-value">
              {calculateSelectedSlots()} slots
            </span>
          </div>
          <div className="us-bk-summary-item">
            <span>Duration:</span>
            <span className="us-bk-summary-value">
              {calculateDuration()} hours
            </span>
          </div>
          <div className="us-bk-summary-item">
            <span>Security Features:</span>
            <span className="us-bk-summary-value">✓ CCTV • ✓ Guards</span>
          </div>
          <div className="us-bk-total-amount">
            <span>Total Amount:</span>
            <span>₹{calculateTotalAmount().toFixed(2)}</span>
          </div>
        </div>

        <Legend />

        <button
          onClick={handleProceedToPayment}
          disabled={calculateSelectedSlots() === 0 || !date || !entryTime || !exitTime || !vehicleno}
          className="us-bk-book-button"
        >
          <span>Reserve Parking ({calculateSelectedSlots()} slots)</span>
          <ArrowRight size={30} />
        </button>
        
        <div className="us-bk-features-list">
          <div className="us-bk-feature-item">
            <Camera size={28} />
            <span>24/7 Security Monitoring</span>
          </div>
          <div className="us-bk-feature-item">
            <Zap size={28} />
            <span>EV Charging Available</span>
          </div>
          <div className="us-bk-feature-item">
            <Users size={28} />
            <span>Covered Parking Options</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="us-bk-canvas-container">
        <Canvas
          camera={{ position: [40, 30, 40], fov: 60 }}
          shadows
          gl={{ antialias: true, alpha: false }}
        >
          <Parking3DScene
            slots={slots}
            bookedSlots={bookedSlots}
            onSlotChange={handleSlotChange}
            getSlotLabel={getSlotLabel}
            isSlotBooked={isSlotBooked}
            vehicleNumber={vehicleno}
          />
        </Canvas>
      </div>

      {/* Enhanced Controls Guide */}
      {/* <ControlsGuide /> */}

      {/* Navigation Help */}
      <div className="us-bk-navigation-help">
        <Navigation size={26} />
        <span>Navigate the most realistic parking center simulation</span>
      </div>

      {/* Live status indicator */}
      <div className="us-bk-live-status">
        <div className="us-bk-live-dot"></div>
        <span>Live 3D Environment</span>
      </div>
    </div>
  );
};

export default ParkingBooking;