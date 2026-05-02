import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Generate unique gesture based on word
function generateWordGesture(word) {
  if (!word) return null;
  
  // Hash the word to get consistent gesture
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = ((hash << 5) - hash) + word.charCodeAt(i);
    hash = hash & hash;
  }
  
  const absHash = Math.abs(hash);
  
  // Generate more varied finger positions (0 to 1 with decimals)
  const fingerValues = [
    (absHash % 100) / 100,           // thumb
    ((absHash >> 2) % 100) / 100,    // index
    ((absHash >> 4) % 100) / 100,    // middle
    ((absHash >> 6) % 100) / 100,    // ring
    ((absHash >> 8) % 100) / 100     // pinky
  ];
  
  // Generate gesture parameters based on word
  return {
    // Finger positions (0 = closed, 1 = extended)
    fingers: fingerValues,
    // Hand rotation - more dramatic
    rotation: [
      ((absHash % 13) - 6) * 0.4,      // x rotation
      ((absHash % 11) - 5) * 0.5,      // y rotation
      ((absHash % 17) - 8) * 0.3       // z rotation
    ],
    // Hand position - more varied
    position: [
      ((absHash % 19) - 9) * 0.15,     // x position
      ((absHash % 23) - 11) * 0.12,    // y position
      ((absHash % 7) - 3) * 0.1        // z position
    ],
    // Animation type
    motion: ['wave', 'circle', 'updown', 'shake', 'twist'][absHash % 5],
    // Speed
    speed: 1 + (absHash % 5) * 0.4,
    // Scale variation
    scale: 0.8 + ((absHash % 7) * 0.1)
  };
}

const HandAvatar3D = ({ word }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const handRef = useRef(null);
  const animationRef = useRef(null);
  const gestureRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x0a0a0f, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 0.4);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    // Create hand
    const hand = createHand();
    scene.add(hand);
    handRef.current = hand;

    // Animation loop
    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.016;

      if (gestureRef.current && hand) {
        const gesture = gestureRef.current;
        
        // Apply motion based on gesture type
        switch (gesture.motion) {
          case 'wave':
            hand.rotation.z = gesture.rotation[2] + Math.sin(time * gesture.speed * 3) * 0.3;
            break;
          case 'circle':
            hand.position.x = gesture.position[0] + Math.cos(time * gesture.speed * 2) * 0.3;
            hand.position.y = gesture.position[1] + Math.sin(time * gesture.speed * 2) * 0.3;
            break;
          case 'updown':
            hand.position.y = gesture.position[1] + Math.sin(time * gesture.speed * 4) * 0.4;
            break;
          case 'shake':
            hand.position.x = gesture.position[0] + Math.sin(time * gesture.speed * 8) * 0.2;
            break;
          case 'twist':
            hand.rotation.y = gesture.rotation[1] + Math.sin(time * gesture.speed * 3) * 0.5;
            break;
        }
      } else {
        // Idle floating
        hand.position.y = Math.sin(time * 2) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update hand gesture when word changes
  useEffect(() => {
    if (handRef.current && word) {
      const gesture = generateWordGesture(word);
      console.log(`Gesture for "${word}":`, gesture); // Debug log
      gestureRef.current = gesture;
      updateHandGesture(handRef.current, gesture);
    }
  }, [word]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

// Create 3D hand model
function createHand() {
  const hand = new THREE.Group();

  // Palm
  const palmGeometry = new THREE.BoxGeometry(1.5, 2, 0.4);
  const palmMaterial = new THREE.MeshPhongMaterial({
    color: 0x00f0ff,
    emissive: 0x004466,
    shininess: 30
  });
  const palm = new THREE.Mesh(palmGeometry, palmMaterial);
  hand.add(palm);

  // Create fingers
  const fingerPositions = [
    { x: -0.6, name: 'pinky' },
    { x: -0.3, name: 'ring' },
    { x: 0, name: 'middle' },
    { x: 0.3, name: 'index' },
  ];

  fingerPositions.forEach((pos, index) => {
    const finger = createFinger(index);
    finger.position.set(pos.x, 1.2, 0);
    finger.name = pos.name;
    hand.add(finger);
  });

  // Thumb
  const thumb = createFinger(4, true);
  thumb.position.set(-0.9, 0.3, 0.3);
  thumb.rotation.z = Math.PI / 3;
  thumb.name = 'thumb';
  hand.add(thumb);

  return hand;
}

// Create individual finger
function createFinger(index, isThumb = false) {
  const finger = new THREE.Group();
  const segments = isThumb ? 2 : 3;
  const segmentHeight = isThumb ? 0.4 : 0.5;
  const segmentWidth = isThumb ? 0.25 : 0.2;

  const material = new THREE.MeshPhongMaterial({
    color: 0x00f0ff,
    emissive: 0x004466,
    shininess: 30
  });

  for (let i = 0; i < segments; i++) {
    const geometry = new THREE.BoxGeometry(segmentWidth, segmentHeight, segmentWidth);
    const segment = new THREE.Mesh(geometry, material);
    segment.position.y = i * (segmentHeight + 0.05);
    segment.name = `segment${i}`;
    finger.add(segment);
  }

  return finger;
}

// Update hand gesture based on word
function updateHandGesture(hand, gesture) {
  if (!gesture) return;
  
  console.log('Updating hand with gesture:', gesture); // Debug
  
  const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
  
  // Update finger positions with more dramatic bending
  fingers.forEach((fingerName, index) => {
    const finger = hand.children.find(child => child.name === fingerName);
    if (finger) {
      const extension = gesture.fingers[index];
      console.log(`${fingerName}: ${extension}`); // Debug
      animateFinger(finger, extension);
    }
  });

  // Apply base rotation
  hand.rotation.x = gesture.rotation[0];
  hand.rotation.y = gesture.rotation[1];
  hand.rotation.z = gesture.rotation[2];
  
  // Apply base position
  hand.position.x = gesture.position[0];
  hand.position.y = gesture.position[1];
  hand.position.z = gesture.position[2];
  
  // Apply scale
  if (gesture.scale) {
    hand.scale.set(gesture.scale, gesture.scale, gesture.scale);
  }
}

// Animate finger extension with more dramatic bending
function animateFinger(finger, extension) {
  finger.children.forEach((segment, index) => {
    // More dramatic rotation based on extension
    const maxRotation = Math.PI / 1.5; // Increased from PI/2
    const targetRotation = -extension * maxRotation * (index + 1) / finger.children.length;
    segment.rotation.x = targetRotation;
  });
}

export default HandAvatar3D;
