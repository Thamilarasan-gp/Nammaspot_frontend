import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Parking slot data
const parkingSlots = [
  // Floor 1
  { id: 1, floor: 1, position: [-8, 0, -6], isAvailable: true, isReserved: false },
  { id: 2, floor: 1, position: [-8, 0, -2], isAvailable: false, isReserved: false },
  { id: 3, floor: 1, position: [-8, 0, 2], isAvailable: true, isReserved: true },
  { id: 4, floor: 1, position: [-8, 0, 6], isAvailable: false, isReserved: false },
  { id: 5, floor: 1, position: [0, 0, -6], isAvailable: true, isReserved: false },
  { id: 6, floor: 1, position: [0, 0, -2], isAvailable: true, isReserved: false },
  { id: 7, floor: 1, position: [0, 0, 2], isAvailable: false, isReserved: false },
  { id: 8, floor: 1, position: [0, 0, 6], isAvailable: true, isReserved: true },
  { id: 9, floor: 1, position: [8, 0, -6], isAvailable: false, isReserved: false },
  { id: 10, floor: 1, position: [8, 0, -2], isAvailable: true, isReserved: false },
  { id: 11, floor: 1, position: [8, 0, 2], isAvailable: false, isReserved: false },
  { id: 12, floor: 1, position: [8, 0, 6], isAvailable: true, isReserved: false },
  
  // Floor 2
  { id: 13, floor: 2, position: [-8, 4, -6], isAvailable: true, isReserved: false },
  { id: 14, floor: 2, position: [-8, 4, -2], isAvailable: true, isReserved: false },
  { id: 15, floor: 2, position: [-8, 4, 2], isAvailable: false, isReserved: false },
  { id: 16, floor: 2, position: [-8, 4, 6], isAvailable: true, isReserved: false },
  { id: 17, floor: 2, position: [0, 4, -6], isAvailable: false, isReserved: false },
  { id: 18, floor: 2, position: [0, 4, -2], isAvailable: true, isReserved: true },
  { id: 19, floor: 2, position: [0, 4, 2], isAvailable: false, isReserved: false },
  { id: 20, floor: 2, position: [0, 4, 6], isAvailable: true, isReserved: false },
  { id: 21, floor: 2, position: [8, 4, -6], isAvailable: true, isReserved: false },
  { id: 22, floor: 2, position: [8, 4, -2], isAvailable: false, isReserved: false },
  { id: 23, floor: 2, position: [8, 4, 2], isAvailable: true, isReserved: false },
  { id: 24, floor: 2, position: [8, 4, 6], isAvailable: false, isReserved: false },
  
  // Floor 3
  { id: 25, floor: 3, position: [-8, 8, -6], isAvailable: true, isReserved: false },
  { id: 26, floor: 3, position: [-8, 8, -2], isAvailable: false, isReserved: false },
  { id: 27, floor: 3, position: [-8, 8, 2], isAvailable: true, isReserved: false },
  { id: 28, floor: 3, position: [-8, 8, 6], isAvailable: true, isReserved: false },
  { id: 29, floor: 3, position: [0, 8, -6], isAvailable: false, isReserved: false },
  { id: 30, floor: 3, position: [0, 8, -2], isAvailable: true, isReserved: true },
  { id: 31, floor: 3, position: [0, 8, 2], isAvailable: false, isReserved: false },
  { id: 32, floor: 3, position: [0, 8, 6], isAvailable: true, isReserved: false },
  { id: 33, floor: 3, position: [8, 8, -6], isAvailable: true, isReserved: false },
  { id: 34, floor: 3, position: [8, 8, -2], isAvailable: false, isReserved: false },
  { id: 35, floor: 3, position: [8, 8, 2], isAvailable: true, isReserved: false },
  { id: 36, floor: 3, position: [8, 8, 6], isAvailable: false, isReserved: false },
];

// Parking Slot Component
const ParkingSlot = ({ slot, onClick, isSelected }) => {
  const meshRef = useRef();
  
  // Determine slot color based on status
  const getSlotColor = () => {
    if (slot.isReserved) return '#ffcc00'; // Yellow for reserved
    return slot.isAvailable ? '#4caf50' : '#f44336'; // Green for available, red for occupied
  };
  
  // Handle click events
  const handleClick = (event) => {
    event.stopPropagation();
    onClick(slot);
  };
  
  return (
    <group position={slot.position}>
      {/* Parking slot box */}
      <mesh 
        ref={meshRef} 
        onClick={handleClick}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[4, 0.2, 2]} />
        <meshStandardMaterial 
          color={isSelected ? '#2196f3' : getSlotColor()} 
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      
      {/* Slot number label */}
      <Float speed={5} rotationIntensity={0.1} floatIntensity={0.5}>
        <Text
          position={[0, 0.5, 0]}
          color="#333"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          {slot.id}
        </Text>
      </Float>
    </group>
  );
};

