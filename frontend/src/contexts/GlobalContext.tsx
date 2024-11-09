import { useLocalStorage } from '@uidotdev/usehooks'
import { Howl } from 'howler'
import { createContext, ReactNode, useState } from 'react'

export const globalContext = createContext<{
  play: () => void
  pause: () => void
  player: string
  setPlayer: (number: string) => void
  route: string
  setRoute: (number: string) => void
}>({
  play: () => null,
  pause: () => null,
  player: '',
  setPlayer: (id: string) => null,
  route: '',
  setRoute: (id: string) => null
})

export default function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [sound] = useState(new Howl({ src: ['/background.mp3'] }))
  const [player, setPlayer] = useLocalStorage<string>('player', '')
  const [route, setRoute] = useLocalStorage<string>('route', '')

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
