import { bbox, bboxPolygon, lineString } from '@turf/turf'
import 'leaflet/dist/leaflet.css'
import { useContext, useEffect } from 'react'
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { globalContext } from '../contexts/GlobalContext'

function Gpx({ apiLink }: { apiLink: string }) {
  const { data = [], error, isLoading } = useSWR('routes', () => fetch(apiLink).then(response => response.json()))

  const points = data.map((item: any) => [item.lat, item.lng])
  const map = useMap()

  useEffect(() => {
    if (!data.length) return
    const line = lineString(points)
    const bboxMap = bbox(line)
    map.fitBounds(bboxPolygon(bboxMap).geometry.coordinates)
  }, [data])

  return !isLoading && !error ? <Polyline pathOptions={{ fillColor: 'red', color: 'blue' }} positions={points} /> : null
}

export default function PickRoute() {
  const { setRoute, player } = useContext(globalContext)
  const { data: routes = [] } = useSWR<{ name: string; id: string }[]>('routes', () =>
    fetch(`https://api.triplydb.com/queries/MeeTrip/Circuits/run?participant=${encodeURIComponent(player)}`).then(
      response => response.json()
    )
  )

  return (
    <div className="page pick-route">
      <h1>Pick a route</h1>
      <img className="background" src="/images/background5.jpg" />

      <div className="routes">
        {routes.map((route, index) => (
          <div className="route" key={route.name}>
            <h2 className="name">{route.name}</h2>
            <Link to="/execute" onClick={() => setRoute(route.id)}>
              <MapContainer className="map" center={[0, 0]} zoom={9}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* <Gpx apiLink={route.apiLink} /> */}
              </MapContainer>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
