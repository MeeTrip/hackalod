import { Howl } from 'howler'
import { createContext, ReactNode, useState } from 'react'

export const globalContext = createContext<{
  play: () => void
  pause: () => void
  player: number
  setPlayer: (number: number) => void
  route: number
  setRoute: (number: number) => void
}>({
  play: () => null,
  pause: () => null,
  player: 0,
  setPlayer: (number: number) => null,
  route: 0,
  setRoute: (number: number) => null
})

export default function AudioContextProvider({ children }: { children: ReactNode }) {
  const [sound] = useState(new Howl({ src: ['/background.mp3'] }))
  const [player, setPlayer] = useState<number>(0)
  const [route, setRoute] = useState<number>(0)

  return (
    <globalContext.Provider
      value={{
        play: () => (sound.playing() ? null : sound.play()),
        pause: () => sound.pause(),
        player,
        setPlayer,
        route,
        setRoute
      }}
    >
      {children}
    </globalContext.Provider>
  )
}
