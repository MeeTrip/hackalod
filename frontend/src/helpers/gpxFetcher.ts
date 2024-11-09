import { parseGPX } from '@we-gold/gpxjs'

export const gpxFetcher = (localName: string) => () =>
  fetch(`/${localName}.xml`)
    .then(response => response.text())
    .then(gpx => {
      const [output] = parseGPX(gpx)
      return (
        output!.routes[0].points.map((point, index) => [
          point.latitude,
          point.longitude,
          new Date(Date.now() + index * 1000)
        ]) ?? []
      )
    })
