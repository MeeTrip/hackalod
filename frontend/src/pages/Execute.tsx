import { createOsmBuildingsAsync, GpxDataSource, Ion, Terrain, Viewer } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { useContext, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { routes } from '../constants'
import { globalContext } from '../contexts/GlobalContext'
import { gpxFromData } from '../helpers/gpxFromData'
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM

export default function Execute() {
  const wrapper = useRef<HTMLDivElement>(null)
  const { route } = useContext(globalContext)
  const routeObject = routes[route]
  const { data = [] } = useSWR('routes', () => fetch(routeObject.apiLink).then(response => response.json()))

  useEffect(() => {
    if (!wrapper.current || !data.length) return
    const gpxBlobUrl = gpxFromData(data)
    let activeDataSource

    console.log(gpxBlobUrl)
    ;(async () => {
      const viewer = new Viewer('cesiumContainer', { terrain: Terrain.fromWorldTerrain(), vrButton: true })
      //   const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

      const osmBuildingsTileset = await createOsmBuildingsAsync()
      viewer.scene.primitives.add(osmBuildingsTileset)

      viewer.dataSources
        .add(
          GpxDataSource.load(gpxBlobUrl, {
            clampToGround: true
          })
        )
        .then(function (dataSource) {
          viewer.zoomTo(dataSource.entities)
          viewer.animation.viewModel.playForwardViewModel.command()
          //   activeDataSource = dataSource

          viewer.clock.onTick.addEventListener(function (clock) {
            // clock.multiplier = 0
            // console.log(clock.multiplier)
          })
        })

      //   // Set the initial camera to look at Seattle
      //   viewer.scene.camera.setView({
      //     destination: Cartesian3.fromDegrees(parseFloat(data[0].lat), parseFloat(data[0].lng), 370),
      //     orientation: {
      //       heading: Math.toRadians(10),
      //       pitch: Math.toRadians(-10)
      //     }
      //   })
    })()
  }, [wrapper, data])

  return (
    <>
      <div className="page execute">
        <div ref={wrapper} id="cesiumContainer"></div>
      </div>
    </>
  )
}
