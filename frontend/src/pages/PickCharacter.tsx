import { useContext } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { globalContext } from '../contexts/GlobalContext'

export default function PickCharacter() {
  const { data: players = [] } = useSWR<{ name: string; id: string }[]>('players', () =>
    fetch(`https://api.triplydb.com/queries/MeeTrip/racers/run`).then(response => response.json())
  )

  const { setPlayer } = useContext(globalContext)
  return (
    <>
      <div className="page pick-character">
        <h1>Pick your character</h1>
        <img className="background" src="/images/background5.jpg" />
        <div className="characters">
          {players.map((player, index) => (
            <Link to="/route" key={player.id} className="character" onClick={() => setPlayer(player.id)}>
              <h2 className="name">{player.name}</h2>
              <img className="player" src={`/images/players/${index + 1}.png`} />
              <img className="bike" src={`/images/bikes/${index + 1}.png`} />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
