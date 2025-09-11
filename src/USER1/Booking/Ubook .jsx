import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import * as THREE from 'three';
import "./Ubook.css";

// Car Model Component
const CarModel = ({ position, visible }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && visible) {
      // Subtle animation for the car
      meshRef.current.rotation.y += 0.01;
    }
  });

  if (!visible) return null;

  return (
    <group position={position} ref={meshRef}>
      {/* Car body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
      {/* Car top */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.2, 0.3, 2]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.7, 0.2, 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.7, 0.2, 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.7, 0.2, -1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.7, 0.2, -1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

// Individual 3D Parking Slot Component
const ParkingSlot = ({ 
  position, 
  index, 
  isSelected, 
  isBooked, 
  onSlotClick, 
  slotLabel,
  hasCar 
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showCar, setShowCar] = useState(false);

  // Animation frame for pulsing effect on booked slots
  useFrame((state) => {
    if (meshRef.current) {
      if (isBooked) {
        // Pulsing animation for booked slots
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
        meshRef.current.scale.y = pulse;
      } else if (hovered && !isBooked) {
        // Lift effect on hover
        meshRef.current.position.y = position[1] + 0.2;
      } else {
        // Reset to normal position
        meshRef.current.position.y = position[1];
        meshRef.current.scale.y = isSelected ? 1.1 : 1;
      }
    }
  });

  // Animate car appearing when selected
  useEffect(() => {
    if (isSelected && !isBooked) {
      const timer = setTimeout(() => setShowCar(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowCar(false);
    }
  }, [isSelected, isBooked]);

  const getSlotColor = () => {
    if (isBooked) return '#ff4444'; // Red for booked
    if (isSelected) return '#4444ff'; // Blue for selected
    if (hovered) return '#44ff44'; // Bright green for hover
    return '#22aa22'; // Default green for available
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isBooked) {
      onSlotClick(index);
    }
  };

  return (
    <group position={position}>
      {/* Main slot box */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => !isBooked && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4, 0.2, 2]} />
        <meshStandardMaterial 
          color={getSlotColor()} 
          transparent={isBooked}
          opacity={isBooked ? 0.7 : 1}
          emissive={isBooked ? '#440000' : (hovered ? '#002200' : '#000000')}
          emissiveIntensity={isBooked ? 0.3 : (hovered ? 0.2 : 0)}
        />
      </mesh>
      
      {/* Car model for selected slot */}
      <CarModel position={[0, 0.5, 0]} visible={showCar} />
      
      {/* Slot number label */}
      <Html position={[0, 0.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          {slotLabel}
        </div>
      </Html>
      
      {/* Parking lines */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[4.1, 0.01, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.01, 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4.1, 0.01, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-2, 0.01, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.01, 2.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[2, 0.01, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.01, 2.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Main 3D Scene Component
const Parking3DScene = ({ 
  slots, 
  bookedSlots, 
  onSlotChange, 
  getSlotLabel, 
  isSlotBooked 
}) => {
  const slotsPerRow = 5;
  const slotSpacing = 5;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      {/* Ground */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Parking slots */}
      {slots.map((slot, index) => {
        const row = Math.floor(index / slotsPerRow);
        const col = index % slotsPerRow;
        const x = (col - slotsPerRow / 2 + 0.5) * slotSpacing;
        const z = (row - Math.ceil(slots.length / slotsPerRow) / 2 + 0.5) * slotSpacing;
        
        return (
          <ParkingSlot
            key={index}
            position={[x, 0, z]}
            index={index}
            isSelected={slot}
            isBooked={isSlotBooked(index)}
            onSlotClick={onSlotChange}
            slotLabel={getSlotLabel(index)}
          />
        );
      })}

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
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
  const [totalSlots, setTotalSlots] = useState(0);
  const [pricePerHour, setPricePerHour] = useState(10);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://nammaspot-backend.onrender.com/getseat', { params: { city } })
      .then(result => {
        console.log('Result from backend:', result.data);
        if (result.data && result.data.seat !== null) {
          setTotalSlots(result.data.seat);
          setSlots(Array(result.data.seat).fill(false));
          setBookedSlots(result.data.slots || []);
          setPricePerHour(result.data.price);
        } else {
          setError('Seat information is not available for this city.');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      });
  }, [city]);

  const handleSlotChange = (index) => {
    if (bookedSlots.includes(getSlotLabel(index))) {
      return;
    }
    const newSlots = [...slots];
    newSlots[index] = !newSlots[index];
    setSlots(newSlots);
  };

  // Calculate duration in hours (rounding up partial hours)
  const calculateDuration = () => {
    if (!entryTime || !exitTime) return 0;
    
    const startTime = new Date(`1970-01-01T${entryTime}:00`);
    const endTime = new Date(`1970-01-01T${exitTime}:00`);
    
    // Handle case where exit time is before entry time (overnight)
    let durationInHours = (endTime - startTime) / 3600000;
    if (durationInHours < 0) {
      durationInHours += 24; // Add 24 hours for overnight parking
    }
    
    // Round up to the nearest hour
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
    return (index + 1).toString();
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

  const isSlotBooked = (index) => {
    return bookedSlots.includes(getSlotLabel(index));
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid rgba(255,255,255,0.3)',
            borderTop: '5px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading 3D Parking Lot...
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ff4444',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Side Panel with Form */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '320px',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
        zIndex: 100,
        overflowY: 'auto'
      }}>
        <h2 style={{ 
          margin: '0 0 25px 0', 
          color: '#333', 
          fontSize: '24px',
          fontWeight: '700'
        }}>
          🚗 Book Parking
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#555',
            fontSize: '14px'
          }}>
            📍 Location:
          </label>
          <input
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#f8f9fa',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            value={city}
            readOnly
          />
          <span style={{ 
            display: 'block', 
            marginTop: '8px', 
            color: '#667eea', 
            fontWeight: '700',
            fontSize: '16px'
          }}>
            💰 ₹{pricePerHour}/hour
          </span>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#555',
            fontSize: '14px'
          }}>
            🚙 Vehicle Number:
          </label>
          <input
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            type="text"
            placeholder="Enter vehicle number"
            value={vehicleno}
            onChange={(e) => setVehicle(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#555',
            fontSize: '14px'
          }}>
            📅 Date:
          </label>
          <input
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#555',
              fontSize: '14px'
            }}>
              🕐 Entry:
            </label>
            <input
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              type="time"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#555',
            fontSize: '14px'
          }}>
            🕐 Exit:
          </label>
          <input
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            type="time"
            value={exitTime}
            onChange={(e) => setExitTime(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>
      </div>

      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
        borderRadius: '12px',
        marginBottom: '25px',
        border: '2px solid #e1e8ff'
      }}>
        <div style={{ 
          marginBottom: '12px', 
          fontSize: '14px', 
          color: '#333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🎯 Selected Slots:</span>
          <span style={{ fontWeight: '700', fontSize: '16px' }}>
            {calculateSelectedSlots()}
          </span>
        </div>
        <div style={{ 
          marginBottom: '12px', 
          fontSize: '14px', 
          color: '#333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⏱️ Duration:</span>
          <span style={{ fontWeight: '700', fontSize: '16px' }}>
            {calculateDuration()} hours
          </span>
        </div>
        <div style={{ 
          fontSize: '18px', 
          color: '#667eea', 
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>💳 Total Amount:</span>
          <span>₹{calculateTotalAmount().toFixed(2)}</span>
        </div>
      </div>

      <div style={{ 
        marginBottom: '25px', 
        fontSize: '12px', 
        color: '#666',
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '10px', color: '#333' }}>
          Legend:
        </div>
        <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: '#22aa22', 
            borderRadius: '2px', 
            marginRight: '8px' 
          }}></div>
          Available slots
        </div>
        <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: '#4444ff', 
            borderRadius: '2px', 
            marginRight: '8px' 
          }}></div>
          Your selection (with car)
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: '#ff4444', 
            borderRadius: '2px', 
            marginRight: '8px' 
          }}></div>
          Already booked
        </div>
      </div>

      <button
        onClick={handleProceedToPayment}
        disabled={calculateSelectedSlots() === 0 || !date || !entryTime || !exitTime || !vehicleno}
        style={{
          width: '100%',
          padding: '15px',
          background: calculateSelectedSlots() > 0 && date && entryTime && exitTime && vehicleno
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: calculateSelectedSlots() > 0 && date && entryTime && exitTime && vehicleno ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          transform: 'translateY(0)',
          boxShadow: calculateSelectedSlots() > 0 && date && entryTime && exitTime && vehicleno
            ? '0 4px 15px rgba(102, 126, 234, 0.3)' 
            : 'none'
        }}
        onMouseOver={(e) => {
          if (calculateSelectedSlots() > 0 && date && entryTime && exitTime && vehicleno) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseOut={(e) => {
          if (calculateSelectedSlots() > 0 && date && entryTime && exitTime && vehicleno) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        🚀 Book Now ({calculateSelectedSlots()} slots)
      </button>
    </div>

    {/* 3D Canvas */}
    <Canvas
      style={{ width: 'calc(100vw - 320px)', height: '100vh' }}
      camera={{ position: [15, 15, 15], fov: 75 }}
      shadows
    >
      <Parking3DScene
        slots={slots}
        bookedSlots={bookedSlots}
        onSlotChange={handleSlotChange}
        getSlotLabel={getSlotLabel}
        isSlotBooked={isSlotBooked}
      />
    </Canvas>

    {/* Instructions overlay */}
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      fontSize: '14px',
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ 
        fontWeight: '700', 
        marginBottom: '10px',
        color: '#667eea',
        fontSize: '16px'
      }}>
        🎮 3D Controls:
      </div>
      <div style={{ marginBottom: '5px' }}>🖱️ Click and drag to rotate view</div>
      <div style={{ marginBottom: '5px' }}>🔍 Scroll to zoom in/out</div>
      <div style={{ marginBottom: '5px' }}>👆 Click on green slots to select</div>
      <div style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}>
        💡 Tip: Cars will appear in your selected slots!
      </div>
    </div>
  </div>
  );
};

export default ParkingBooking;