export const gpxFromData = (data: any[]) => {
  const gpx = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="Gartrip 207" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
<trk>
<trkseg>${data
    .map(
      (point: any) =>
        `<trkpt lat="${point.lat}" lon="${point.lng}"><time>${point.time}</time><ele>${point.ele}</ele></trkpt>`
    )
    .join('')}</trkseg>
</trk>
</gpx>`

  const gpxBlob = new Blob([gpx], { type: 'application/gpx' })
  const gpxBlobUrl = URL.createObjectURL(gpxBlob)
  return gpxBlobUrl
}
