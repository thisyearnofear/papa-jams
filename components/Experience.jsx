import { CameraControls, Environment, useProgress } from "@react-three/drei"
import { useControls } from "leva"
import { Suspense, useState, useEffect } from "react"
import { useSpring, animated } from "@react-spring/three"

import { Scene } from "./Scene"
import { Audio } from "./Audio"
import { FloatingSections } from "./FloatingSections"
import WaterInteraction from "./WaterInteraction"

const Experience = () => {
  const [interactions, setInteractions] = useState([])
  const { progress } = useProgress()
  const [isMobile, setIsMobile] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Interactive color parameters
  const { BACKGROUND } = useControls("Sky", {
    BACKGROUND: { value: "#fcffdc", label: "Background" }
  })

  // Handle water surface clicks
  const handleWaterClick = (event) => {
    if (event.object.name === 'water') {
      const point = event.point
      setInteractions(prev => [...prev, {
        id: Date.now(),
        position: [point.x, 0.5, point.z],
        content: 'New interaction point'
      }])
    }
  }

  // Handle window resize and device detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    window.addEventListener('resize', handleResize)
    checkTouchDevice()
    
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Environment preset="forest" environmentIntensity={0.5} />
      <ambientLight intensity={1.0} />

      <directionalLight
        position={[13, 5, 5]}
        castShadow
        intensity={2.5}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach="shadow-camera"
          left={-30}
          right={30}
          top={30}
          bottom={-30}
        />
      </directionalLight>

      <Audio />

      <CameraControls
        maxPolarAngle={Math.PI / 2.2}
        maxDistance={100}
        minDistance={20}
        enabled={!isMobile}
        touchEnabled={isMobile}
        dollyToCursor={isTouchDevice}
        smoothTime={0.5}
        dragToLook={isTouchDevice}
        target={[0, 0, 0]}
      />

      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, 120, 150]} />

      <Scene onClick={handleWaterClick} />
      
      <Suspense fallback={null}>
        <FloatingSections />
        {interactions.map(interaction => (
          <WaterInteraction
            key={interaction.id}
            position={interaction.position}
            content={interaction.content}
          />
        ))}
      </Suspense>
    </>
  )
}

export default Experience
