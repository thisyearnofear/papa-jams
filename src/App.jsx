import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import { Experience } from "./components/Experience"
import { UI } from "./ui"

function App() {
  return (
    <>
      <Leva />

      <Canvas camera={{ position: [30, 10, -30], fov: 35 }} shadows>
        <Experience />
      </Canvas>

      <UI />
    </>
  )
}

export default App
