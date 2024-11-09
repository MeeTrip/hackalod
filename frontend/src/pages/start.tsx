import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { globalContext } from '../contexts/GlobalContext'

export default function Start() {
  const { play } = useContext(globalContext)

  return (
    <div className="page start">
      <h1>Tour de Tijd</h1>

      <img className="background" src="/images/background5.jpg" />
      <Link className="nes-btn" onClick={play} to="/character">
        START
      </Link>
    </div>
  )
}
