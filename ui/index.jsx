import { Sound } from "./Sound"
import s from "./ui.module.scss"

const UI = () => {
  return (
    <div className={s.ui}>
      <div className={s.top}>
        <Sound />
      </div>
    </div>
  )
}

export default UI
