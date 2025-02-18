import * as THREE from "three"
import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import CustomShaderMaterial from "three-custom-shader-material"

import { useStore } from "../../hooks/useStore"

import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"

export const Water = () => {
  const waterLevel = useStore((state) => state.waterLevel)
  const waveSpeed = useStore((state) => state.waveSpeed)
  const waveAmplitude = useStore((state) => state.waveAmplitude)
  const foamDepth = useStore((state) => state.foamDepth)

  const materialRef = useRef()

  const {
    COLOR_BASE_NEAR,
    COLOR_BASE_FAR,
    WATER_LEVEL,
    WAVE_SPEED,
    WAVE_AMPLITUDE,
    FOAM_DEPTH
  } = useControls("Water", {
    COLOR_BASE_NEAR: { value: "#00fccd", label: "Near" },
    COLOR_BASE_FAR: { value: "#1ceeff", label: "Far" },
    WATER_LEVEL: {
      value: waterLevel,
      min: 0.5,
      max: 5.0,
      step: 0.1,
      label: "Water Level"
    },
    WAVE_SPEED: {
      value: waveSpeed,
      min: 0.5,
      max: 2.0,
      step: 0.1,
      label: "Wave Speed"
    },
    WAVE_AMPLITUDE: {
      value: waveAmplitude,
      min: 0.05,
      max: 0.5,
      step: 0.05,
      label: "Wave Amplitude"
    },
    FOAM_DEPTH: {
      value: foamDepth,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      label: "Foam"
    }
  })

  // Convert color hex values to three.js Color objects
  const COLOR_FAR = useMemo(
    () => new THREE.Color(COLOR_BASE_FAR),
    [COLOR_BASE_FAR]
  )

  useEffect(() => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uColorFar.value = COLOR_FAR
    materialRef.current.uniforms.uWaveSpeed.value = WAVE_SPEED
    materialRef.current.uniforms.uWaveAmplitude.value = WAVE_AMPLITUDE
  }, [COLOR_FAR, WAVE_SPEED, WAVE_AMPLITUDE])

  useFrame(({ clock }) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  useEffect(() => {
    // Update state
    useStore.setState(() => ({
      waterLevel: WATER_LEVEL,
      waveSpeed: WAVE_SPEED,
      waveAmplitude: WAVE_AMPLITUDE,
      foamDepth: FOAM_DEPTH
    }))
  }, [WAVE_SPEED, WAVE_AMPLITUDE, WATER_LEVEL, FOAM_DEPTH])

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={WATER_LEVEL}>
      <planeGeometry args={[256, 256]} />
      <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={THREE.MeshStandardMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColorFar: { value: COLOR_FAR },
          uWaveSpeed: { value: WAVE_SPEED },
          uWaveAmplitude: { value: WAVE_AMPLITUDE }
        }}
        color={COLOR_BASE_NEAR}
        transparent
      />
    </mesh>
  )
}
