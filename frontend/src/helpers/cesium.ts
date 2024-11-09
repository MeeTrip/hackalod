import {
  CallbackPositionProperty,
  Cartesian3,
  Cartographic,
  CatmullRomSpline,
  ClockRange,
  Color,
  createOsmBuildingsAsync,
  Ion,
  JulianDate,
  Math,
  Matrix4,
  Quaternion,
  SceneMode,
  Terrain,
  TimeInterval,
  TimeIntervalCollection,
  VelocityOrientationProperty,
  Viewer
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { throttle } from 'lodash-es'
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM

export const cesium = async (data: any[], tickCallback: (position: { lat: number; lng: number }) => void) => {
  const viewer = new Viewer('cesiumContainer', { terrain: Terrain.fromWorldTerrain(), vrButton: true })

  const osmBuildingsTileset = await createOsmBuildingsAsync()
  viewer.scene.primitives.add(osmBuildingsTileset)
  viewer.scene.globe.enableLighting = true
  viewer.scene.globe.depthTestAgainstTerrain = true

  const start = JulianDate.fromDate(data.at(0)![2])
  const stop = JulianDate.fromDate(data.at(-1)![2])
  const duration = stop.secondsOfDay - start.secondsOfDay

  viewer.clock.startTime = start.clone()
  viewer.clock.stopTime = stop.clone()
  viewer.clock.currentTime = start.clone()
  viewer.clock.multiplier = 10.0
  viewer.clock.clockRange = ClockRange.LOOP_STOP
  viewer.clock.shouldAnimate = true

  viewer.timeline.zoomTo(start, stop)

  // Prepare time samples.
  const times = data.map((_item: any, index: number) => parseFloat(`${index}.0`))
  const firstTime = times[0]
  const lastTime = times[times.length - 1]
  const delta = lastTime - firstTime

  const points = data.map((item: any) => Cartesian3.fromDegrees(parseFloat(item[1]), parseFloat(item[0])))
  const before = Cartesian3.fromDegrees(data.at(0)![1], data.at(0)![0])
  const after = Cartesian3.fromDegrees(data.at(-1)![1], data.at(-1)![0])

  // Calculate first and last tangents.
  const firstTangent = Cartesian3.subtract(points[0], before, new Cartesian3())
  const lastTangent = Cartesian3.subtract(after, points.at(-1)!, new Cartesian3())

  // Create the position spline.
  const positionSpline = new CatmullRomSpline({
    times: times,
    points: points,
    firstTangent: firstTangent,
    lastTangent: lastTangent
  })

  // Create the callback position property and make it return spline evaluations.
  const position = new CallbackPositionProperty(function (time, result) {
    const splineTime = (delta * JulianDate.secondsDifference(time!, start)) / duration
    if (splineTime < firstTime || splineTime > lastTime) {
      return undefined
    }
    return positionSpline.evaluate(splineTime, result)
  }, false)

  const orientation = new VelocityOrientationProperty(position)

  // Add a waypoints.
  for (let i = 0; i < points.length; ++i) {
    viewer.entities.add({
      position: points[i],
      point: {
        pixelSize: 8,
        color: Color.TRANSPARENT,
        outlineColor: Color.YELLOW,
        outlineWidth: 3
      }
    })
  }

  // Create the entity and bind its position to the callback position property
  viewer.entities.add({
    availability: new TimeIntervalCollection([
      new TimeInterval({
        start: start,
        stop: stop
      })
    ]),
    position: position,
    orientation: orientation,
    model: {
      uri: '/CesiumDrone.glb',
      minimumPixelSize: 64,
      maximumScale: 20000
    }
  })

  const camera = viewer.camera
  const scene = viewer.scene

  const scratchPosition = new Cartesian3()
  const scratchOrientation = new Quaternion()
  const scratchTransform = new Matrix4()
  const offset = new Cartesian3(-400, 0, 300)

  const throttledTick = throttle(tickCallback, 30000, { leading: true })

  // Update camera to follow entity's position and orientation
  viewer.clock.onTick.addEventListener(function (clock) {
    if (scene.mode === SceneMode.MORPHING) {
      return
    }
    const time = clock.currentTime
    const entityPosition = position.getValue(time, scratchPosition)
    const cartographic = Cartographic.fromCartesian(entityPosition!)

    throttledTick({
      lng: Math.toDegrees(cartographic.longitude),
      lat: Math.toDegrees(cartographic.latitude)
    })
    const entityOrientation = orientation.getValue(time, scratchOrientation)
    if (entityPosition === undefined || entityOrientation === undefined) {
      return
    }
    const transform = Matrix4.fromTranslationQuaternionRotationScale(
      entityPosition,
      entityOrientation,
      Cartesian3.ONE,
      scratchTransform
    )
    camera.lookAtTransform(transform, offset)
  })
}
