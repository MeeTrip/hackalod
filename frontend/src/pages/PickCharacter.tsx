import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { globalContext } from '../contexts/GlobalContext'

const characters = [
  {
    name: 'Remco Evenepoel'
  },
  {
    name: 'Wout van Aert'
  },
  {
    name: 'Mathieu van der Poel'
  },
  {
    name: 'Michael Boogert'
  },
  {
    name: 'Thalita de Jong'
  },
  {
    name: 'Veronique Belleter'
  }
]

export default function PickCharacter() {
  const { setPlayer } = useContext(globalContext)
  return (
    <>
      <div className="page pick-character">
        <h1>Pick your character</h1>
        <img className="background" src="/images/background5.jpg" />
        <div className="characters">
          {characters.map((character, index) => (
            <Link to="/route" key={character.name} className="character" onClick={() => setPlayer(index + 1)}>
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
