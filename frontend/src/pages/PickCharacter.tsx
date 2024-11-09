import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { characters } from '../constants'
import { globalContext } from '../contexts/GlobalContext'

export default function PickCharacter() {
  const { setPlayer } = useContext(globalContext)
  return (
    <>
      <div className="page pick-character">
        <h1>Pick your character</h1>
        <img className="background" src="/images/background5.jpg" />
        <div className="characters">
          {characters.map((character, index) => (
            <Link to="/route" key={character.name} className="character" onClick={() => setPlayer(index)}>
              <h2 className="name">{character.name}</h2>
              <img className="player" src={`/images/players/${index + 1}.png`} />
              <img className="bike" src={`/images/bikes/${index + 1}.png`} />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
