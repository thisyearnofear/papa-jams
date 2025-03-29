import dynamic from "next/dynamic"
import { Suspense } from "react"
import clsx from "clsx"
import { Canvas } from "@react-three/fiber"
import { AdaptiveDpr } from "@react-three/drei"
import { Leva } from "leva"

// Dynamically import components that use Three.js
const Experience = dynamic(() => import("../components/Experience"), {
  ssr: false
})
const UI = dynamic(() => import("../ui"), { ssr: false })
const Loading = dynamic(() => import("../ui/Loading"), { ssr: false })

import { useStore } from "../hooks/useStore"
import s from "../ui/ui.module.scss"

export default function Home() {
  const ready = useStore((state) => state.ready)

  return (
    <>
      <Loading />
      <Suspense>
        <div className={clsx(s.transition, { [s.show]: ready })}>
          <Leva hidden={!ready} />

          <Canvas camera={{ position: [30, 10, -30], fov: 35 }} shadows>
            <Experience />
            <AdaptiveDpr pixelated />
          </Canvas>

          <UI />
        </div>
      </Suspense>
    </>
  )
}
