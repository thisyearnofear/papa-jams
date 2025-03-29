import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Float, PerspectiveCamera } from '@react-three/drei'
import { useControls } from 'leva'
import { useSpring, animated } from '@react-spring/three'

const sections = [
  {
    title: 'Bio',
    position: [-15, 8, -10],
    rotation: [0, 0.2, 0],
    content: 'Papa is a visionary artist...',
    icon: '👤',
    expandedContent: 'Papa is a visionary artist whose unique blend of styles has captivated audiences worldwide. With a career spanning over a decade, their music transcends traditional boundaries, creating an immersive experience that resonates with listeners on a deep emotional level.'
  },
  {
    title: 'Latest Release',
    position: [15, 8, -10],
    rotation: [0, -0.2, 0],
    content: 'New album coming soon...',
    icon: '🎵',
    expandedContent: 'The highly anticipated new album "Waves" is set to release next month. Featuring collaborations with top artists and innovative production techniques, this album promises to push the boundaries of contemporary music.'
  },
  {
    title: 'Tour Dates',
    position: [0, 8, -15],
    rotation: [0, 0, 0],
    content: 'Upcoming shows...',
    icon: '🎪',
    expandedContent: 'Join Papa on their world tour this summer. Starting in June, the tour will visit major cities across Europe, North America, and Asia, bringing their unique live experience to fans worldwide.'
  }
]

const FloatingSection = ({ title, position, rotation, content, icon, expandedContent }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { camera } = useThree()
  
  const { color, opacity } = useControls(`${title} Section`, {
    color: { value: '#ffffff', label: 'Color' },
    opacity: { value: 0.9, min: 0, max: 1, step: 0.1 }
  })

  const springs = useSpring({
    scale: hovered ? 1.1 : 1,
    rotation: hovered ? [0, 0, 0] : rotation,
    position: position,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  const contentSpring = useSpring({
    scale: expanded ? 1 : 0,
    opacity: expanded ? 1 : 0,
    position: expanded ? [0, 4, 0] : [0, 0, 0],
    config: { mass: 1, tension: 280, friction: 60 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      // Make the section face the camera
      meshRef.current.lookAt(camera.position)
      
      // Add water-like movement
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.2
      meshRef.current.position.x = position[0] + Math.sin(time * 0.5) * 0.1
    }
  })

  const handleClick = () => {
    setExpanded(!expanded)
  }

  return (
    <animated.group
      position={springs.position}
      scale={springs.scale}
      rotation={springs.rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => !expanded && setHovered(false)}
      onClick={handleClick}
    >
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <mesh ref={meshRef}>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial 
            color={color}
            transparent
            opacity={opacity}
            side={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <Text
          position={[0, 0.5, 0.1]}
          fontSize={0.4}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
        <Text
          position={[-2, 0.5, 0.1]}
          fontSize={0.5}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {icon}
        </Text>

        <animated.group
          position={contentSpring.position}
          scale={contentSpring.scale}
        >
          <mesh>
            <planeGeometry args={[8, 5]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={contentSpring.opacity}
              side={2}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.2}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            maxWidth={7}
            lineHeight={1.5}
          >
            {expandedContent}
          </Text>
          <Text
            position={[0, 2, 0.1]}
            fontSize={0.15}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            Click to close
          </Text>
        </animated.group>
      </Float>
    </animated.group>
  )
}

export const FloatingSections = () => {
  return (
    <>
      {sections.map((section, index) => (
        <FloatingSection key={index} {...section} />
      ))}
    </>
  )
}

export default FloatingSections 