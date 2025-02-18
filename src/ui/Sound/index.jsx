import { clsx } from "clsx"

import { useStore } from "../../hooks/useStore"
import { Volume } from "./icons"

import s from "./sound.module.scss"

export const Sound = () => {
  const audioEnabled = useStore((state) => state.audioEnabled)
  const setAudioEnabled = useStore((state) => state.setAudioEnabled)

  const handleVolume = () => {
    setAudioEnabled(!audioEnabled)
  }

  return (
    <div className={s.volume}>
      <button
        className={clsx(s.toggle, { [s.enabled]: audioEnabled })}
        onClick={() => handleVolume()}
      >
        <Volume />
      </button>
    </div>
  )
}