// Floor Component
const Floor = ({ level, slots, onSlotClick, selectedSlot, isVisible }) => {
  const floorSlots = slots.filter(slot => slot.floor === level);
  
  return (
    <group visible={isVisible}>
      {floorSlots.map(slot => (
        <ParkingSlot 
          key={slot.id} 
          slot={slot} 
          onClick={onSlotClick}
          isSelected={selectedSlot?.id === slot.id}
        />
      ))}
      
      {/* Floor plane */}
      <mesh position={[0, level * 4 - 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial 
          color="#78909c" 
          opacity={0.8} 
          transparent 
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      
      {/* Floor label */}
      <Text
        position={[-10, level * 4 - 1.5, 0]}
        color="#333"
        fontSize={1}
        anchorX="left"
        anchorY="middle"
      >
        Floor {level}
      </Text>
    </group>
  );
};

// Ground Plane with Grid
const Ground = () => {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <gridHelper args={[40, 40, '#aaa', '#aaa']} position={[0, 0, 0]} />
    </>
  );
};

// Lighting Setup
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
    </>
  );
};

// Main ParkingLot Component
const ParkingLot = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visibleFloors, setVisibleFloors] = useState([1, 2, 3]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'single'
  
  // Handle slot selection
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };
  
  // Toggle floor visibility
  const toggleFloorVisibility = (floor) => {
    if (visibleFloors.includes(floor)) {
      if (visibleFloors.length > 1) {
        setVisibleFloors(visibleFloors.filter(f => f !== floor));
      }
    } else {
      setVisibleFloors([...visibleFloors, floor]);
    }
  };
  
  // Change view mode
  const changeViewMode = (mode) => {
    setViewMode(mode);
    if (mode === 'all') {
      setVisibleFloors([1, 2, 3]);
    }
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [15, 15, 15], fov: 50 }}>
        <color attach="background" args={['#f0f0f0']} />
        <Suspense fallback={null}>
          <Lights />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
          <Ground />
          
          {/* Render floors based on visibility */}
          {[1, 2, 3].map(floor => (
            <Floor 
              key={floor}
              level={floor}
              slots={parkingSlots}
              onSlotClick={handleSlotClick}
              selectedSlot={selectedSlot}
              isVisible={visibleFloors.includes(floor)}
            />
          ))}
        </Suspense>
      </Canvas>
      
      {/* UI Controls */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: '250px'
      }}>
        <h3 style={{ marginTop: 0 }}>Parking Controls</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <h4>View Mode:</h4>
          <button 
            onClick={() => changeViewMode('all')}
            style={{ 
              marginRight: '10px', 
              background: viewMode === 'all' ? '#2196f3' : '#ddd',
              color: viewMode === 'all' ? 'white' : 'black'
            }}
          >
            All Floors
          </button>
          <button 
            onClick={() => changeViewMode('single')}
            style={{ 
              background: viewMode === 'single' ? '#2196f3' : '#ddd',
              color: viewMode === 'single' ? 'white' : 'black'
            }}
          >
            Single Floor
          </button>
        </div>
        
        {viewMode === 'single' && (
          <div>
            <h4>Show Floors:</h4>
            {[1, 2, 3].map(floor => (
              <label key={floor} style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  checked={visibleFloors.includes(floor)}
                  onChange={() => toggleFloorVisibility(floor)}
                  style={{ marginRight: '8px' }}
                />
                Floor {floor}
              </label>
            ))}
          </div>
        )}
        
        {/* Selected slot details */}
        {selectedSlot && (
          <div style={{ marginTop: '15px', padding: '10px', background: '#e3f2fd', borderRadius: '5px' }}>
            <h4>Selected Slot:</h4>
            <p>ID: {selectedSlot.id}</p>
            <p>Floor: {selectedSlot.floor}</p>
            <p>Status: 
              <span style={{ 
                color: selectedSlot.isReserved ? '#ffcc00' : 
                      selectedSlot.isAvailable ? '#4caf50' : '#f44336',
                fontWeight: 'bold'
              }}>
                {selectedSlot.isReserved ? ' Reserved' : 
                 selectedSlot.isAvailable ? ' Available' : ' Occupied'}
              </span>
            </p>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <p>• Click on a parking slot to see details</p>
        <p>• Drag to rotate, scroll to zoom</p>
        <p>• Use controls to toggle floor visibility</p>
      </div>
    </div>
  );
};

export default ParkingLot;