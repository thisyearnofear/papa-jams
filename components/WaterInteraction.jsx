import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

const WaterInteraction = ({ position, content }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  const springs = useSpring({
    scale: hovered ? 1.2 : 1,
    opacity: hovered ? 1 : 0.8,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      // Make the content face the camera
      meshRef.current.lookAt(camera.position)
      
      // Add water-like movement
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.1
    }
  })

  return (
    <animated.group
      position={position}
      scale={springs.scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <mesh ref={meshRef}>
          <planeGeometry args={[3, 1.5]} />
          <meshStandardMaterial 
            color="#ffffff"
            transparent
            opacity={springs.opacity}
            side={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {content}
        </Text>
      </Float>
    </animated.group>
  )
}

export default WaterInteraction 