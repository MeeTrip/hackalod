import '@fontsource/press-start-2p'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AudioContextProvider from './contexts/GlobalContext'
import Execute from './pages/Execute'
import PickCharacter from './pages/PickCharacter'
import PickRoute from './pages/PickRoute'
import Start from './pages/start'
import './scss/styles.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Start />
  },
  {
    path: '/character',
    element: <PickCharacter />
  },
  {
    path: '/route',
    element: <PickRoute />
  },
  {
    path: '/execute',
    element: <Execute />
  }
])

createRoot(document.getElementById('root')!).render(
  <AudioContextProvider>
    <RouterProvider router={router} />
  </AudioContextProvider>
)
