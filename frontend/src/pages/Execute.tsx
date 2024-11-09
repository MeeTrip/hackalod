import { lineString, nearestPointOnLine, point } from '@turf/turf'
import { useContext, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { globalContext } from '../contexts/GlobalContext'
import { cesium } from '../helpers/cesium'
import { gpxFetcher } from '../helpers/gpxFetcher'

const stub = `[{"types":"schilderij","naam":"Madame Edith Marie Antoinette Constance van Eersel, the Artist's Wife","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2672/manifest.json"},{"types":"schilderij","naam":"Madame Edith Marie Antoinette Constance van Eersel, femme de l'artiste","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2672/manifest.json"},{"types":"schilderij","naam":"Frau Edith Marie Antoinette Constance van Eersel, Weib des Künstlers","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2672/manifest.json"},{"types":"schilderij","naam":"Mevrouw Edith Marie Antoinette Constance van Eersel, vrouw van de kunstenaar","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2672/manifest.json"},{"types":"schilderij","naam":"The Forester","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2174/manifest.json"},{"types":"schilderij","naam":"Förster","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2174/manifest.json"},{"types":"schilderij","naam":"Le garde-chasse","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2174/manifest.json"},{"types":"schilderij","naam":"Boswachter","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2174/manifest.json"},{"types":"schilderij","naam":"Self Portrait","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2670/manifest.json"},{"types":"schilderij","naam":"Zelfportret","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2670/manifest.json"},{"types":"schilderij","naam":"Autoritratto","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2670/manifest.json"},{"types":"schilderij","naam":"Autorretrato","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2670/manifest.json"},{"types":"schilderij","naam":"Autoportrait","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2670/manifest.json"},{"types":"schilderij","naam":"Selbstporträt","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2670/manifest.json"},{"types":"schilderij","naam":"Fantasia in Egypte","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1592/manifest.json"},{"types":"schilderij","naam":"Fantasy in Egypt","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1592/manifest.json"},{"types":"schilderij","naam":"Fantasia en Égypte","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1592/manifest.json"},{"types":"schilderij","naam":"Fantasia in Ägypten","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1592/manifest.json"},{"types":"etsen ets","naam":"Portrait of a Young Woman","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2616/manifest.json"},{"types":"etsen ets","naam":"Portrait d'une jeune femme","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2616/manifest.json"},{"types":"etsen ets","naam":"Portret van een jonge vrouw","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2616/manifest.json"},{"types":"schilderij","naam":"Philip II of Spain Honours Don John of Austria","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1386/manifest.json"},{"types":"schilderij","naam":"Philippe II rendant les derniers hommages à Don Juan d'Autriche","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1386/manifest.json"},{"types":"schilderij","naam":"Filips II bewijst de laatste eer aan Don Juan van Oostenrijk","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1386/manifest.json"},{"types":"schilderij","naam":"Philipp II erweist Johannes von Österreich die letzte Ehre","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1386/manifest.json"},{"types":"schilderij","naam":"Aux bords du Nil","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2669/manifest.json"},{"types":"schilderij","naam":"Aan de Nijl","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2669/manifest.json"},{"types":"schilderij","naam":"At the Nile","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2669/manifest.json"},{"types":"schilderij","naam":"Das verbotene Buch","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/4035/manifest.json"},{"types":"schilderij","naam":"De joden in de middeleeuwen","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/4035/manifest.json"},{"types":"schilderij","naam":"La lecture prohibée","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/4035/manifest.json"},{"types":"schilderij","naam":"The Banned Book","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/4035/manifest.json"},{"types":"tekeningen tekening","naam":"La lecture prohibée","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1906/manifest.json"},{"types":"tekeningen tekening","naam":"Het verboden boek","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1906/manifest.json"},{"types":"tekeningen tekening","naam":"The Banned Book","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/1906/manifest.json"},{"types":"schilderij","naam":"Madame Edith Marie Antoinette Constance van Eersel, the Artist's Wife","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2671/manifest.json"},{"types":"schilderij","naam":"Mevrouw Edith Marie Antoinette Constance van Eersel, vrouw van de kunstenaar","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2671/manifest.json"},{"types":"schilderij","naam":"Madame Edith Marie Antoinette Constance van Eersel, femme de l'artiste","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2671/manifest.json"},{"types":"schilderij","naam":"Frau Edith Marie Antoinette Constance van Eersel, Weib des Künstlers","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2671/manifest.json"},{"types":"etsen ets","naam":"Le compositeur Adriaan Willaert en concert","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2617/manifest.json"},{"types":"etsen ets","naam":"The Composer Adriaan Willaert in Concert","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2617/manifest.json"},{"types":"etsen ets","naam":"De componist Adriaan Willaert in concert","descr":null,"media":"https://projectmirador.org/embed/?iiif-content=https://iiif.kmska.be/iiif/2/2617/manifest.json"}]`
export default function Execute() {
  const wrapper = useRef<HTMLDivElement>(null)
  const { route } = useContext(globalContext)
  const localName = route.split(/\/|\#/g).pop()!
  const [index, setIndex] = useState(0)
  const [info, setInfo] = useState<{ naam: string; descr: string; types: string; media: string }[]>(JSON.parse(stub))

  useEffect(() => {
    setInterval(() => {
      setIndex(current => {
        if (current + 1 < info.length) return current + 1
        return 0
      })
    }, 5000)
  }, [])

  const { data: points, error, isLoading } = useSWR(`route-${localName}`, gpxFetcher(localName))

  const [isInitiated, setIsInitiated] = useState(false)
  const [clock, setClock] = useState()

  useEffect(() => {
    setInterval(() => {
      if (clock) {
        fetch('http://192.168.167.37/read-data')
          .then(response => response.json())
          .then(data => parseInt(data.data))
          .then(speed => {
            console.log(clock)
            clock.multiplier = 0.2 * speed
          })
      }
    }, 1000)
  }, [clock])

  useEffect(() => {
    if (!wrapper.current || !points?.length || isInitiated) return
    const line = lineString(points as any)

    const clock = cesium(points, async ({ lat, lng }) => {
      const pt = point([lat, lng])
      const snapped = nearestPointOnLine(line, pt, { units: 'miles' })

      // fetch(
      //   `https://api.triplydb.com/queries/MeeTrip/prod/3/run?pageSize=1&wkt=${encodeURIComponent(
      //     `Point (${snapped.geometry.coordinates[1]} ${snapped.geometry.coordinates[0]})`
      //   )}`
      // )
      //   .then(response => response.json())
      //   .then(setInfo)
    })
    clock.then(setClock)
    setIsInitiated(true)
  }, [wrapper, points])

  return (
    <>
      <div className="page execute">
        <div className="info">
          <div key={info[index].naam} className="info">
            <h1>{info[index].naam}</h1>
            <span>{info[index].descr}</span>
            <em>{info[index].types}</em>
            <iframe src={info[index].media}></iframe>
          </div>
        </div>
        <div ref={wrapper} id="cesiumContainer"></div>
      </div>
    </>
  )
}
